/* global define */

'use strict';

define([
  'review',
  'review-filter/review-filter-all',
  'review-filter/review-filter-recent',
  'review-filter/review-filter-good',
  'review-filter/review-filter-bad',
  'review-filter/review-filter-popular',
  'review-data'
], function(Review, ReviewFilterAll, ReviewFilterRecent, ReviewFilterGood, ReviewFilterBad, ReviewFilterPopular, ReviewData) {
  /**
   * Адрес для AJAX
   * @const
   * @type {string}
   */
  var URL_AJAX = 'http://o0.github.io/assets/json/reviews.json';

  var reviewsList = document.querySelector('.reviews-list');
  var reviewsFilter = document.querySelector('.reviews-filter');
  var filterControls = document.forms[0].querySelectorAll('input[name="reviews"]');
  var btnShowMore = document.querySelector('.reviews-controls-more');
  var footer = document.querySelector('footer');
  var activeFilterId;
  var filteredReviews = [];
  var filteredPagesCount;

  /**
   * кол-во отзывов выводимых за раз (по кнопке "Ещё", по скролу)
   * @const
   * @type {number}
   */
  var PAGE_SIZE = 3;
  var currentPage = 0;
  var scrollTimeout;

  /**
   * Таймаут прореживания события onscroll
   * @const
   * @type {number}
   */
  var TIMEOUT_SCROLL = 10;

  /**
   * Эта переменная нужна только при работе по AJAX,
   * для работы по JSONP  нужно:
   *  1. закомментировать эту переменную
   *  2. раскомментировать два закомметированных скрипта в низу файла index.html
   * @type {?Array.<Object>}
   */
  var reviews = [];

  /**
   * @type {?Array.<Object>}
   */
  var reviewObjects = [];


  /**
   * Индексы фильтров каментов
   * @enum {number}
   */
  var fi = {
    ALL: 0,
    RECENT: 1,
    GOOD: 2,
    BAD: 3,
    POPULAR: 4
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
    xhr.timeout = TIMEOUT_XHR;

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
   * @param {Array.<ReviewData>} reviewsToRender  Массив объектов (отзывов), которые нужно вывести на страницу
   * @param {boolean=} isAppendMode  Режим добавления новых отзывов или предварительно чистим контейнер
   */
  var renderReviews = function(reviewsToRender, isAppendMode) {
    if (!isAppendMode) {
      var reviewElements = reviewsList.querySelectorAll('.review');
      Array.prototype.forEach.call(reviewElements, function(item) {
        reviewsList.removeChild(item);
      });
    }

    /* отрежем отзывы для текущей страницы */
    reviewsToRender = reviewsToRender.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

    /* включаем или кнопку или скроллинг */
    enableBtnOrScroll(reviewsToRender.length);

    /* выводим на страницу */
    reviewsToRender.forEach(function(review) {
      var reviewElement = new Review(review);
      reviewElement.render();
      reviewsList.appendChild(reviewElement.element);

      /* голосовалка за/против комментарий */
      reviewElement.onVote = function(isYesVote, callback) {
        console.log('reviewElement.onVote :: before :: rating=' + review.getReviewUsefulness());
        isYesVote = (typeof isYesVote === 'undefined') ? 1 : isYesVote;
        review.setReviewUsefulness(isYesVote, callback);
        console.log('reviewElement.onVote :: after :: rating=' + review.getReviewUsefulness());
      };
    });

    /* прячем сообщение о начале загрузки */
    hideLoadingMsg();
  };



  /** Хэш-объект для вызова соответсвующего фильтра (ReviewFilter).
   * @type {Object}
   */
  var filterHash = {
    'reviews-all': new ReviewFilterAll(),
    'reviews-recent': new ReviewFilterRecent(),
    'reviews-good': new ReviewFilterGood(),
    'reviews-bad': new ReviewFilterBad(),
    'reviews-popular': new ReviewFilterPopular()
  };

  /**
   * Порядковый номер фильтра
   * @param {string} filterId  id-шник кликнутого радио-инпута
   * @return {?number}
   */
  var getFilter = function(filterId) {
    return filterHash[filterId];
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

    reviewsFilter = getFilter(filterId);
    filteredReviews = reviewsFilter.filter(reviewObjects);

    filteredPagesCount = Math.ceil(filteredReviews.length / PAGE_SIZE);
    renderReviews(filteredReviews);
    localStorage.setItem('filterId', filterId);
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
   * Порядковый номер фильтра
   * @param {string} filterId  id-шник кликнутого радио-инпута
   * @return {?number}
   */
  var getFilterIndex = function(filterId) {
    switch (filterId) {
      case 'reviews-all': return fi.ALL;
      case 'reviews-recent': return fi.RECENT;
      case 'reviews-good': return fi.GOOD;
      case 'reviews-bad': return fi.BAD;
      case 'reviews-popular': return fi.POPULAR;
    }
    return 0;
  };



  /**
   * Вывод данных после отработки AJAX-запроса
   * @param {*} dataJson  данные в JSON, полученные по AJAX-запросу
   */
  var renderReviewsJson = function(dataJson) {
    reviews = JSON.parse(dataJson);
    reviews.forEach(function(item) {
      reviewObjects.push(new ReviewData(item));
    });
    var filterIndex = getFilterIndex(localStorage.getItem('filterId'));
    filterControls[filterIndex].click();
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
});
