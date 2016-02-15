'use strict';

(function() {
  // 10 сек. таймаут загрузки картинки
  var TIMEOUT_IMAGE = 10000;
  var IMAGE_SIZE = 124;
  var _ratingClasses = [
    'one',
    'two',
    'three',
    'four',
    'five'
  ];
  // данные полученные по аяксу по текущему отзыву
  var _data;



  /**
   * Получаем контент шаблона
   * @param {Element} template  шаблон
   * @return {Element}
   */
  function getTemplateContent(template) {
    if ('content' in template) {
      return template.content.children[0];
    } else {
      return template.children[0];
    }
  }



  /**
   * Конструктор объекта пользовательского отзыва
   * @param {Object} data  данные пользовательского отзыва
   * @construstor
   */
  function Review(data) {
    _data = data;
    this.pictureLoad = this.pictureLoad.bind(this);
    this.pictureLoadError = this.pictureLoadError.bind(this);
  }



  /**
   * Обработка успешной загрузки картинки
   */
  Review.prototype.pictureLoad = function() {
    this.element.replaceChild(this._img, this.element.querySelector('.review-author'));
    clearTimeout(this._timeout);
  };



  /**
   * Обработка ошибки загрузки картинки
   */
  Review.prototype.pictureLoadError = function() {
    this.element.classList.add('review-load-failure');
    clearTimeout(this._timeout);
  };



  /**
   * Отрисовка отзыва на странице
   */
  Review.prototype.render = function() {
    var reviewTemplate = document.querySelector('#review-template');
    this._timeout = null;
    this._img = {};

    this.element = getTemplateContent(reviewTemplate).cloneNode(true);
    this.element.querySelector('.review-text').textContent = _data.description;
    this.element.querySelector('.review-rating').classList.add('review-rating-' + _ratingClasses[_data.rating - 1]);

    // создаем объект-картинку
    this._img = new Image(IMAGE_SIZE, IMAGE_SIZE);

    // при загрузке созданной картинки вставим ее в элемент
    this._img.onload = this.pictureLoad;

    // при ошибке загрузке картинки, назначаем элементу соотв. класс
    this._img.onerror = this.pictureLoadError;

    // взводим таймаут, по которому назначим картинке ошибку загрузки
    this._timeout = setTimeout(this.pictureLoadError, TIMEOUT_IMAGE);

    // начинаем загрузку картинки
    this._img.src = _data.author.picture;
    this._img.title = _data.author.name;
    this._img.alt = _data.author.name;
    this._img.classList.add('review-author');
  };



  window.Review = Review;
})();
