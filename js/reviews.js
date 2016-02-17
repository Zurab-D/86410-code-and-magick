'use strict';

(function() {
  var URL_AJAX = 'http://o0.github.io/assets/json/reviews.json';
  var reviewsList = document.querySelector('.reviews-list');
  var reviewsFilter = document.querySelector('.reviews-filter');
  var ratingClasses = ['one', 'two', 'three', 'four', 'five'];
  var filterControls = document.forms[0].querySelectorAll('input[name="reviews"]');
  var btnShowMore = document.querySelector('.reviews-controls-more');
  var footer = document.querySelector('footer');
  var activeFilterId;
  var filteredReviews;
  var filteredPagesCount;
  // кол-во отзывов выводимых за раз (по кнопке "Ещё", по скролу)
  var PAGE_SIZE = 3;
  var currentPage = 0;
  var scrollTimeout;
  // таймаут прореживания события onscroll
  var TIMEOUT_SCROLL = 10;

  /* Эта переменная нужна только при работе по AJAX,
     для работы по JSONP  нужно:
      1. закомментировать эту переменную
      2. раскомментировать два закомметированных скрипта в низу файла index.html */
  var reviews;



  /**
   * Получаем содержимое шаблона
   * @param {Element} template  шаблон
   * @return {Element}
   */
  var getTemplateContent = function(template) {
    if ('content' in template) {
      return template.content.children[0];
    } else {
      return template.children[0];
    }
  };



  /**
   * Создаем новый элемент (пользовательский отзыв) для последующего вывода на страницу
   * @param {Object} review  данные пользовательского отзыва
   * @return {Element}  созданный элеиент
   */
  var createNewElement = function(review) {
    var TIMEOUT_IMAGE = 10000; /* 10 сек. */
    var IMAGE_SIZE = 124;
    var reviewTemplate = document.querySelector('#review-template');
    var clone;
    var img = {};
    var timeout;

    /* обработка ошибки загрузки картинки */
    function errorLoadImage() {
      clone.classList.add('review-load-failure');
      if (timeout) {
        clearTimeout(timeout);
      }
    }

    clone = getTemplateContent(reviewTemplate).cloneNode(true);
    clone.querySelector('.review-text').textContent = review.description;
    clone.querySelector('.review-rating').classList.add('review-rating-' + ratingClasses[review.rating - 1]);

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
  };



  /**
   * Запрос данных по AJAX
   * @param {string} url
   * @param {Function} onLoadFunc  функция при завершении загрузки результата
   * @param {Function} onStartFunc  функция при старте запроса
   * @param {Function} onTimeoutFunc функция обработки выхода по таймауту
   * @param {string=} urlArgs  аргуметы URL-строки
   * @param {string=} method  метод запроса: GET, POST.
   */
  var requestAJAX = function(url, onLoadFunc, onStartFunc, onTimeoutFunc, urlArgs, method) {
    var TIMEOUT_XHR = 30000; /* 30 сек. */

    /* проверяем параметры */
    if (!onLoadFunc || !url) {
      return;
    }
    urlArgs = urlArgs || '';
    method = method || 'GET';

    url += (url.indexOf('?') + 1) ? '&' : '?';
    url += urlArgs;

    /* создаем xhr */
    var xhr = new XMLHttpRequest();
    xhr.timeout = TIMEOUT_XHR;

    xhr.ontimeout = function() {
      if (onTimeoutFunc) {
        onTimeoutFunc();
      } else {
        console.log('Извините, запрос превысил максимальное время');
      }
    };

    xhr.onload = function(event) {
      if (event.target.status === 200) {
        var dataJSON = event.target.response;
        onLoadFunc(dataJSON);
      }
    };

    xhr.open(method, url, true);

    if (method.toUpperCase() === 'GET') {
      xhr.send();
    } else {
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(urlArgs);
    }

    /* отрабатываем кастомное событие начала запроса */
    if (onStartFunc) {
      onStartFunc();
    }
  };



  /**
   * Вывод сообщения о начале загрузки
   */
  var showLoadingMsg = function() {
    document.querySelector('.reviews').classList.add('reviews-list-loading');
  };



  /**
   * Сокрытие сообщения о начале загрузки
   */
  var hideLoadingMsg = function() {
    document.querySelector('.reviews').classList.remove('reviews-list-loading');
  };



  /**
   * Вывод сообщения по таймауту
   */
  var timeoutFunc = function() {
    document.querySelector('.reviews').classList.add('reviews-load-failure');
  };



  /**
   * 1. Покажем кнопку "Ещё отзывы" если :
   *      отзывы есть
   *      и текущая страница < 2
   *      и текущая страница не является последней
   * 2. Включаем обработку скроллинга, если :
   *      текущая страница > 1
   *      и текущая страница не последняя
   * @param {number} reviewsCount  количество отзывов, которые нужно отобразить
   */
  var enableBtnOrScroll = function(reviewsCount) {
    if (reviewsCount > 0 && currentPage < 2 && currentPage < filteredPagesCount - 1) {
      btnShowMore.classList.remove('invisible');
    } else {
      btnShowMore.classList.add('invisible');

      /* обработка скроллинга*/
      if (currentPage < filteredPagesCount - 1) {
        window.addEventListener('scroll', scrollProcessing);
      }
    }
  };



  /**
   * Вывод данных на страницу
   * @param {Array} reviewsToRender  Массив объектов (отзывов), которые нужно вывести на страницу
   * @param {boolean=} isAppendMode  Режим добавления новых отзывов или предварительно чистим контейнер
   */
  var renderReviews = function(reviewsToRender, isAppendMode) {
    if (!isAppendMode) {
      reviewsList.innerHTML = '';
    }

    /* отрежем отзывы для текущей страницы */
    reviewsToRender = reviewsToRender.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

    /* включаем или кнопку или скроллинг */
    enableBtnOrScroll(reviewsToRender.length);

    /* выводим на страницу */
    reviewsToRender.forEach(function(review) {
      reviewsList.appendChild(createNewElement(review));
    });

    /* прячем сообщение о начале загрузки */
    hideLoadingMsg();
  };



  /**
   * Переключение фильтров
   * @param {string} filterId  id-шник кликнутого радио-инпута
   */
  var setActiveFilter = function(filterId) {
    if (activeFilterId === filterId) {
      return;
    }

    currentPage = 0;
    window.removeEventListener('scroll', scrollProcessing);

    switch (filterId) {
      case 'reviews-all':
        filteredReviews = reviews.slice(0);
        break;
      case 'reviews-recent':
        /* дата <= 14 дней недели */
        filteredReviews = reviews.filter(function(review) {
          return new Date(review.date) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 14);
        }).sort(function(a, b) {
          return b.date - a.date;
        });
        break;
      case 'reviews-good':
        // Хорошие — с рейтингом не ниже 3, отсортированные по убыванию рейтинга
        filteredReviews = reviews.filter(function(review) {
          return review.rating >= 3;
        }).sort(function(a, b) {
          return b.rating - a.rating;
        });
        break;
      case 'reviews-bad':
        // Плохие — с рейтингом не выше 2, отсортированные по возрастанию рейтинга.
        filteredReviews = reviews.filter(function(review) {
          return review.rating <= 2;
        }).sort(function(a, b) {
          return a.rating - b.rating;
        });
        break;
      case 'reviews-popular':
        // Популярные — отсортированные по убыванию оценки отзыва (поле reviewRating)
        filteredReviews = reviews.slice(0).sort(function(a, b) {
          return b['review_usefulness'] - a['review_usefulness'];
        });
        break;
    }
    filteredPagesCount = Math.ceil(filteredReviews.length / PAGE_SIZE);
    renderReviews(filteredReviews);
  };



  /**
   * Инициализация activeFilterId и событий перключения фильтра
   */
  var initActiveFilterId = function() {
    reviewsFilter.addEventListener('click', function(event) {
      var clickedElement = event.target;
      if (clickedElement.name === 'reviews') {
        setActiveFilter(clickedElement.id);
      }
    });
  };



  /**
   * Вывод данных после отработки AJAX-запроса
   * @param {*} dataJson  данные в JSON, полученные по AJAX-запросу
   */
  var renderReviewsJson = function(dataJson) {
    reviews = JSON.parse(dataJson);
    filterControls[0].click();
  };



  /**
   * Функция показа следующей страницы отзывов
   */
  var showNextPage = function() {
    if (currentPage < (filteredPagesCount - 1)) {
      currentPage++;
      renderReviews(filteredReviews, true);
    }
  };



  /**
   * Функция обработки скроллинга
   */
  var scrollProcessing = function() {
    if (!scrollTimeout) {
      var footerCoordinates = footer.getBoundingClientRect();
      if (footerCoordinates.top - window.innerHeight <= footerCoordinates.height) {
        showNextPage();
      }
      /* throttle - проредим срабатывание события onscroll */
      scrollTimeout = setTimeout(function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = null;
      }, TIMEOUT_SCROLL);
    }
  };



  /*** Обработка клика по кнопке "Еще отзывы" */
  btnShowMore.addEventListener('click', showNextPage);





  /* проинициализируем activeFilterId */
  initActiveFilterId();

  /* прячем фильтры отзывов */
  reviewsFilter.classList.add('invisible');

  /* Вывести элементы по технологии JSONP */
  //showLoadingMsg();
  //filterControls[0].click();

  /* выполним запрос по AJAX */
  requestAJAX(URL_AJAX, renderReviewsJson, showLoadingMsg, timeoutFunc);

  /* показываем фильтры отзывов */
  reviewsFilter.classList.remove('invisible');
})();
