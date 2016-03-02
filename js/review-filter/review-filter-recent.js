/** Модуль фильтров для комментраиев (reviews)
 * @module
 */

'use strict';

define(['inherit', 'review-filter/review-filter-base'], function(inherit, ReviewFilter) {
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

  return ReviewFilterRecent;
});
