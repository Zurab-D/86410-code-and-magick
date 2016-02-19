/* global Gallery */

'use strict';

(function() {
  var gallery = new Gallery();


  /**
   * Вешаем на клики по картинкам вызов фотогалереи
   */
  var galImages = document.querySelectorAll('.photogallery-image');
  Array.prototype.forEach.call(galImages, function(item) {
    item.addEventListener('click', function(evt) {
      evt.preventDefault();
      gallery.show();
    });
  });
})();
