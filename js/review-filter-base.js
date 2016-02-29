'use strict';

define([], function() {
  /** Конструктор предка фильтров каментов
   * @constructor
   */
  function ReviewFilter() {}

  /** Фильтрование комментариев
   * @param {Array.<Object>} reviews
   * @return {Array.<Object>}
   */
  ReviewFilter.prototype.filter = function(reviews) {
    return reviews.slice(0);
  };

  return ReviewFilter;
});
