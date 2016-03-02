/** Модуль фильтров для комментраиев (reviews)
 * @module
 */

'use strict';

define(['inherit', 'review-filter/review-filter-base'], function(inherit, ReviewFilter) {
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
      return review.getRating() >= 3;
    }).sort(function(a, b) {
      return b.getRating() - a.getRating();
    });
  };

  return ReviewFilterGood;
});
