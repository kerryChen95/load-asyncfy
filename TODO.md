# TODO of Each Version

## V0.1

### Blocker

* [x] Promise to load a JavaScript file
  * [x] Resolve promise when loaded
  * [x] Reject promise when error
* [x] Promise to load a CSS file
  * [x] Resolve promise when loaded
  * [x] Reject promise when error
* [x] Not load the JavaScript file again which has been required to load
* [x] Not load the CSS file again which has been required to load
* [x] Support `options.container`
* [x] Support `options.fulfilledWith`
* [x] Rename module name `load-asyncfy` to `promise-require`

### Critical

* [x] Must have extension name `.js` for JS files
* [ ] Rename `options.fulfilledWith` to `options.fulfillWith`
* [ ] Promise to load multiple JavaScript files
* [ ] Test browsers
  * [ ] IE8+
  * [ ] Firefox
  * [ ] Safari
  * [x] Chrome

### Major

* [x] `options.fulfilledWith` support provided as function
* [ ] Support `options.charset`
* [ ] Support `options.crossorigin`
* [ ] Test poll CSS file

### Minor

* [ ] Write README.md doc: how to set up
* [ ] Promise to load multiple CSS files
* [ ] Make unit test as doc

## V0.2

### Blocker

* [ ] Use absolute URL and container's document to determine whether to load
* [ ] Support `options.timeout=15000ms`

### Critical

* [ ] Make source-map directories more natural

## V0.3

* [ ] Support `options.checkLoaded(node, done)`: custom check whether loaded and call `done()` if loaded

## V0.4

* [ ] Test in mobile browsers
