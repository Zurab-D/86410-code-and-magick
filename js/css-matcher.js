/** Модуль создает объект для удобства работы с классами, селекторами, поиску элементов по селектору
 *  В самом простом случае, вызываем конструктор с именем класса и этот элемент тут же будет найден
 *  и сохранен в поле, так же в отдельном поле сохранится имя класса, имя ID если нужно
 *  Таким образом в одном объекте хранятся селектор, имя класса, имя id и сам сматченный элемент
 * @module CssMatcher
 */

/* global define */

'use strict';

define([], function() {

  /** Коструктор Матчера
   *  Если указать только имя класса или только id, то объект сам заполнит поле _selector (добавив в начале "." или "#")
   * @param {string} className        имя css-класса
   * @param {Element} baseDOMElement  ссылка на DOM-элемент, от которого будем искать наш элемент, по умолчанию = document
   * @param {string} idName           имя id элемента
   * @constructor
   */
  function CssMatcher(className, baseDOMElement, idName) {
    this._className = '';
    this._idName = '';
    this._selector = '';
    this._baseDOMElement = null;
    this.element = null;

    this.setBaseDOMElement(baseDOMElement);
    this.setClassName(className);
    this.setIdName(idName);
  }


  /** Если в конструктор в поле className или idName передается строка с ведущей точкой или решеткой,
   * то этот ведущий символ отрезается
   * @param {string} selector  селектор - имя css-класса или имя id
   */
  CssMatcher.prototype._cutSelectorSymbol = function(selector) {
    if (selector && (selector[0] === '.' || selector[0] === '#')) {
      selector = selector.slice(1);
    }
    return selector;
  };


  /** Заполнить поле className
   *  Если idName не задано, то автоматически вычислит _selector
   * @param {string} className  имя css-класса
   */
  CssMatcher.prototype.setClassName = function(className) {
    this._className = (typeof className === 'string') ? className : this._className;
    this._className = this._cutSelectorSymbol(this._className);
    if (!!this._className && !this._idName) {
      this.setSelector('.' + this._className);
    }
  };


  /** Заполнить поле idName
   *  Если className не задано, то автоматически вычислит _selector
   * @param {string} className  имя css-класса
   */
  CssMatcher.prototype.setIdName = function(idName) {
    this._idName = (typeof idName === 'string') ? idName : this._idName;
    this._idName = this._cutSelectorSymbol(this._idName);
    if (!!this._idName && !this._className) {
      this.setSelector('#' + this._idName);
    }
  };


  /** Задать имя селектора, по которому будет производиться поиск DOM-элемента
   * @param {string} selector
   */
  CssMatcher.prototype.setSelector = function(selector) {
    this._selector = (typeof selector === 'string') ? selector : this._selector;
    this.getDOMElement();
  };


  /** Задать базовый DOM-элемент, откоторого будет производиться поиск.
   * Значение по умолчанию = document
   * Пример: baseDOMElement.querySelector('bla-bla')
   * @param {Element} baseDOMElement  ссылка на DOM-элемент
   */
  CssMatcher.prototype.setBaseDOMElement = function(baseDOMElement) {
    this._baseDOMElement = baseDOMElement ? baseDOMElement : this._baseDOMElement;
    this._baseDOMElement = this._baseDOMElement ? this._baseDOMElement : document;
  };


  /** Найти элемент по вычисленному/указанному селектору */
  CssMatcher.prototype.getDOMElement = function() {
    this.element = this._baseDOMElement.querySelector(this._selector);
  };


  /** Получить имя DOM-класса */
  CssMatcher.prototype.className = function() {
    return this._className;
  };


  /** Получить имя id элемента */
  CssMatcher.prototype.idName = function() {
    return this._idName;
  };


  /** Получить имя селектора */
  CssMatcher.prototype.selector = function() {
    return this._selector;
  };


  return CssMatcher;
});
