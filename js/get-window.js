'use strict';

define([], function() {
  function getWindow() {
    if (parent) {
      return parent.window;
    } else {
      return window;
    }
  }

  return getWindow;
})