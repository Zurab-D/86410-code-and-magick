'use strict';

(function() {
  var reviewsList = document.querySelector('.reviews-list');
  var reviewsFilter = document.querySelector('.reviews-filter');
  var ratingClasses = ['one', 'two', 'three', 'four', 'five'];

  /* получаем контент шаблона */
  function getTemplateContent(template) {
    if ('content' in template) {
      return template.content.children[0];
    } else {
      return template.children[0];
    }
  }

  /* выводим элементы на страницу */
  function createNewElement(review) {
    var TIMEOUT_IMAGE = 10000; /* 10 сек. */
    var reviewTemplate = document.querySelector('#review-template');
    var clone;
    var img = {};
    var timeout;
    var e = 0;

    clone = getTemplateContent(reviewTemplate).cloneNode(true);
    clone.querySelector('.review-text').textContent = review.description;
    clone.querySelector('.review-rating').classList.add('review-rating-' + ratingClasses[review.rating]);



    /* обработка ошибки загрузки картинки */
    function errorLoadImage() {
      clone.classList.add('review-load-failure');
      timeout && clearTimeout(timeout);
      img.src = '';
    }



    /* создаем объект-картинку */
    img = new Image(124, 124);
    //img = clone.querySelector('.review-author');

    /* при загрузке созданной картинки вставим ее в элемент */
    img.onload = function() {
      clone.replaceChild(img, clone.querySelector('.review-author'));
      timeout && clearTimeout(timeout);
    }

    /* при ошибке загрузке картинки, назначаем элементу соотв. класс */
    img.onerror = function() {
      errorLoadImage();
      //img.onerror = null; // - если раскомментировать, перестает срабатывать бесконечно
      (++e < 100) && console.log('err ('+e+'): ' + img.alt);
    }


    /* взводим таймаут, по которому назначим картинку ошибки загрузки */
    timeout = setTimeout(errorLoadImage, TIMEOUT_IMAGE);

    /* начинаем загрузку картинки */
    img.src = review.author.picture;
    img.title = review.author.name;
    img.alt = review.author.name;
    img.classList.add('review-author');

    return clone;
  }




  /* прячем фильтры отзывов */
  reviewsFilter.classList.add('invisible');

  /* перебрать все элементы в структуре данных */
  reviews.forEach(function(review){
    reviewsList.appendChild(createNewElement(review));
  });

  /* показываем фильтры отзывов */
  reviewsFilter.classList.remove('invisible');
})();
/*
::::: ВОПРОСЫ :::::

  - img.onerror() срабатывает бесконечно. Почему?
    Приходится писать "img.onerror = null;" чтобы после первой отработки остановилась.

  - Зачем мы делаем "img = new Image()", если и без этого все работает (img = clone.querySelector('.review-author'))
*/
