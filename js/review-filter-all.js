/** Модуль фильтров для комментраиев (reviews)
 * @module
 */

'use strict';

define(['inherit', 'review-filter-base'], function(inherit, ReviewFilter) {
  /** Фильтр "Все". Порожден от базового класса ReviewFilter
   * @constructor
   */
  function ReviewFilterAll() {}
  inherit(ReviewFilterAll, ReviewFilter);

  return ReviewFilterAll;
});

/* ВОПРОСЫ:

  1. Как это все оформить под AMD? Каждый класс в отдельный файл, т.е. 6 файлов? А потом все модули подключить

  2. Как передать window в AMD-модуль?
*/
