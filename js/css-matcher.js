/* global define */

'use strict';

define([], function() {
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


  CssMatcher.prototype.cutSelectorSymbol = function(selector) {
    if (selector && (selector[0] === '.' || selector[0] === '#')) {
      selector = selector.slice(1);
    }
    return selector;
  }


  CssMatcher.prototype.setClassName = function(className) {
    this._className = (typeof className === 'string') ? className : this._className;
    this._className = this.cutSelectorSymbol(this._className);
    if (!!this._className && !this._idName) {
      this.setSelector('.' + this._className);
    }
  };


  CssMatcher.prototype.setIdName = function(idName) {
    this._idName = (typeof idName === 'string') ? idName : this._idName;
    this._idName = this.cutSelectorSymbol(this._idName);
    if (!!this._idName && !this._className) {
      this.setSelector('#' + this._idName);
    }
  };


  CssMatcher.prototype.setSelector = function(selector) {
    this._selector = (typeof selector === 'string') ? selector : this._selector;
    this.getDOMElement();
  };


  CssMatcher.prototype.setBaseDOMElement = function(baseDOMElement) {
    this._baseDOMElement = baseDOMElement ? baseDOMElement : this._baseDOMElement;
    this._baseDOMElement = this._baseDOMElement ? this._baseDOMElement : document;
  };


  CssMatcher.prototype.getDOMElement = function() {
    this.element = this._baseDOMElement.querySelector(this._selector)
  };


  CssMatcher.prototype.className = function() {
    return this._className;
  };


  CssMatcher.prototype.idName = function() {
    return this._idName;
  };


  CssMatcher.prototype.selector = function() {
    return this._selector;
  };


  return CssMatcher;
});
