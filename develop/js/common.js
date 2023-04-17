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

/* calc
*********************************************/

/* ダーツ入力 */
function input() {

	$('.js-trigger').click(function() {

		/* number,multipleを取得 */
		let hit_number = $(this).data('number');
		let	hit_multiple = $(this).data('multiple');

		/* 点数計算 */
		let hit_score = 0;
		if (hit_number === 'bull') { //bullの場合
			if (hit_multiple == '1') {
				hit_score = 50;
			} else if(hit_multiple == '2'){
				hit_score = 50;
			}
		} else { //bull以外の場合
			hit_score = hit_number * hit_multiple;
		}

		countup(hit_score);

	});
}
input();


/* カウントアップ
*********************************************/
let countup_array = [];//得点の配列
let countup_array_leg = [];//得点の配列を階層化
let countup_array_score = [];//得点の合計
let $element_progress = $('.js-progress');//.progress取得
let $element_score = $('.js-score');//.score取得

function countup(score) {

	const leg = 8;

	/* 得点の配列 */
	countup_array.push(score);

	/* 配列を3つずつ分割して階層化 */
	for (let i = 0; i < countup_array.length; i += 3) {
		countup_array_leg.push(countup_array.slice(i, i + 3));
	}

	/* 特典の合計 */
	countup_array_score
	countup_array_score = countup_array.reduce(function(sum, element){
		return sum + element;
	}, 0);

	/* HTML出力 */

	//初期化
	$element_progress.html('');
	$element_score.html('');

	//progress
	for (let i = 0; i < countup_array_leg.length; i++) {
		const $row = $('<div>').addClass('progress__row');
		for (let j = 0; j < countup_array_leg[i].length; j++) {
			const $col = $('<div>').addClass('progress__col').text(countup_array_leg[i][j]);
			$row.append($col);
		}
		$element_progress.append($row);
	}

	//score
	$element_score.html(countup_array_score);

	//全て投げ終わった
	if (countup_array.length >= leg * 3) {
		$element_score.addClass('is-end');
		$('.js-trigger').prop('disabled',true);

	}

	//配列初期化
	countup_array_leg = [];
}

	// var score = 0;
	// var round = 1;
	// var scores = [];

	// function updateProgress() {
	//	 var progress = '';
	//	 for (var i = 0; i < 8; i++) {
	//		 if (scores[i] === undefined) {
	//			 progress += '-';
	//		 } else {
	//			 progress += scores[i].reduce(function(a, b) {
	//				 return a + b;
	//			 }, 0);
	//		 }
	//		 progress += ' ';
	//	 }
	//	 $('#progress').text(progress);
	// }

	// $('.js-trigger').click(function() {
	//	 var points = parseInt($(this).data('number'));
	//	 score += points;
	//	 $('#score').text(score);

	//	 if (scores[round - 1] === undefined) {
	//		 scores[round - 1] = [];
	//	 }
	//	 scores[round - 1].push(points);

	//	 if (scores[round - 1].length === 3) {
	//		 round += 1;
	//		 updateProgress();
	//	 }

	//	 if (round > 8) {
	//		 // 計算結果を出力する
	//		 var totalScore = 0;
	//		 for (var i = 0; i < 8; i++) {
	//			 var roundScore = scores[i].reduce(function(a, b) {
	//				 return a + b;
	//			 }, 0);
	//			 totalScore += roundScore;
	//			 console.log('Round ' + (i + 1) + ': ' + roundScore);
	//		 }
	//		 console.log('Total Score: ' + totalScore);

	//		 // ゲームをリセットする
	//		 score = 0;
	//		 round = 1;
	//		 scores = [];
	//		 $('#score').text(score);
	//		 $('#progress').text('');
	//	 }
	// });






// let hit_number = 0;
// let hit_multiple = 0;
// let hit_score = 0;

// let countup_score = 0;

// $('.js-trigger').click(function() {
// 	hit_number = $(this).data('number');
// 	hit_multiple = $(this).data('multiple');
// 	hit_score = hit_number * hit_multiple;

// 	// console.log(hit_score);

// 	$('.test-throw').append('<p class="test-throw__item">'+hit_score+'</p>');

// 	countup_score += hit_score;
// 	console.log(countup_score);
// 	$('.test-countup').html(countup_score)


// });

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