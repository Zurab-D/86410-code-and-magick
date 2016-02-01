(function(){
  var reviewsList = document.querySelector('.reviews-list');
  var reviewTemplate = document.querySelector('#review-template');
  var reviewsFilter = document.querySelector('.reviews-filter');



  /* прячем фильтры отзывов */
  reviewsFilter.classList.add('invisible');



  /* перебрать все элементы в структуре данных */
  reviews.forEach(function(review){
    renderNewElements(review);
  });



  /* выводим элементы на страницу */
  function renderNewElements(review) {
    if ('content' in reviewTemplate) {
      var clone = reviewTemplate.content.children[0].cloneNode(true);
    } else {
      var clone = reviewTemplate.children[0].cloneNode(true);
    }

    clone.querySelector('.review-rating').style.width = (30 * review.rating) + 'px';
    clone.querySelector('.review-text').textContent = review.description;

    var img = new Image(124, 124);

    function errorLoadImage() {
      img.src = '';
      clone.classList.add('review-load-failure');
      clearTimeout(timeout);
    }

    /* назначаем картинке атрибут ALT */
    img.alt = review.author.name;
    img.classList.add('review-author');

    /* при загрузке картинки назначим ее путь в атрибут SRC */
    img.onload = function() {
      clearTimeout(timeout);
      img.src = review.author.picture;
    }

    /* при ошибке загрузке картинки в атрибут SRC пишем картинку ошибки загрузки */
    img.onerror = function(err) {
      //console.log('err: '+img.alt); - если раскомментиовать, видно, что onerror постоянно срабатывает
      errorLoadImage();
    }

    /* взводим таймаут, по которому назначим картинку ошибки загрузки */
    var TIMEOUT_IMAGE = 10000; /* 10 сек. */
    var timeout = setTimeout(function() {
      errorLoadImage();
    }, TIMEOUT_IMAGE)

    /* начинаем загрузку картинки */
    img.src = review.author.picture;

    clone.replaceChild(img, clone.querySelector('.review-author'));
    reviewsList.appendChild(clone);
  }



  /* показываем фильтры отзывов */
  reviewsFilter.classList.remove('invisible');
})();
