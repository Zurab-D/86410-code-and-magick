/** Модуль галереи
 * Показываем картинки, листаем вправо, влево
 * @module CssMatcher
 */

/* global define */

'use strict';

define([
  'css-matcher'
], function(CssMatcher) {
  /** клавиша Escape */
  var KEY_ESCAPE = 27;

  /** клавиша "Влево" */
  var KEY_LEFT = 37;

  /** клавиша "Вправо" */
  var KEY_RIGHT = 39;



  /** Конструктор галереи
   * @param {Array.<Object>} photos  Массив объектов фотографий
   * @constructor
   */
  function Gallery(photos) {
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onControlsClick = this._onControlsClick.bind(this);
    this._onHashChange = this._onHashChange.bind(this);

    this.domNames = {
      gallery: '',
      galleryPreview: '',
      previewNumberCurrent: '',
      previewNumberTotal: '',
      galleryClose: '',
      galleryControls: '',
      galleryControlLeft: '',
      galleryControlRight: ''
    };

    this.initGallery(photos);
  }



  /** Инициализация объекта имен селекторов - задать селекторы нужных элементов html-разметки
   * @type {Object=} parDomNames
   */
  Gallery.prototype.setDomNames = function(parDomNames) {
    parDomNames = parDomNames || {
      gallery: 'overlay-gallery',
      galleryPreview: 'overlay-gallery-preview',
      previewNumberCurrent: 'preview-number-current',
      previewNumberTotal: 'preview-number-total',
      galleryClose: 'overlay-gallery-close',
      galleryControls: 'overlay-gallery-controls',
      galleryControlLeft: 'overlay-gallery-control-left',
      galleryControlRight: 'overlay-gallery-control-right'
    };

    for (var property in this.domNames) {
      if (parDomNames[property]) {
        this.domNames[property] = parDomNames[property];
      }
    }

    this.initSelectors();
  };



  /** Инициализация селекторов */
  Gallery.prototype.initSelectors = function() {
    this.domGallery = new CssMatcher(this.domNames.gallery);
    this.domPreview = new CssMatcher(this.domNames.galleryPreview, this.domGallery.element);
    this.domNumCur = new CssMatcher(this.domNames.previewNumberCurrent, this.domPreview.element);
    this.domNumTotal = new CssMatcher(this.domNames.previewNumberTotal, this.domPreview.element);
    this.domClose = new CssMatcher(this.domNames.galleryClose, this.domGallery.element);
    this.domControls = new CssMatcher(this.domNames.galleryControls, this.domGallery.element);
    this.domLeft = new CssMatcher(this.domNames.galleryControlLeft, this.domGallery.element);
    this.domRight = new CssMatcher(this.domNames.galleryControlRight, this.domGallery.element);
  };



  /** Инициализация
   * @Param {Array.<Object>} photos
   */
  Gallery.prototype.initGallery = function(photos) {
    this.setDomNames();

    this.setPictures(photos);
    window.addEventListener('hashchange', this._onHashChange);
  };



  /** Функция показа галереи */
  Gallery.prototype.show = function() {
    this.domGallery.element.classList.remove('invisible');
    this.domClose.element.addEventListener('click', this._onCloseClick);
    this.domControls.element.addEventListener('click', this._onControlsClick);
    window.addEventListener('keydown', this._onDocumentKeyDown);
    this.domNumTotal.element.innerHTML = this.totalCount;
  };



  /** Функция сокрытия галереи */
  Gallery.prototype.hide = function() {
    this.domGallery.element.classList.add('invisible');
    this.domClose.element.removeEventListener('click', this._onCloseClick);
    this.domControls.element.removeEventListener('click', this._onCloseClick);
    window.removeEventListener('keydown', this._onDocumentKeyDown);
  };



  /** Функция обработки клика по крестику */
  Gallery.prototype._onCloseClick = function() {
    try {
      window.history.replaceState({}, document.title, '/');
      this.hide();
    } catch(err) {
      console.log(err);
      location.hash = '';
    }
  };



  /** Функция обработки клавиатуры */
  Gallery.prototype._onDocumentKeyDown = function(event) {
    switch (event.keyCode) {
      case KEY_ESCAPE:
        this._onCloseClick();
        break;
      case KEY_LEFT:
        this._onControlLeft();
        break;
      case KEY_RIGHT:
        this._onControlRight();
        break;
    }
  };



  /** Функция обработки кликов по контролам галереи
   * @param {Event} event
   */
  Gallery.prototype._onControlsClick = function(event) {
    if (event.target.classList.contains(this.domLeft.className())) {
      this._onControlLeft();
    } else if (event.target.classList.contains(this.domRight.className())) {
      this._onControlRight();
    } else if (event.target.classList.contains(this.domPreview.className())) {
      this._onPreviewClick();
    }
  };



  /** Сохранение в свойстве массива фотографий
   * @Param {Array.<Object>} photos
   */
  Gallery.prototype.setPictures = function(photos) {
    this.photos = photos;
    this.totalCount = this.photos.length;
  };



  /** Назначить текущую картинку
   * @param {number} index  индекс из массива фотографий
   */
  Gallery.prototype.setCurrentPicture = function(currentPic) {
    if (typeof currentPic === 'string' ) {
      currentPic = this.getPhotoIndex(currentPic);
    }
    if (typeof currentPic === 'number' && currentPic >= 0 && currentPic < this.photos.length) {
      this.currentIndex = currentPic;
      var newImage = new Image();
      newImage.src = this.photos[this.currentIndex].src;
      newImage.style.pointerEvents = 'none';

      var oldImage = this.domPreview.element.querySelector('img');
      if (oldImage) {
        this.domPreview.element.removeChild(oldImage);
      }
      this.domPreview.element.appendChild(newImage);
      this.domNumCur.element.innerHTML = this.currentIndex + 1;
    } else {
      this.currentIndex = null;
      this.hide();
    }
  };



  /** Клик влево */
  Gallery.prototype._onControlLeft = function() {
    if (this.currentIndex > 0) {
      location.hash = '#photo/' + this.photos[this.currentIndex - 1].src;
    }
  };



  /** Клик вправо */
  Gallery.prototype._onControlRight = function() {
    if (this.currentIndex < this.totalCount - 1) {
      location.hash = '#photo/' + this.photos[this.currentIndex + 1].src;
    }
  };



  /** Клик по превьюхе */
  Gallery.prototype._onPreviewClick = function() {
    console.log('... Gallery._onPreviewClick');
  };



  /** Вычисление индекса фотки из хэша адресной строки
   * @type {?string=} src
   * @return {?number}
   */
  Gallery.prototype.getPhotoIndex = function(src) {
    if (src) {
      var photo = this.photos.find(function(photosItem) {
        return photosItem.src.toLowerCase() === src.replace('#photo/', '').toLowerCase();
      });
      var i = this.photos.indexOf(photo);

      if (i > -1) {
        return i;
      }
    }
  };



  /** Ф-ция обработки хэша адресной строки */
  Gallery.prototype._onHashChange = function() {
    if (location.hash.match(/#photo\/(\S+)/)) {
      this.setCurrentPicture(location.hash);
      this.show();
    } else {
      this.hide();
    }
  };



  /** Обработка хэша адресной строки */
  Gallery.prototype.restoreFromHash = function() {
    this._onHashChange();
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
