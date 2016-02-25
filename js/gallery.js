/* global define */

'use strict';

define([], function() {
  /* клавиша Escape */
  var KEY_ESCAPE = 27;
  var KEY_LEFT = 37;
  var KEY_RIGHT = 39;

  /**
   * Конструктор галереи
   * @param {Array.<Object>} photos  Массив объектов фотографий
   * @constructor
   */
  function Gallery(photos) {
    this._element = document.querySelector('.overlay-gallery');
    this._preview = this._element.querySelector('.overlay-gallery-preview');
    this._numberCurrentElem = this._preview.querySelector('.preview-number-current');
    this._numberTotalElem = this._preview.querySelector('.preview-number-total');
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onControlsClick = this._onControlsClick.bind(this);
    this.setPictures(photos);
  }



  /**
   * Функция показа галереи
   */
  Gallery.prototype.show = function() {
    this._element.classList.remove('invisible');
    this._element.querySelector('.overlay-gallery-close').addEventListener('click', this._onCloseClick);
    this._element.querySelector('.overlay-gallery-controls').addEventListener('click', this._onControlsClick);
    window.addEventListener('keydown', this._onDocumentKeyDown);
    this._numberTotalElem.innerText = this.totalCount;
  };



  /**
   * Функция сокрытия галереи
   */
  Gallery.prototype.hide = function() {
    this._element.classList.add('invisible');
    this._element.querySelector('.overlay-gallery-close').removeEventListener('click', this._onCloseClick);
    window.removeEventListener('keydown', this._onDocumentKeyDown);
  };



  /**
   * Функция обработки клика по крестику
   */
  Gallery.prototype._onCloseClick = function() {
    this.hide();
  };



  /**
   * Функция обработки клавиатуры
   */
  Gallery.prototype._onDocumentKeyDown = function() {
    switch (event.keyCode) {
      case KEY_ESCAPE:
        this.hide();
        break;
      case KEY_LEFT:
        this._onControlLeft();
        break;
      case KEY_RIGHT:
        this._onControlRight();
        break;
    }
  };



  /**
   * Функция обработки кликов по контролам галереи
   * @param {Event} event
   */
  Gallery.prototype._onControlsClick = function(event) {
    if (event.target.classList.contains('overlay-gallery-control-left')) {
      this._onControlLeft();
    } else if (event.target.classList.contains('overlay-gallery-control-right')) {
      this._onControlRight();
    } else if (event.target.classList.contains('overlay-gallery-preview')) {
      this._onPreviewClick();
    }
  };



  /**
   * Сохранение в свойстве массива фотографий
   * @Param {Array.<Object>} photos
   */
  Gallery.prototype.setPictures = function(photos) {
    this.photos = photos;
    this.totalCount = this.photos.length;
  };



  /**
   * @param {number} index  индекс из массива фотографий
   */
  Gallery.prototype.setCurrentPicture = function(index) {
    this.currentIndex = index;
    var newImage = new Image();
    newImage.src = this.photos[this.currentIndex].src;

    var oldImage = this._preview.querySelector('img');
    if (oldImage) {
      this._preview.removeChild(oldImage);
    }
    this._preview.appendChild(newImage);
    this._numberCurrentElem.innerText = this.currentIndex + 1;
  };



  /**
   * Клик влево
   */
  Gallery.prototype._onControlLeft = function() {
    if (this.currentIndex > 0) {
      this.setCurrentPicture(this.currentIndex - 1);
    }
  };



  /**
   * Клик вправо
   */
  Gallery.prototype._onControlRight = function() {
    if (this.currentIndex < this.totalCount - 1) {
      this.setCurrentPicture(this.currentIndex + 1);
    }
  };



  /**
   * Клик по превьюхе
   */
  Gallery.prototype._onPreviewClick = function() {
    console.log('... Gallery._onPreviewClick');
  };



  return Gallery;
});

/* Замечания:
  1. классы ДОМ-элементов заданы жестко - это нехорошо. Решения:
    - передавать в объект темплейт и методами объекта модифицировать темплейт (дописать классы элементам)
          тут вопрос - но как тогда мы поймем какой именно элемент в темплейте является стрелкой вправо/влево,
          какой - крестик, какой - контейнер для картинки?
          непонятно...
    - передавать сматченные элементы в объект отдельными ф-циями
    - передавать сматченные  элементы в литерале объекта (*** сделаем так)
  2. проверять если какие-то элементы не переданы в объект, то их не обрабатывать
          (например, в верстке могут отсутствовать стрелки вправо/влево)
*/
