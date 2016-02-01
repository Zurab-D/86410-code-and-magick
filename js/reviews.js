'use strict';

(function() {
  var reviewsList = document.querySelector('.reviews-list');
  var reviewTemplate = document.querySelector('#review-template');
  var reviewsFilter = document.querySelector('.reviews-filter');



  /* прячем фильтры отзывов */
  reviewsFilter.classList.add('invisible');



  /* перебрать все элементы в структуре данных */
  /*global reviews*/
  reviews.forEach(function(review) {
    renderNewElements(review);
  });



  /* выводим элементы на страницу */
  function renderNewElements(review) {
    var TIMEOUT_IMAGE = 10000; /* таймаут 10 сек. */
    var img;
    var clone;
    var timeout;
    //var e = 0;

    if ('content' in reviewTemplate) {
      clone = reviewTemplate.content.children[0].cloneNode(true);
    } else {
      clone = reviewTemplate.children[0].cloneNode(true);
    }

    clone.querySelector('.review-rating').style.width = (30 * review.rating) + 'px';
    clone.querySelector('.review-text').textContent = review.description;

    /* функция обработки ошибки */
    function errorLoadImage() {
      img.src = '';
      clearTimeout(timeout);
      clone.classList.add('review-load-failure');
    }

    /* создаем картинку */
    img = new Image(124, 124);
    img.alt = review.author.name;
    img.classList.add('review-author');

    /* при загрузке картинки подложим ее вместо того что было в шаблоне */
    img.onload = function() {
      clearTimeout(timeout);
      clone.replaceChild(img, clone.querySelector('.review-author'));
    };

    /* при ошибке загрузке картинки в атрибут SRC пишем картинку ошибки загрузки */
    img.onerror = function() {
      //if (++e < 1000) console.log('err('+e+'): ' + img.alt); //- если раскомментиовать, видно, что onerror постоянно срабатывает
      errorLoadImage();
    };

    /* начинаем загрузку картинки */
    img.src = review.author.picture;

    /* взводим таймаут, по которому назначим картинку ошибки загрузки */
    timeout = setTimeout(function() {
      errorLoadImage();
    }, TIMEOUT_IMAGE);

    /* добавляем созданный элемент в родительский блок */
    reviewsList.appendChild(clone);
  }



  /* показываем фильтры отзывов */
  reviewsFilter.classList.remove('invisible');
})();
