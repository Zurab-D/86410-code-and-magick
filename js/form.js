/* global define, docCookies */

'use strict';

define([], function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  /**
   * Клик по кнопке "Добавить свой"
   * @param {Event} evt
   */
  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
    /* загрузить куки */
    readCookies();
  };

  /**
   * Клик по крестику в форме
   * @param {Event} evt
   */
  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };



  /* ----------------------------------------------------------------------- */
  var reviewName = document.querySelector('#review-name');
  var reviewText = document.querySelector('#review-text');
  var reviewMarksAll = document.querySelectorAll('input[type="radio"][name="review-mark"]');
  var reviewFields = document.querySelector('.review-fields');
  var reviewFieldsName = document.querySelector('.review-fields-name');
  var reviewFieldsText = document.querySelector('.review-fields-text');
  var btnSubmit = document.querySelector('.review-submit');
  var form = document.querySelector('.review-form');



  /**
   * узнать оценку
   */
  function getMark() {
    for (var i = 0; i < reviewMarksAll.length; i++) {
      if (reviewMarksAll[i].checked) {
        return reviewMarksAll[i].value;
      }
    }
    return 3;
  }



  /**
   * проверка валидности имени
   */
  function isNameValid() {
    return reviewName.value.trim() !== '';
  }



  /**
   * проверка валидности текста, если оценка < 3
   */
  function isTextValid(mark) {
    return mark > 2 || reviewText.value.trim() !== '';
  }



  /**
   * Проверка валидности элементов формы
   */
  function isFormValid() {
    /* узнаем выставленную оценку */
    var mark = getMark();

    /* проверим валидность имени */
    if (!isNameValid()) {
      return false;
    }

    /* проверим валидность текста, если оценка < 3 */
    if (!isTextValid(mark)) {
      return false;
    }

    /* все проверки прошли успешно */
    return true;
  }



  /**
   * Обновить информацию о незаполненных полях
   */
  function refreshRequiredFieldsInfo() {
    var nameValidity = isNameValid();
    var textValidity = isTextValid(getMark());

    /* спрячем / покажем инфо-блок */
    if (nameValidity && textValidity) {
      btnSubmit.disabled = false;
      reviewFields.style.display = 'none';
    } else {
      btnSubmit.disabled = true;
      reviewFields.style.display = 'inline-block';
      if (nameValidity) {
        reviewFieldsName.style.display = 'none';
      } else {
        reviewFieldsName.style.display = 'inline';
      }
      if (textValidity) {
        reviewFieldsText.style.display = 'none';
      } else {
        reviewFieldsText.style.display = 'inline';
      }
    }
  }
  /* инициализация состояния инфо-блока на старте */
  refreshRequiredFieldsInfo();



  function getDateExpire(dateLastBirthDay) {
    /* сколько дней прошло после последнего ДР */
    var daysAfterLastBirthDay = new Date() - dateLastBirthDay;

    /* дата протухания печенюшки = сейчас + кол-во дней с последнего ДР  */
    return new Date(Date.now() + daysAfterLastBirthDay).toUTCString();
  }


  /**
   * Сохранить печенюшки
   * Сохраните в cookies оценку и имя пользователя
   * Срок жизни cookie — количество дней, прошедшее с вашего ближайшего дня рождения
   */
  function saveCookies(nameValue, markValue, dateEnd) {

    if (nameValue.trim()) {
      docCookies.setItem('name', nameValue.trim(), dateEnd);
    }
    if (markValue) {
      docCookies.setItem('mark', markValue, dateEnd);
    }
  }



  /**
   * Загрузка значений полей из печенюшек
   */
  function readCookies() {
    try {
      reviewName.value = docCookies.getItem('name');
      var mark = docCookies.getItem('mark');
      if (!isNaN(parseInt(mark, 10))) {
        reviewMarksAll[parseInt(mark, 10) - 1].checked = true;
      }
    } catch (err) {
      console.log('Ошибка ' + err.name + ': ' + err.message);
    }
  }



  /**
   * Повесить обработчик на все события изменения элемента.
   * Идея взята отсюда: https://learn.javascript.ru/events-change
   */
  function changeFormElement(element, functionElementProcessor) {
    element.onchange = element.onkeyup = element.oninput = functionElementProcessor;
    element.onpropertychange = function(event) {
      if (event.propertyName === 'value') {
        functionElementProcessor();
      }
    };
    element.oncut = function() {
      setTimeout(functionElementProcessor, 0); // на момент oncut значение еще старое
    };
  }



  /* отслеживаем изменения */
  for (var i = 0; i < reviewMarksAll.length; i++) {
    changeFormElement(reviewMarksAll[i], refreshRequiredFieldsInfo);
  }
  changeFormElement(reviewName, refreshRequiredFieldsInfo);
  changeFormElement(reviewText, refreshRequiredFieldsInfo);



  /* вешаем событие на submit */
  form.onsubmit = function(event) {
    event.preventDefault();
    if (isFormValid()) {
      var dateLastBirthDay = new Date('2015-11-04');
      saveCookies(reviewName.value, getMark(), getDateExpire(dateLastBirthDay));
      form.submit();
    } else {
      console.log('Форма не валидна!');
    }
  };
});
