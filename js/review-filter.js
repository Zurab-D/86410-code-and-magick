/** Модуль фильтров для комментраиев (reviews)
 * @module
 */

'use strict';

(function(window) {
  /** Это в окончательном варианте убрать, а вместо использовать модуль inherit.js */
  function inherit(Child, Parent) {
    var TempConstructor = function() {};
    TempConstructor.prototype = Parent.prototype;
    Child.prototype = new TempConstructor();
  }

  /** Конструктор предка фильтров каментов
   * @constructor
   */
  function ReviewFilter() {}

  /** Фильтрование комментариев
   * @param {Array.<Object>} reviews
   * @return {Array.<Object>}
   */
  ReviewFilter.prototype.filter = function(reviews) {
    //console.log('Это метод родительского родительский класса. Для фильтрования используйте классу-наследники');
    return reviews.slice(0);
  };




  /** Фильтр "Все". Порожден от базового класса ReviewFilter
   * @constructor
   */
  function ReviewFilterAll() {}
  inherit(ReviewFilterAll, ReviewFilter);




  /** Фильтр "Недавние". Порожден от базового класса ReviewFilter
   *  "Недавние" - дата <= 14 дней
   * @constructor
   */
  function ReviewFilterRecent() {}
  inherit(ReviewFilterRecent, ReviewFilter);

  /** Метод фильтрования комментариев фильтра "Недавние":
   * @param {Array.<Object>} reviews
   * @return {Array.<Object>}
   */
  ReviewFilterRecent.prototype.filter = function(reviews) {
    /* 14 дней в милисекундах */
    var DAYS_14 = 1000 * 60 * 60 * 24 * 14;

    return reviews.filter(function(review) {
      return new Date(review.date) > new Date(Date.now() - DAYS_14);
    }).sort(function(a, b) {
      return b.date - a.date;
    });
  };




  /** Фильтр "Хорошие". Порожден от базового класса ReviewFilter
   *  "Хорошие" — с рейтингом не ниже 3, отсортированные по убыванию рейтинга
   * @constructor
   */
  function ReviewFilterGood() {}
  inherit(ReviewFilterGood, ReviewFilter);

  /** Метод фильтрования комментариев фильтра "Хорошие"
   * @param {Array.<Object>} reviews
   * @return {Array.<Object>}
   */
  ReviewFilterGood.prototype.filter = function(reviews) {
    return reviews.filter(function(review) {
      return review.rating >= 3;
    }).sort(function(a, b) {
      return b.rating - a.rating;
    });
  };




  /** Фильтр "Плохие". Порожден от базового класса ReviewFilter
   *  "Плохие" — с рейтингом не выше 2, отсортированные по возрастанию рейтинга.
   * @constructor
   */
  function ReviewFilterBad() {}
  inherit(ReviewFilterBad, ReviewFilter);

  /** Метод фильтрования комментариев фильтра "Плохие"
   * @param {Array.<Object>} reviews
   * @return {Array.<Object>}
   */
  ReviewFilterBad.prototype.filter = function(reviews) {
    return reviews.filter(function(review) {
      return review.rating <= 2;
    }).sort(function(a, b) {
      return a.rating - b.rating;
    });
  };




  /** Фильтр "Популярные". Порожден от базового класса ReviewFilter
   *  "Популярные" — отсортированные по убыванию оценки отзыва (поле review_usefulness)
   * @constructor
   */
  function ReviewFilterPopular() {}
  inherit(ReviewFilterPopular, ReviewFilter);

  /** Метод фильтрования комментариев фильтра "Популярные"
   * @param {Array.<Object>} reviews
   * @return {Array.<Object>}
   */
  ReviewFilterPopular.prototype.filter = function(reviews) {
    return reviews.slice(0).sort(function(a, b) {
      return b['review_usefulness'] - a['review_usefulness'];
    });
  };



  window.ReviewFilterAll = ReviewFilterAll;
  window.ReviewFilterRecant = ReviewFilterRecent;
  window.ReviewFilterGood = ReviewFilterGood;
  window.ReviewFilterBad = ReviewFilterBad;
  window.ReviewFilterPopular = ReviewFilterPopular;
})(window);

/* ВОПРОСЫ:

  1. Как это все оформить под AMD? Каждый класс в отдельный файл, т.е. 6 файлов? А потом все модули подключить

  2. Как передать window в AMD-модуль?
*/
