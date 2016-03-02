/** Модуль зоздает объект окна для вывода в него сообщений, текста..
 * Если назначить его вместо console.log(), то будет удобно - не нужно держать консоль открытым
 * Пример:
 *   if (Msg) {
 *     var win = getWindow();
 *     win.msg = new Msg();
 *     console.log2 = console.log;
 *     console.log = function(par) {
 *       win.msg.show(par);
 *     };
 *   }
 * @module Msg
 */

/* global define */

'use strict';

define([], function() {

  /** Конструктор объекта
   * @param {} width  По умолчанию - '40%'
   * @param {} height По умолчанию - '200px'
   * @constructor
   */
  function Msg(width, height) {
    this.hide = this.hide.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.moveAt = this.moveAt.bind(this);

    this.create();

    this._setElemStyle();
    this._setCaptionStyle();
    this._setCloseBtnStyle();
    this._setTextContainerStyle();

    this.setWidth(width || '40%');
    this.setHeight(height || '200px');
    this.setTop('2px');
    this.setLeft(null);
    this.setRight(null);
    this.setOpacity('0.7');
    this.setFont('bold 15px Arial');
    this.setColor('black');
    this.setBgColor('lightgreen');
    this.setPadding('2px 2px 2px 2px');

    this.setTextBgColor('lightyellow');
    this.setBorder('1px solid green');
    this.setCaptionFont('italic 15px Arial');
    this.elem.id = 'msg-main-block';
  }


  /** для наглядности */
  var p = Msg.prototype;
  var timeoutThrotlleDrag;
  var TIMEOUT_DRAG = 10;


  /** проверка - строка ли. взято из underscore */
  function isString(obj) {
    var op = Object.prototype.toString.call(obj);
    return op === '[object String]';
  }

  function isNumber(obj) {
    var op = Object.prototype.toString.call(obj);
    return op === '[object Number]';
  }

  function parseIntZ(par) {
    var res = parseInt(par, 10);
    return isNumber(res) && !isNaN(res) ? res : 0;
  }



  /** Функции-сеттеры для изиенения параметров окна. Тут, я думаю, все понятно из названий. */
  p.setTop = function(param) {
    if (isString(param)) {
      this.elem.style.top = param;
      this.setHorizontalPosition();
    }
  };
  p.setHorizontalPosition = function() {
    if (this.left) {
      this.elem.style.left = this.left;
    } else if (this.right) {
      this.elem.style.right = this.right;
    } else {
      this.elem.style.left = this.elem.style.top;
    }
  };
  p.setLeft = function(param) {
    if (isString(param)) {
      this.left = param;
      this.setHorizontalPosition();
    }
  };
  p.setRight = function(param) {
    if (isString(param)) {
      this.right = param;
      this.setHorizontalPosition();
    }
  };
  p.setHeight = function(param) {
    if (isString(param)) {
      this.height = param;
      this._setTextContainerStyle();
    }
  };
  p.setWidth = function(param) {
    if (isString(param)) {
      this.elem.style.width = param;
    }
  };
  p.setOpacity = function(param) {
    if (isString(param)) {
      this.elem.style.opacity = param;
    }
  };
  p.setFont = function(param) {
    if (isString(param)) {
      this.textElem.style.font = param;
    }
  };
  p.setCaptionFont = function(param) {
    if (isString(param)) {
      this.caption.style.font = param;
    }
  };
  p.setBorder = function(param) {
    if (isString(param)) {
      this.elem.style.border = param;
      this.textElem.style.border = param;
      this._setTextContainerStyle();
    }
  };
  p.setColor = function(param) {
    if (isString(param)) {
      this.elem.style.color = param;
    }
  };
  p.setBgColor = function(param) {
    if (isString(param)) {
      this.elem.style.backgroundColor = param;
    }
  };
  p.setTextBgColor = function(param) {
    if (isString(param)) {
      this.textElem.style.backgroundColor = param;
    }
  };
  p.setPadding = function(param) {
    if (isString(param)) {
      this.elem.style.padding = param;
      this._setTextContainerStyle();
    }
  };



  /** Применить изменяемые параметры */
  p.applyParams = function() {
    this._setElemStyle();
    this._setCaptionStyle();
    this._setCloseBtnStyle();
    //this._setTextContainerStyle();
  };


  /** Вывод текста сообщения в окно
   * @param {string} text  текст сообщения
   */
  p.textOutput = function(text) {
    this.textElem.innerHTML = this.textElem.innerHTML +
      (this.textElem.innerHTML ? '<br>' : '') +
      this.getTimeStr() + ' > ' +
      text;
    this.textContainer.scrollTop = 9999;
  };


  /** Установка стилей окна */
  p._setElemStyle = function() {
    this.elem.style.position = 'fixed';
    this.elem.style.display = 'none';
    this.elem.style.cursor = 'default';
    this.elem.style.zIndex = 1000;
  };


  /** Установка стилей для кнопки закрытия */
  p._setCloseBtnStyle = function() {
    this.closeBtn.style.position = 'absolute';
    this.closeBtn.style.top = '3px';
    this.closeBtn.style.right = '3px';
    this.closeBtn.style.width = '4px';
    this.closeBtn.style.height = '5px';
    this.closeBtn.style.border = '5px solid DarkRed';
    this.closeBtn.style.borderRadius = '50%';
    this.closeBtn.style.backgroundColor = 'red';
    this.closeBtn.style.cursor = 'pointer';
    this.closeBtn.setAttribute('title', 'Close');
    this.closeBtn.id = 'msg-btn-close';
  };


  /** Установка стилей для шапки окна */
  p._setCaptionStyle = function() {
    this.caption.textContent = 'Log';
    this.caption.style.padding = '0 0 4px 2px';
  };


  /** Установка стилей для шапки окна */
  p._setTextContainerStyle = function() {
    this.textContainer.style.overflowY = 'scroll';
    this.textContainer.style.maxHeight =
      parseInt(this.height, 10) -
      parseInt(this.elem.style.paddingTop || 0, 10) -
      parseInt(this.elem.style.paddingBottom || 0, 10) -
      parseInt(this.elem.style.borderWidth || 0, 10) * 2 +
      'px';
  };


  /** Создать окно */
  p.create = function() {
    /* создаем */
    this.elem = document.createElement('div');
    this.caption = document.createElement('div');
    this.textElem = document.createElement('div');
    this.closeBtn = document.createElement('div');
    this.textContainer = document.createElement('div');

    /* вставляем */
    document.body.appendChild(this.elem);
    this.elem.appendChild(this.caption);
    this.elem.appendChild(this.closeBtn);
    this.textContainer.appendChild(this.textElem);
    this.elem.appendChild(this.textContainer);
  };


  /** Получить текущее время в строчнов виде для вывода в окно */
  p.getTimeStr = function() {
    var d = new Date();
    return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' ' + d.getMilliseconds();
  };


  /** Спрятать окно */
  p.hide = function() {
    this.elem.removeEventListener('mousedown', this.onMouseDown);
    this.closeBtn.removeEventListener('click', this.hide);
    this.elem.style.display = 'none';
  };


  /** Показать окно */
  p.show = function(text) {
    if (this.elem) {
      if (this.elem.style.display === 'none') {
        this.elem.style.display = 'block';
      }
      if (text) {
        this.textOutput(text);
      }
    } else {
      this.create(text);
    }
    this.closeBtn.addEventListener('click', this.hide);
    /* перетаскивание */
    this.caption.addEventListener('mousedown', this.onMouseDown);
  };


  /** Перемещение окна при перетаскивании
   *  перетаскивание недоделано (нужно перехватывать скроллинг и не пропускать его выше)
   * @param {Event} evt
   */
  p.moveAt = function(evt) {
    if (!timeoutThrotlleDrag) {
      timeoutThrotlleDrag = setTimeout(function() {
        clearTimeout(timeoutThrotlleDrag);
        timeoutThrotlleDrag = null;
      }, TIMEOUT_DRAG);
      this.setTop(evt.clientY - this.cursorElemY - parseIntZ(this.elem.style.marginTop) -
        parseIntZ(this.elem.style.paddingTop) - parseIntZ(this.elem.style.borderTop) + 'px');
      this.setLeft(evt.clientX - this.cursorElemX - parseIntZ(this.elem.style.marginLeft) -
        parseIntZ(this.elem.style.paddingLeft) - parseIntZ(this.elem.style.borderLeft) + 'px');
    }
  };


  /** Захват окна при клике по шапке, для перетаскивания
   * @param {Event} evt
   */
  p.onMouseDown = function(evt) {
    if (evt.target !== this.closeBtn && evt.target !== this.textContainer && evt.target !== this.textElem ) {
      document.body.setAttribute('onselectstart', 'return false;');
      this.cursorElemX = (typeof evt.offsetX === 'undefined') ? evt.layerX : evt.offsetX;
      this.cursorElemY = (typeof evt.offsetY === 'undefined') ? evt.layerY : evt.offsetY;
      this.elem.style.cursor = 'pointer';
      this.moveAt(evt);
      document.onmousemove = this.moveAt;
      this.elem.onmouseup = this.onMouseUp;
    }
  };


  /** Отпускаем окно после перетаскивания */
  p.onMouseUp = function() {
    this.elem.style.cursor = 'default';
    document.onmousemove = null;
    this.elem.onmouseup = null;
    document.body.removeAttribute('onselectstart');
  };


  return Msg;
});
