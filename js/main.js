/* global requirejs, define */

'use strict';

requirejs.config({
  baseUrl: 'js'
});

define(['msg', 'get-window', 'game', 'photos', 'form', 'reviews'], function(Msg, getWindow) {
  if (Msg) {
    var win = getWindow();
    win.msg = new Msg();
    console.log2 = console.log;
    console.log = function(par) {
      win.msg.show(par);
    };
  }
});
