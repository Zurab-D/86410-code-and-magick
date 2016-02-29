/** Модуль фильтров для комментраиев (reviews)
 * @module
 */

'use strict';

define(['inherit', 'review-filter-base'], function(inherit, ReviewFilter) {
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

  return ReviewFilterGood;
});
