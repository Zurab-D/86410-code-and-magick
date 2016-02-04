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
    var IMAGE_SIZE = 124;
    var reviewTemplate = document.querySelector('#review-template');
    var clone;
    var img = {};
    var timeout;

    clone = getTemplateContent(reviewTemplate).cloneNode(true);
    clone.querySelector('.review-text').textContent = review.description;
    clone.querySelector('.review-rating').classList.add('review-rating-' + ratingClasses[review.rating]);



    /* обработка ошибки загрузки картинки */
    function errorLoadImage() {
      clone.classList.add('review-load-failure');
      if (timeout) {
        clearTimeout(timeout);
      }
    }



    /* создаем объект-картинку */
    img = new Image(IMAGE_SIZE, IMAGE_SIZE);

    /* при загрузке созданной картинки вставим ее в элемент */
    img.onload = function() {
      clone.replaceChild(img, clone.querySelector('.review-author'));
      if (timeout) {
        clearTimeout(timeout);
      }
    };

    /* при ошибке загрузке картинки, назначаем элементу соотв. класс */
    img.onerror = errorLoadImage;

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
  /*global reviews*/
  reviews.forEach(function(review) {
    reviewsList.appendChild(createNewElement(review));
  });

  /* показываем фильтры отзывов */
  reviewsFilter.classList.remove('invisible');
})();
