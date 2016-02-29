/* global requirejs, define */

'use strict';

requirejs.config({
  baseUrl: 'js'
});

//define(['msg', 'review-filter-base', 'review-filter-all', 'review-filter-recent', 'review-filter-good', 'review-filter-bad', 'review-filter-popular', 'game', 'photos', 'form', 'reviews'], function(Msg) {
define(['msg', 'game', 'photos', 'form', 'reviews'], function(Msg) {
  if (Msg) {
    window.msg = new Msg();
    console.log2 = console.log;
    console.log = function(par) {
      window.msg.show(par);
    };
  }
});
