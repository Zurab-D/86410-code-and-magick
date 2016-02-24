'use strict';

(function(window) {
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

  window.Photo = Photo;
})(window);

/* global Photo */
//data-replacement-video
(function() {
  /**
   * @constructor Video
   */
  function Video() {
    Photo.apply(this, arguments);
  }

  Video.prototype.render = function() {
  };
})();
