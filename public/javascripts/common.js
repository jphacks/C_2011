$(function(){


  // function stopload() {
  //   $('#loading-wrap').delay(900).fadeOut(800);
  //   $('html,body').css('overflow', 'visible');
  // }

  // $('html,body').css('overflow', 'hidden');

  // $(window).load(function () {
  //   stopload();
  //   });

  // setTimeout(function(){
	// 	$('#loading-wrap .img').fadeIn(1000);
	// },500);


  // メニュー開閉
  function menuOpen() {
    $('.menu').toggleClass('menu-close');
    $('html,body').toggleClass('stop');
  }

  // ヘッダー展開
  function navOpen() {
    $('.header').toggleClass('show');
  }

    // ハンバーガーメニュー
    $('.menu').click(function() {
      menuOpen();
      navOpen();
      return false;
    });

  });