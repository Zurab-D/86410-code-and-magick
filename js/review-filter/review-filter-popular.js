/** Модуль фильтров для комментраиев (reviews)
 * @module
 */

'use strict';

define(['inherit', 'review-filter/review-filter-base'], function(inherit, ReviewFilter) {
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

  return ReviewFilterPopular;
});
