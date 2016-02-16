'use strict';

(function() {

  /**
   * Конструктор галереи
   * @constructor
   */
  function Gallery() {
    this.element = document.querySelector('.overlay-gallery');
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onControlsClick = this._onControlsClick.bind(this);
    //console.log('Gallery()');
  }



  /**
   * Функция показа галереи
   */
  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');
    this.element.querySelector('.overlay-gallery-close').addEventListener('click', this._onCloseClick);
    this.element.querySelector('.overlay-gallery-controls').addEventListener('click', this._onControlsClick);
    window.addEventListener('keydown', this._onDocumentKeyDown);
    console.log('Gallery.show()');
  };



  /**
   * Функция сокрытия галереи
   */
  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');
    this.element.querySelector('.overlay-gallery-close').removeEventListener('click', this._onCloseClick);
    window.removeEventListener('keydown', this._onDocumentKeyDown);
    console.log('Gallery.hide()');
  };



  /**
   * Функция обработки клика по крестику
   */
  Gallery.prototype._onCloseClick = function() {
    this.hide();
    console.log('Gallery._onCloseClick()');
  };



  /**
   * Функция обработки клавиатуры
   */
  Gallery.prototype._onDocumentKeyDown = function() {
    if (event.keyCode === 27) {
      this.hide();
      console.log('Gallery._onDocumentKeyDown()');
    }
  };



  /**
   * Функция обработки кликов по контролам галереи
   * @param {Event} event
   */
  Gallery.prototype._onControlsClick = function(event) {
    console.log('Gallery._onControlsClick() ...');
    if (event.target.classList.contains('overlay-gallery-control-left')) {
      console.log('... Gallery._onControlLeft');
    } else if (event.target.classList.contains('overlay-gallery-control-right')) {
      console.log('... Gallery._onControlRight');
    } else if (event.target.classList.contains('overlay-gallery-preview')) {
      console.log('... Gallery._onPreviewClick');
    }
  };



  /**
   * Прокидываем тип галареи в ГОВ
   */
  window.Gallery = Gallery;
})();
