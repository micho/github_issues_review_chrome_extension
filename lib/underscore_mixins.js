(function () {
  // Extend underscore functionality for the greater good
  var extended = {};

  /**
   * Wrap your functions and assing a callback when the aync calls are all back
   *
   * @return {Function}
   */
  extended.parallel = function () {
    var count = 0;

    return function parallel(fn) {
      count++;
      fn = fn || function () {};

      return function () {
        fn.apply(fn, arguments);
        if (!--count) {
          parallel.callback();
        }
      };
    };
  };

  _.mixin(extended);
}());
