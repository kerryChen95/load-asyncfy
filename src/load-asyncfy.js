var Q = require('q')

var win = window
var doc = win.document
// head element
var headEl = doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement
var noop = function () {}
var hasOwnProperty = ({}).hasOwnProperty
// The URLs passed into `loadAsyncfy`
var passedUrls = {}

var IS_CSS_RE = /\.css(?:\?|$)/i

// `onload` event is not supported in WebKit < 535.23 and Firefox < 9.0
// ref:
//  - https://bugs.webkit.org/show_activity.cgi?id=38995
//  - https://bugzilla.mozilla.org/show_bug.cgi?id=185236
//  - https://developer.mozilla.org/en/HTML/Element/link#Stylesheet_load_events
var isOldWebKit = +navigator.userAgent
    .replace(/.*(?:AppleWebKit|AndroidWebKit)\/(\d+).*/, "$1") < 536

/**
 * Promise to load a JavaScript or CSS file.
 * @param {string} url URL of JavaScript or CSS file to load. If relative
 *        URL, it's relative to document's URL. If it's JavaScript file,
 *        no need to end with `.js`.
 * @param {Object} [options] Optional configs.
 * @param {string} [options.charset] The character encoding of the file
 *        content.
 * @param {string=undefined} [options.crossorigin] Only `anonymous` and
 *        `use-credentials` are valid.
 *        Ref:
 *        https://github.com/seajs/seajs/issues/972
 * @param {Node=head} [options.container] The DOM node used as container of
 *        the element to be inserted. For example, useful when you wanna
 *        insert CSS files into an iframe.
 * @param {string=''|array=[]} [options.fulfilledWith] Global variable name(s)
 *        which promise will be fulfilled with. Only make sense when load
 *        JavaScript file.
 * @return {object} A promise to load the JavaScript or CSS file.
 */
module.exports = function loadAsyncfy (url, options) {
  var deferred = Q.defer()
  options = options || {}

  // Use `call` to be compatible with the case that a key named `hasOwnProperty` is added
  // TODO:
  // Resolve `url` as absolute URL first.
  // Ref:
  // http://stackoverflow.com/questions/470832/getting-an-absolute-url-from-a-relative-one-ie6-issue/
  if (hasOwnProperty.call(passedUrls, url)) {
    // Resolve the promise after return it
    setTimeout(function () {
      deferred.resolve(getGlobalVars(options.fulfilledWith))
    }, 1)
    return deferred.promise
  }
  else {
    passedUrls[url] = true
  }

  // To load files from cross-origin, dynamicly create `link` or `script` tag
  // to load CSS or JavaScript file respectively.
  // Ref:
  // https://github.com/jquery/jquery/blob/2.1.3/dist/jquery.js#L8679
  var isCss = IS_CSS_RE.test(url)
  var node = doc.createElement(isCss ? 'link' : 'script')

  addAttr(node, isCss, options)
  addOnload(node, isCss, deferred, options)
  isCss ? (node.href = url) : (node.src = url = url + '.js')
  ;(options.container || headEl).appendChild(node)

  return deferred.promise
}

function addAttr (node, isCss, options) {
  if (options.charset) {
    node.charset = options.charset
  }
  switch (options.crossorigin) {
    case 'anonymous':
    case 'use-credentials':
      // Support capturing errors from cross-origin scripts
      node.crossorigin = options.crossorigin
      break
  }
  if (isCss) {
    node.rel = 'stylesheet'
  }
}

function addOnload (node, isCss, deferred, options) {
  var supportOnload = 'onload' in node

  // for Old WebKit and Old Firefox
  if (isCss && (isOldWebKit || !supportOnload)) {
    // Start poll CSS file after inserting into DOM
    setTimeout(function () {
      pollCss(node, deferred, options)
    }, 1)
    return
  }

  if (supportOnload) {
    node.onload = onload
    node.onerror = onerror
  }
  else {
    node.onreadystatechange = function () {
      if (/loaded|complete/.test(node.readyState)) {
        onload()
      }
    }
  }

  function onload () {
    // 1. Make sure run only once.
    // 2. Prevent menory leak.
    node.onload = node.onerror = node.onreadystatechange = null

    node = null
    deferred.resolve(getGlobalVars(options.fulfilledWith))
  }
  function onerror (errorEvent) {
    deferred.reject(errorEvent)
  }
}

function pollCss (node, deferred, options) {
  var sheet = node.sheet
  var isLoaded

  // For Webkit < 536
  if (isOldWebKit) {
    if (sheet) {
      isLoaded = true
    }
  }
  // For firefox < 9.0
  else if (sheet) {
    try {
      if (sheet.cssRules) {
        isLoaded = true
      }
    }
    catch (er) {
      // The value of `er.name` is changed from "NS_ERROR_DOM_SECURITY_ERR"
      // to "SecurityError" since Firefox 13.0. But Firefox is less than 9.0
      // in here, So it is ok to just rely on "NS_ERROR_DOM_SECURITY_ERR"
      if (er.name === "NS_ERROR_DOM_SECURITY_ERR") {
        isLoaded = true
      }
    }
  }

  if (isLoaded) {
    deferred.resolve(getGlobalVars(options.fulfilledWith))
  }
  else {
    deferred.reject()
  }
}

// Delay resolving promise,
// for JavaScript files, wait scripts to be excuted,
// for CSS files, wait style to be rendered,
// the 20 milliseconds comes from Sea.js.
function delayResolve (deferred) {
  var originResolve = deferred.resolve;
  var originReject = deferred.reject;
  deferred.resolve = function () {
    var args = [].slice.call(arguments, 0)
    setTimeout(function () {
      originResolve.apply(deferred, args)
    }, 20)
  }
  deferred.reject = function () {
    var args = [].slice.call(arguments, 0)
    setTimeout(function () {
      originReject.apply(deferred, args)
    }, 20)
  }
}

function getGlobalVars (name) {
  if (!name) {
    return
  }
  else if (typeof name === 'string') {
    return win[name]
  }

  var globalVars = []
  var names = name
  name = null
  var l = names.length
  var i
  for (i = 0; i < l; ++i) {
    globalVars.push(win[names[i]])
  }
  return globalVars
}
