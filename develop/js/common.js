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
				bullSound();
			} else if(hit_multiple == '2'){
				hit_score = 50;
				bullSound();
			}
		} else { //bull以外の場合
			hit_score = hit_number * hit_multiple;
			singleSound();
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

function bullSound() {
	const bull = new Audio('audio/bull.wav');
	bull.play();
}

function singleSound() {
	const single = new Audio('audio/single.m4a');
	single.play();
}


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