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

* [ ] Promise to load multiple JavaScript files
* [ ] Test browsers
  * [ ] IE8+
  * [ ] Firefox
  * [ ] Safari
  * [x] Chrome

### Major

* [ ] Support `options.charset`
* [ ] Support `options.crossorigin`

### Minor

* [ ] Write README.md doc: how to set up
* [ ] Promise to load multiple CSS files
* [ ] Make unit test as doc

## V0.2

### Blocker

* [ ] `options.fulfilledWith` can be provided as function which return module's `exports` object
* [ ] Check and save absolute URL
* [ ] Support `options.waitGlobalVars`: if `ture`, will not resolve until specified global variables all have values.
* [ ] Test poll CSS file

### Critical

* [ ] Make source-map directories more natural

## V0.3

* [ ] Support `options.checkLoaded(node, done)`: custom check whether loaded and call `done()` if loaded
* [ ] Support `options.timeout=15000ms`

## V0.4

* [ ] Test in mobile browsers
