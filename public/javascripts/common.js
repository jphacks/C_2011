$(function(){

  // メニュー開閉
  function menuOpen() {
    $('.menu').toggleClass('menu-close');
    $('html,body').toggleClass('stop');
  }

  // ヘッダー展開
  function navOpen() {
    $('.sp-header').toggleClass('show');
  }

    // ハンバーガーメニュー
    $('.menu').click(function() {
      menuOpen();
      navOpen();
      return false;
    });

  });