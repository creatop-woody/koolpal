"use strict";

(function ($) {
  // 判斷是否為行動裝置
  var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/);
  var initSwiper = function initSwiper() {
    new Swiper('.hero .swiper', {
      speed: 1000,
      loop: $('.hero .swiper-slide').length > 1,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      }
    });
  };
  var initAOS = function initAOS() {
    AOS.init({
      duration: 1000,
      once: true
    });
  };
  var scrollWindow = function scrollWindow() {
    function checkWindowPosition() {
      var scrollTop = $(window).scrollTop();
      if (scrollTop > 0) {
        $('body').addClass('scrollDown');
      } else {
        $('body').removeClass('scrollDown');
      }
    }
    checkWindowPosition();
    $(window).on('scroll', checkWindowPosition);
  };
  var goAnchor = function goAnchor() {
    $('[data-href]').on('click', function () {
      var target = $(this).data('href');
      var targetPosition = $(target).offset().top;
      $('html,body').stop().animate({
        scrollTop: targetPosition
      }, 800);
    });
  };
  var goTop = function goTop() {
    $('.go-top').on('click', function () {
      $('html, body').animate({
        scrollTop: 0
      }, 750);
    });
  };
  var w = $(window).width();
  $('.banner-box').slick({
    speed: 1000,
    autoplaySpeed: 4000,
    autoplay: true,
    dots: true,
    arrows: false,
    fade: true
  });
  $('.idx-products-box').slick({
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 4,
    prevArrow: '.idx-products-prev',
    nextArrow: '.idx-products-next'
  });
  var video = function video() {
    $('.banner-box .slick-current').each(function () {
      var videoType = $(this).data("video-type");
      var videoSrc = $(this).data("video-href");

      // 檢查當前 .slick-current 元素底下的 video 或 iframe 的 src 是否已經設置
      var videoElement = $(this).find('video');
      var iframeElement = $(this).find('.video-iframe iframe');
      if (videoElement.attr('src') || iframeElement.attr('src')) {
        return; // 如果 src 已經設置，退出函數
      }
      if (videoType === "youtube") {
        var video_link = 'https://www.youtube.com/embed/' + videoSrc + '?autoplay=1&loop=1&mute=1&playlist=' + videoSrc;
        iframeElement.attr("src", video_link);
        $(this).find('.banner-img').addClass('close');
      } else if (videoType === "vimeo") {
        var _video_link = 'https://player.vimeo.com/video/' + videoSrc + '?autoplay=1&loop=1&muted=1';
        iframeElement.attr("src", _video_link);
        $(this).find('.banner-img').addClass('close');
      } else if (videoType === "video") {
        videoElement.attr('src', videoSrc);
        videoElement[0].play();
        $(this).find('.banner-img').addClass('close');
      }
    });
  };
  video();
  var video_close = function video_close() {
    // $('.video-iframe').find('iframe').attr("src", '');
    var mp4 = $('.banner-box').find('video');
    mp4.pause();
    mp4.currentTime = 0;
  };
  $('.banner-box').on('swipe', function (event, slick, direction) {
    video_close();
  });
  $('.banner-box').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
    $('.banner-img').removeClass('close');
  });
  $('.banner-box').on('afterChange', function (event, slick, currentSlide, nextSlide) {
    var time = $('.slick-current').data('speed') - 1000;
    setTimeout(function () {
      $('.banner-box').slick('slickPlay');
    }, time);
    $('.banner-box').slick('slickPause');
    video();
  });
  lightGallery(document.getElementById('light-review'), {
    licenseKey: '13FA3AF5-7D5A-46DE-A01E-FF752176E9D3',
    selector: '.video-list',
    controls: false,
    counter: false,
    enableDrag: false,
    enableSwipe: false,
    download: false,
    plugins: [lgVideo]
  });
  $('.page-class-box').slick({
    infinite: false,
    slidesToShow: 10,
    slidesToScroll: 1,
    arrows: false
  });
  if (w > 1280) {
    $('.has-secend-menu').hover(function () {
      $(this).siblings().removeClass('menu-open').stop(0, 1);
      $(this).toggleClass('menu-open').stop(0, 1);
      $('header').toggleClass('header-hover');
    });
  }
  $(function () {
    initSwiper();
    initAOS();
    scrollWindow();
    goAnchor();
    goTop();
  });
})(jQuery);
function svg() {
  $('img[src$=".svg"].js-svg').each(function () {
    var $img = $(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');
    $.get(imgURL, function (data) {
      // Get the SVG tag, ignore the rest   
      var $svg = $(data).find('svg');
      // Add replaced image's ID to the new SVG   
      if (typeof imgID !== 'undefined') {
        $svg = $svg.attr('id', imgID);
      }
      // Add replaced image's classes to the new SVG   
      if (typeof imgClass !== 'undefined') {
        $svg = $svg.attr('class', imgClass + ' replaced-svg');
      }
      // Remove any invalid XML tags as per http://validator.w3.org   
      $svg = $svg.removeAttr('xmlns:a');
      // Check if the viewport is set, if the viewport is not set the SVG wont't scale.   
      if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
        $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'));
      }
      // Replace image with new SVG   
      $img.replaceWith($svg);
    }, 'xml');
  });
}
svg();