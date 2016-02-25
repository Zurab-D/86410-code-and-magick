/* global define */

'use strict';

define([
  'photo',
  'gallery'
], function(Photo, Gallery) {

  /**
   *  Сздание массива из объектов фотографий (Photo)
   */
  var galleryImages = document.querySelectorAll('.photogallery img');

  /** @type {Array.<Object>} */
  var photos = Array.prototype.map.call(galleryImages, function(item) {
    return new Photo(item.getAttribute('src'));
  });



  /**
   * Инициализируем галерею
   * @type {Object}
   */
  var gallery = new Gallery(photos);
  //gallery.setPictures(photos);



  /**
   * Вешаем на клики по картинкам вызов фотогалереи
   */
  var galImages = document.querySelectorAll('.photogallery-image');
  Array.prototype.forEach.call(galImages, function(itmage, i) {
    itmage.addEventListener('click', function(evt) {
      evt.preventDefault();
      gallery.setCurrentPicture(i);
      gallery.show();
    });
  });
});
