/* global requirejs, define */

'use strict';

requirejs.config({
  baseUrl: 'js'
});

define(['msg', 'game', 'photos', 'form', 'reviews'], function(Msg) {
  if (Msg) {
    window.msg = new Msg();
    console.log2 = console.log;
    console.log = function(par) {
      window.msg.show(par);
    };
  }
});
