(function() {

  function Msg(width, height, top, left, right, opacity, font, color, backgroundColor, padding) {
    this.width = width || '40%';
    this.height = height || '100px';
    this.top = top || '2px';
    this.left = left || null;
    this.right = right || null;
    this.opacity = opacity || '0.7';
    this.font = font || 'bold 15px Arial';
    this.color = color || 'black';
    this.backgroundColor = backgroundColor || 'lightyellow';
    this.padding = padding || '2px 2px 2px 2px';

    this.hide = this.hide.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.moveAt = this.moveAt.bind(this);
  };



  Msg.prototype.textOutput = function(text) {
    this.textElem.innerHTML = this.textElem.innerHTML + (this.textElem.innerHTML ? '<br>' : '') +
      this.getTimeStr() + ' > ' + text;
    this.textContainer.scrollTop = 9999999999999;
  }



  Msg.prototype.create = function(text) {
    this.elem = document.createElement('div');
    this.caption = document.createElement('div');
    this.caption.textContent = 'Log';
    this.caption.style.font = this.font;
    this.caption.style.fontStyle = 'italic';
    this.caption.style.fontWeight = 'normal';
    this.caption.style.padding = '0 0 3px 5px';
    this.closeBtn = document.createElement('div');
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
    this.textElem = document.createElement('div');
    this.textElem.style.backgroundColor = this.backgroundColor;
    this.textElem.style.border = '1px solid green';
    this.textElem.style.font = this.font;
    this.textContainer = document.createElement('div');
    this.textContainer.appendChild(this.textElem);
    this.elem.appendChild(this.caption);
    this.elem.appendChild(this.textContainer);
    this.elem.appendChild(this.closeBtn);


    this.elem.style.position = 'fixed';
    this.elem.style.zIndex = 1000;
    this.elem.style.display = 'block';
    this.elem.style.top = this.top;
    this.elem.style.width = this.width;
    this.elem.style.opacity = this.opacity;
    this.elem.style.color = this.color;
    this.elem.style.backgroundColor = 'lightgreen';
    this.elem.style.border = '1px solid green';
    this.elem.style.padding = this.padding;
    this.elem.style.cursor = 'default';
    this.textContainer.style.overflowY = 'scroll';
    this.textContainer.style.maxHeight = parseInt(this.height) - parseInt(this.elem.style.paddingTop) - parseInt(this.elem.style.paddingBottom) - parseInt(this.elem.style.borderWidth) * 2 + 'px';
    this.textOutput(text);
    document.body.appendChild(this.elem);
    if (this.left) {
      this.elem.style.left = this.left;
    } else if (this.right) {
      this.elem.style.right = this.right;
    } else {
      this.elem.style.left = this.top;
      //this.elem.style.left = document.documentElement.clientWidth - this.elem.clientWidth - parseInt(this.elem.style.borderWidth) * 2 + 'px';
    }
    /* раскомментировать для эффекта перетаскивания */
    this.elem.addEventListener('mousedown', this.onMouseDown);
    /**/
  };



  Msg.prototype.getTimeStr = function() {
    var d = new Date();
    return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' ' + d.getMilliseconds();
  }



  Msg.prototype.hide = function() {
    this.elem.style.display = 'none';
  }



  Msg.prototype.show = function(text) {
    if (this.elem) {
      if (this.elem.style.display == 'none') {
        this.elem.style.display = 'block';
      }
      if (text) {
        this.textOutput(text);
      }
    } else {
      this.create(text);
    }
    this.closeBtn.addEventListener('click', this.hide);
  }


  /* перетаскивание недоделано (нужно перехватывать скроллинг и не пропускать его выше) */
  Msg.prototype.moveAt = function(evt) {
    this.elem.style.top = evt.clientY - this.cursorElemY + 'px';
    this.elem.style.left = evt.clientX - this.cursorElemX +'px';
  }
  Msg.prototype.onMouseDown = function(evt) {
    if (evt.target !== this.closeBtn && evt.target !== this.textContainer && evt.target !== this.textElem ) {
      this.cursorElemX = (evt.offsetX==undefined) ? evt.layerX : evt.offsetX;
      this.cursorElemY = (evt.offsetY==undefined) ? evt.layerY : evt.offsetY;
      this.elem.style.cursor = 'pointer';
      this.moveAt(evt);
      document.onmousemove = this.moveAt;
      this.elem.onmouseup = this.onMouseUp;
    }
  }
  Msg.prototype.onMouseUp = function() {
    this.elem.style.cursor = 'default';
    document.onmousemove = null;
    this.elem.onmouseup = null;
  }



  /* Прокидываем тип в ГОВ */
  //window.Msg = Msg;

  /* Создаем объект типа Msg в ГОВ */
  window.msg = new Msg();
})();



/* Переопределим поведение console.log */
console.log2 = console.log;
console.log = function(par) {
  msg.show(par);
}
