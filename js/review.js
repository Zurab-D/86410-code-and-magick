/* global define */

'use strict';


define([], function() {
  /**
   * Таймаут загрузки картинки - 10 сек.
   * @const
   * @type {number}
   */
  var TIMEOUT_IMAGE = 10000;

  /**
   * Размер картинки
   * @const
   * @type {number}
   */
  var IMAGE_SIZE = 124;

  /**
   * Суффиксы css-классов рейтингов
   * @enum {number}
   */
  var _ratingClasses = [
    'one',
    'two',
    'three',
    'four',
    'five'
  ];



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
    this._data = data;
    this.pictureLoad = this.pictureLoad.bind(this);
    this.pictureLoadError = this.pictureLoadError.bind(this);
    this._onClick = this._onClick.bind(this);
    this.showReviewVoted = this.showReviewVoted.bind(this);
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
    this.element.querySelector('.review-text').textContent = this._data.getDescription();
    this.element.querySelector('.review-rating').classList.add('review-rating-' + _ratingClasses[this._data.getRating() - 1]);

    // создаем объект-картинку
    this._img = new Image(IMAGE_SIZE, IMAGE_SIZE);

    // при загрузке созданной картинки вставим ее в элемент
    this._img.onload = this.pictureLoad;

    // при ошибке загрузке картинки, назначаем элементу соотв. класс
    this._img.onerror = this.pictureLoadError;

    // взводим таймаут, по которому назначим картинке ошибку загрузки
    this._timeout = setTimeout(this.pictureLoadError, TIMEOUT_IMAGE);

    // начинаем загрузку картинки
    this._img.src = this._data.getAuthorPicture();
    this._img.title = this._data.getAuthorName();
    this._img.alt = this._data.getAuthorName();
    this._img.classList.add('review-author');

    this.element.addEventListener('click', this._onClick);
  };



  /**
   * Обработка кликов за/против комментарий
   * @param {Event} evt
   * @private
   */
  Review.prototype._onClick = function(evt) {
    if (typeof this.onVote === 'function') {
      // накрутить голоса не так уж и легко
      if (!evt.target.classList.contains('review-quiz-answer-active')) {
        if (evt.target.classList.contains('review-quiz-answer-yes')) {
          this.onVote(true, this.showReviewVoted);
        }
        if (evt.target.classList.contains('review-quiz-answer-no')) {
          this.onVote(false, this.showReviewVoted);
        }
      }
    }
  };




  /** Callback при голосовании за отзывы
   * @param {boolean}
   */
  Review.prototype.showReviewVoted = function(isVoteYes) {
    if (typeof isVoteYes !== 'boolean') {
      return;
    }

    if (isVoteYes) {
      this.element.querySelector('.review-quiz-answer-yes').classList.add('review-quiz-answer-active');
      this.element.querySelector('.review-quiz-answer-no').classList.remove('review-quiz-answer-active');
    } else {
      this.element.querySelector('.review-quiz-answer-no').classList.add('review-quiz-answer-active');
      this.element.querySelector('.review-quiz-answer-yes').classList.remove('review-quiz-answer-active');
    }
  };


  /** @type {?Function} */
  Review.prototype.onVote = null;



  return Review;
});
