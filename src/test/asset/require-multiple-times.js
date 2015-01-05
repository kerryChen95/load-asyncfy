typeof window.requireMultipletimes === 'undefined' ?
  (window.requireMultipletimes = 1) :
  ++window.requireMultipletimes

console.log(
  'Module required-multiple-times excuted ' +
  window.requireMultipletimes +
  ' times'
)
