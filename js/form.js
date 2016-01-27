'use strict';

(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
    /* загрузить куки */
    readCookies();
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };



  /* ----------------------------------------------------------------------- */
  /*global docCookies*/
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



  /**
   * Сохранить печенюшки
   * Сохраните в cookies оценку и имя пользователя
   * Срок жизни cookie — количество дней, прошедшее с вашего ближайшего дня рождения
   */
  function saveCookies(nameValue, markValue) {
    var vEnd = new Date(Date.now() + Date.now() - new Date('2015-11-04')).toUTCString();
    if (nameValue.trim()) {
      docCookies.setItem('name', nameValue.trim(), vEnd);
    }
    if (markValue.trim()) {
      docCookies.setItem('mark', markValue.trim(), vEnd);
    }
  }



  /**
   * Загрузка значений полей из печенюшек
   */
  function readCookies() {
    reviewName.value = docCookies.getItem('name');
    var mark = docCookies.getItem('mark');
    reviewMarksAll[mark - 1].checked = true;
  }



  /* отслеживаем изменения */
  for (var i = 0; i < reviewMarksAll.length; i++) {
    reviewMarksAll[i].onchange = function() {
      refreshRequiredFieldsInfo();
    };
  }
  reviewName.onchange = function() {
    refreshRequiredFieldsInfo();
  };
  reviewText.onchange = function() {
    refreshRequiredFieldsInfo();
  };



  /* вешаем событие на submit */
  form.onsubmit = function(event) {
    event.preventDefault();
    if (isFormValid()) {
      saveCookies(reviewName.value, getMark());
      form.submit();
    } else {
      console.log('Форма не валидна!');
    }
  };
})();
