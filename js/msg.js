'use strict';

(function(window) {

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

    //this.applyParams();

  }



  function isString(obj) {
    var op = Object.prototype.toString.call(obj);
    return op === '[object String]';
  }



  /** Функции-сеттеры для изиенения параметров */
  Msg.prototype.setTop = function(param) {
    if (isString(param)) {
      this.elem.style.top = param;
      this.setHorizontalPosition();
    }
  }
  Msg.prototype.setHorizontalPosition = function(param) {
    if (this.left) {
      this.elem.style.left = this.left;
    } else if (this.right) {
      this.elem.style.right = this.right;
    } else {
      this.elem.style.left = this.elem.style.top;
    }
  }
  Msg.prototype.setLeft = function(param) {
    if (isString(param)) {
      this.left = param;
      this.setHorizontalPosition();
    }
  }
  Msg.prototype.setRight = function(param) {
    if (isString(param)) {
      this.right = param;
      this.setHorizontalPosition();
    }
  }
  Msg.prototype.setHeight = function(param) {
    if (isString(param)) {
      this.height = param;
      this._setTextContainerStyle();
    }
  }
  Msg.prototype.setWidth = function(param) {
    if (isString(param)) {
      this.elem.style.width = param;
    }
  }
  Msg.prototype.setOpacity = function(param) {
    if (isString(param)) {
      this.elem.style.opacity = param;
    }
  }
  Msg.prototype.setFont = function(param) {
    if (isString(param)) {
      this.textElem.style.font = param;
    }
  }
  Msg.prototype.setCaptionFont = function(param) {
    if (isString(param)) {
      this.caption.style.font = param;
    }
  }
  Msg.prototype.setBorder = function(param) {
    if (isString(param)) {
      this.elem.style.border = param;
      this.textElem.style.border = param;
      this._setTextContainerStyle();
    }
  }
  Msg.prototype.setColor = function(param) {
    if (isString(param)) {
      this.elem.style.color = param;
    }
  }
  Msg.prototype.setBgColor = function(param) {
    if (isString(param)) {
      this.elem.style.backgroundColor = param;
    }
  }
  Msg.prototype.setTextBgColor = function(param) {
    if (isString(param)) {
      this.textElem.style.backgroundColor = param;
    }
  }
  Msg.prototype.setPadding = function(param) {
    if (isString(param)) {
      this.elem.style.padding = param;
      this._setTextContainerStyle();
    }
  }



  /** Применить изменяемые параметры */
  Msg.prototype.applyParams = function() {
    this._setElemStyle();
    this._setCaptionStyle();
    this._setCloseBtnStyle();
    //this._setTextContainerStyle();
  };


  /** Вывод текста в окно */
  Msg.prototype.textOutput = function(text) {
    this.textElem.innerHTML = this.textElem.innerHTML +
      (this.textElem.innerHTML ? '<br>' : '') +
      this.getTimeStr() + ' > ' +
      text;
    this.textContainer.scrollTop = 9999999999999;
  };


  /** Установка стилей окна */
  Msg.prototype._setElemStyle = function () {
    this.elem.style.position = 'fixed';
    this.elem.style.display = 'none';
    this.elem.style.cursor = 'default';
    this.elem.style.zIndex = 1000;
  };

  /** Установка стилей для кнопки закрытия */
  Msg.prototype._setCloseBtnStyle = function () {
    this.closeBtn.style.position = 'absolute';
    this.closeBtn.style.top = '3px';
    this.closeBtn.style.right = '5px';
    this.closeBtn.style.width = '6px';
    this.closeBtn.style.height = '6px';
    this.closeBtn.style.border = '4px solid DarkRed';
    this.closeBtn.style.borderRadius = '50%';
    this.closeBtn.style.backgroundColor = 'red';
    this.closeBtn.style.cursor = 'pointer';
    this.closeBtn.setAttribute('title', 'Close');
  };

  /** Установка стилей для шапки окна */
  Msg.prototype._setCaptionStyle = function () {
    this.caption.textContent = 'Log';
    this.caption.style.padding = '0 0 3px 5px';
  };

  /** Установка стилей для шапки окна */
  Msg.prototype._setTextContainerStyle = function () {
    this.textContainer.style.overflowY = 'scroll';
    this.textContainer.style.maxHeight =
      parseInt(this.height, 10) -
      parseInt(this.elem.style.paddingTop || 0, 10) -
      parseInt(this.elem.style.paddingBottom || 0, 10) -
      parseInt(this.elem.style.borderWidth || 0, 10) * 2 +
      'px';
  };

  /** Создать окно */
  Msg.prototype.create = function(text) {
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



  Msg.prototype.getTimeStr = function() {
    var d = new Date();
    return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' ' + d.getMilliseconds();
  };



  Msg.prototype.hide = function() {
    this.elem.removeEventListener('mousedown', this.onMouseDown);
    this.closeBtn.removeEventListener('click', this.hide);
    this.elem.style.display = 'none';
  };



  Msg.prototype.show = function(text) {
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


  /* перетаскивание недоделано (нужно перехватывать скроллинг и не пропускать его выше) */
  Msg.prototype.moveAt = function(evt) {
    this.setTop(evt.clientY - this.cursorElemY + 'px');
    this.setLeft(evt.clientX - this.cursorElemX + 'px');
    //this.elem.style.left = this.left;
  };

  Msg.prototype.onMouseDown = function(evt) {
    if (evt.target !== this.closeBtn && evt.target !== this.textContainer && evt.target !== this.textElem ) {
      this.cursorElemX = (typeof evt.offsetX === 'undefined') ? evt.layerX : evt.offsetX;
      this.cursorElemY = (typeof evt.offsetY === 'undefined') ? evt.layerY : evt.offsetY;
      this.elem.style.cursor = 'pointer';
      this.moveAt(evt);
      document.onmousemove = this.moveAt;
      this.elem.onmouseup = this.onMouseUp;
    }
  };

  Msg.prototype.onMouseUp = function() {
    this.elem.style.cursor = 'default';
    document.onmousemove = null;
    this.elem.onmouseup = null;
  };



  /* Прокидываем тип в ГОВ */
  //window.Msg = Msg;

  /* Создаем объект типа Msg в ГОВ */
  window.msg = new Msg();
})(window);



/* Переопределим поведение console.log */
/* global msg */
console.log2 = console.log;
console.log = function(par) {
  msg.show(par);
};

/* Замечания:
  1. в конструктор передавать лишь два параметра, а остальные изменение остальных параметров сделеть через фцнкции-сеттеры
  2. в методе create() вынести в отдельные ф-ции создание:
    - elem
    - closeBtn
    - caption
    - textElem
    - textContainer
  3. применить throttle к перемещению окна (onmiusemove)
*/
