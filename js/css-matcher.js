/** ������ ������� ������ ��� �������� ������ � ��������, �����������, ������ ��������� �� ���������
 *  � ����� ������� ������, �������� ����������� � ������ ������ � ���� ������� ��� �� ����� ������
 *  � �������� � ����, ��� �� � ��������� ���� ���������� ��� ������, ��� ID ���� �����
 *  ����� ������� � ����� ������� �������� ��������, ��� ������, ��� id � ��� ���������� �������
 * @module CssMatcher
 */

/* global define */

'use strict';

define([], function() {

  /** ���������� �������
   *  ���� ������� ������ ��� ������ ��� ������ id, �� ������ ��� �������� ���� _selector (������� � ������ "." ��� "#")
   * @param {string} className        ��� css-������
   * @param {Element} baseDOMElement  ������ �� DOM-�������, �� �������� ����� ������ ��� �������, �� ��������� = document
   * @param {string} idName           ��� id ��������
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


  /** ���� � ����������� � ���� className ��� idName ���������� ������ � ������� ������ ��� ��������,
   * �� ���� ������� ������ ����������
   * @param {string} selector  �������� - ��� css-������ ��� ��� id
   */
  CssMatcher.prototype._cutSelectorSymbol = function(selector) {
    if (selector && (selector[0] === '.' || selector[0] === '#')) {
      selector = selector.slice(1);
    }
    return selector;
  };


  /** ��������� ���� className
   *  ���� idName �� ������, �� ������������� �������� _selector
   * @param {string} className  ��� css-������
   */
  CssMatcher.prototype.setClassName = function(className) {
    this._className = (typeof className === 'string') ? className : this._className;
    this._className = this._cutSelectorSymbol(this._className);
    if (!!this._className && !this._idName) {
      this.setSelector('.' + this._className);
    }
  };


  /** ��������� ���� idName
   *  ���� className �� ������, �� ������������� �������� _selector
   * @param {string} className  ��� css-������
   */
  CssMatcher.prototype.setIdName = function(idName) {
    this._idName = (typeof idName === 'string') ? idName : this._idName;
    this._idName = this._cutSelectorSymbol(this._idName);
    if (!!this._idName && !this._className) {
      this.setSelector('#' + this._idName);
    }
  };


  /** ������ ��� ���������, �� �������� ����� ������������� ����� DOM-��������
   * @param {string} selector
   */
  CssMatcher.prototype.setSelector = function(selector) {
    this._selector = (typeof selector === 'string') ? selector : this._selector;
    this.getDOMElement();
  };


  /** ������ ������� DOM-�������, ���������� ����� ������������� �����.
   * �������� �� ��������� = document
   * ������: baseDOMElement.querySelector('bla-bla')
   * @param {Element} baseDOMElement  ������ �� DOM-�������
   */
  CssMatcher.prototype.setBaseDOMElement = function(baseDOMElement) {
    this._baseDOMElement = baseDOMElement ? baseDOMElement : this._baseDOMElement;
    this._baseDOMElement = this._baseDOMElement ? this._baseDOMElement : document;
  };


  /** ����� ������� �� ������������/���������� ��������� */
  CssMatcher.prototype.getDOMElement = function() {
    this.element = this._baseDOMElement.querySelector(this._selector);
  };


  /** �������� ��� DOM-������ */
  CssMatcher.prototype.className = function() {
    return this._className;
  };


  /** �������� ��� id �������� */
  CssMatcher.prototype.idName = function() {
    return this._idName;
  };


  /** �������� ��� ��������� */
  CssMatcher.prototype.selector = function() {
    return this._selector;
  };


  return CssMatcher;
});
