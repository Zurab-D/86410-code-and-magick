/* global define */

'use strict';

define([], function() {
  /**
   * @constructor Photo
   */
  function Photo(src) {
    this.src = src;
  }

  Photo.prototype.render = function() {
    var newImage = new Image();
    newImage.src = this.src;
  };

  return Photo;
});

/* global Photo */
////data-replacement-video
//(function() {
//  /**
//   * @constructor Video
//   */
//  function Video() {
//    Photo.apply(this, arguments);
//  }
//
//  Video.prototype.render = function() {
//  };
//})();
