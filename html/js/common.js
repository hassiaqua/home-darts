$(function(){

var $window = $(window),
		breakPoint = 767, //ブレイクポイントの設定
		winW = $window.width(), //画面の横幅
		winH = $window.height(), //画面の縦幅
		anchorSpeed = 400, //アンカーリンクのスムーズスクロールのスピード
		resizeTimer = false;


/* change Img
*********************************************/
function changeImgSp(){
	$('.change-img').each(function(){
		$(this).attr("src",$(this).attr("src").replace(/_pc\./, '_sp.'));
	});
}
function changeImgPc(){
	$('.change-img').each(function(){
		$(this).attr("src",$(this).attr("src").replace(/_sp\./, '_pc.'));
	});
}

/* smooth scroll 
*********************************************/
var headerHeight = 0;
// var headerHeight = $('.l-header').outerHeight(); //headerが常時追従の場合はこれをアンコメント
var urlHash = location.hash;

if(urlHash) {
	$('body,html').stop().scrollTop(0);
	setTimeout(function(){
		var target = $(urlHash);
		smoothScroll(target);
	}, 100);
}
$('.anchor').click(function() {
	var href= $(this).attr("href");
	var target = $(href);
	smoothScroll(target);
	return false;
});

function smoothScroll(target) {
	var position = target.offset().top - headerHeight;
	$("html, body").animate({scrollTop:position}, anchorSpeed, "swing");
}

/* SCROLL BLOCK - メニュー等が開いている間はコンテンツがスクロールしないよう制御
*********************************************/
function scrollBlocker(flag){
	if(flag){
		scrollpos = $(window).scrollTop();
		$('.l-body').addClass('is-fixed').css({'top': -scrollpos});
	} else {
		$('.l-body').removeClass('is-fixed').removeAttr('style');
		window.scrollTo( 0 , scrollpos );
	}
}
// scrollBlocker(true); //スクロールブロック有効
// scrollBlocker(false); //スクロールブロック無効

/* sp menu
*********************************************/
// $('.menu-btn').click(function(){
// 	$('.l-navi').fadeToggle(400);
// 	$(this).toggleClass('is-opend');
// 	if($('.l-body').hasClass('is-fixed')) {
// 		scrollBlocker(false);
// 	} else {
// 		scrollBlocker(true);
// 	}
// });

/* sp menu
*********************************************/
let hit_number = 0;
let hit_multiple = 0;
let hit_score = 0;

let countup_score = 0;

$('.js-trigger').click(function() {
	hit_number = $(this).data('number');
	hit_multiple = $(this).data('multiple');
	hit_score = hit_number * hit_multiple;

	// console.log(hit_score);

	$('.test-throw').append('<p class="test-throw__item">'+hit_score+'</p>');

	countup_score += hit_score;
	console.log(countup_score);
	$('.test-countup').html(countup_score)


});

/********************************************
 [PC ONLY]
*********************************************/
function pcSizeOnly(){

	/* 画像PC/SP切り替え
	*******************************************/
	changeImgPc();

}

/********************************************
 [SP ONLY]
*********************************************/
function spSizeOnly(){

	/* 画像PC/SP切り替え
	*******************************************/
	changeImgSp();

}

/********************************************
 [PC/SP切り替え] 以下編集不可
*********************************************/
function descriminateBp(){
	winW = $window.width();
	if(winW <= breakPoint){
		spSizeOnly();
	}else if(winW > breakPoint){
		pcSizeOnly();
	}
}
descriminateBp();
$window.resize(function() {
	if(winW > $window.width() || winW < $window.width()){
		if (resizeTimer !== false) {
			clearTimeout(resizeTimer);
		}
		resizeTimer = setTimeout(descriminateBp, 200);
	}
});

});

/********************************************
 [LOAD]
*********************************************/
// $(window).on('load',function(){

	/* Loading
	*********************************************/


// });