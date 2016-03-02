'use strict';

define([], function() {

  /** Класс данных для объекта Review
   * @param {Object} dataObj
   * @constructor
   */
  function ReviewData(dataObj) {
    this._data = dataObj;
    this._userPrevVote = null;
  }



  /** Метод для получения фото автора
   * @return {}
   */
  ReviewData.prototype.getAuthorPicture = function() {
    return this._data.author.picture;
  };

  /** Метод для сохранения фото автора
   * @param {}
   */
  ReviewData.prototype.setAuthorPicture = function(param) {
    this._data.author.picture = param;
  };



  /** Метод для получения имени автора
   * @return {}
   */
  ReviewData.prototype.getAuthorName = function() {
    return this._data.author.name;
  };

  /** Метод для сохранения имени автора
   * @param {}
   */
  ReviewData.prototype.setAuthorName = function(param) {
    this._data.author.name = param;
  };



  /** Метод для получения даты отзыва
   * @return {}
   */
  ReviewData.prototype.getDate = function() {
    return this._data.date;
  };

  /** Метод для сохранения даты отзыва
   * @param {}
   */
  ReviewData.prototype.setDate = function(param) {
    this._data.date = param;
  };



  /** Метод для получения полезности отзыва
   * @return {number}
   */
  ReviewData.prototype.getReviewUsefulness = function() {
    return this._data.review_usefulness;
  };

  /** Метод для сохранения полезности отзыва
   * @param {boolean}
   */
  ReviewData.prototype.setReviewUsefulness = function(isUsefull, callback) {
    if (isUsefull) {
      if (this._userPrevVote === false) {
        this._data.review_usefulness += 2;
        this._userPrevVote = true;
      } else {
        this._data.review_usefulness += 1;
        this._userPrevVote = false;
      }
    } else {
      if (this._userPrevVote === true) {
        this._data.review_usefulness -= 2;
        this._userPrevVote = false;
      } else {
        this._data.review_usefulness -= 1;
        this._userPrevVote = true;
      }
    }
    if (typeof callback === 'function') {
      callback(isUsefull);
    }
  };



  /** Метод для получения рейтинга
   * @return {number}
   */
  ReviewData.prototype.getRating = function() {
    return this._data.rating;
  };

  /** Метод для сохранения рейтинга
   * @param {number}
   */
  ReviewData.prototype.setRating = function(param) {
    this._data.rating = param;
  };



  /** Метод для получения комментария
   * @return {string}
   */
  ReviewData.prototype.getDescription = function() {
    return this._data.description;
  };

  /** Метод для сохранения комментария
   * @param {string}
   */
  ReviewData.prototype.setDescription = function(param) {
    this._data.description = param;
  };



  return ReviewData;
});
