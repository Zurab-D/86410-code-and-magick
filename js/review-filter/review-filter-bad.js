/** Модуль фильтров для комментраиев (reviews)
 * @module
 */

'use strict';

define(['inherit', 'review-filter/review-filter-base'], function(inherit, ReviewFilter) {
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

  return ReviewFilterBad;
});
