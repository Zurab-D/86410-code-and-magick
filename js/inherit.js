'use strict';

(function() {
  /**
   * @param {Function} Child
   * @param {Function} Parent
   */
  function inherit(Child, Parent) {
    var TempConstructor = function() {};
    TempConstructor.prototype = Parent.prototype;
    Child.prototype = new TempConstructor();
  }

  window.inherit = inherit;
})();
