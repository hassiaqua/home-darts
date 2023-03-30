/*
=====================================
使用するプラグイン（モジュールのロード）
=====================================
*/
var gulp = require('gulp'),
		plumber = require('gulp-plumber'), //エラーが原因でタスクが強制停止することを防止する
		ejs = require("gulp-ejs"),
		sass = require('gulp-sass')(require('sass')),
		rename = require('gulp-rename'),
		autoprefixer = require('gulp-autoprefixer'),
		browserSync = require('browser-sync'),
		jsmin = require('gulp-uglify'),
		mmq = require('gulp-merge-media-queries'), //mqをまとめる
		notify = require('gulp-notify'), //エラーの通知を出す
		imagemin = require('gulp-imagemin'),
		imageminJpg = require('imagemin-mozjpeg'),
		imageminPng = require('imagemin-pngquant'),
		imageminSvg = require('gulp-svgmin'),
		changed = require('gulp-changed'),
		cached = require('gulp-cached'),
		header = require('gulp-header'),
		replace = require('gulp-replace');

/*
=====================================
各ファイルのフォルダの指定
=====================================
*/
//Folder to develop -> 開発フォルダ
var develop = "develop/";
//Folder to public -> 公開フォルダ
var public = "html/";
//Folder to theme -> WPテーマフォルダにも反映（★のついてる行のコメントアウトを外す）
// var theme = "wp/wp-content/themes/xxx/";
//config
var config = {
	"path" : {
		"sassCompile" : develop+"sass/**/*.scss", //sassCompileはsassファイルがある場所。
		"sassModule" : develop+"sass/**/_*.scss",
		"afterCompileSass" : public+"css/",
		"ejsDir" : develop+"ejs/**/*.ejs", //コンパイルしたいejsファイルがある場所。
		"templateDir": develop+"ejs/templates/_*.ejs", //templateDirはテンプレートejsファイルがある場所。
		"afterCompileEjs": public,
		"devJs": develop+"js/*.js",
		"pubJs": public+"js/",
		"devImage": develop+"img/*.+(jpg|jpeg|png|gif|svg)",
		"pubImage": public+"img/",
	}
}
//config （/指定ディレクトリ/css/のように階層化するパターン）
// var config = {
// 	"path" : {
// 		"sassCompile" : develop+"sass/**/*.scss", //sassCompileはsassファイルがある場所。
// 		"sassModule" : develop+"sass/**/_*.scss",
// 		"afterCompileSass" : public, //（/指定ディレクトリ/css/のように階層化するパターン）
// 		"ejsDir" : develop+"ejs/**/*.ejs", //コンパイルしたいejsファイルがある場所。
// 		"templateDir": develop+"ejs/templates/_*.ejs", //templateDirはテンプレートejsファイルがある場所。
// 		"afterCompileEjs": public,
// 		"devJs": develop+"js/**/*.js",
// 		"pubJs": public, //（/指定ディレクトリ/js/のように階層化するパターン）
// 		"devImage": develop+"img/**/*.+(jpg|jpeg|png|gif|svg)",
// 		"pubImage": public, //（/指定ディレクトリ/img/のように階層化するパターン）
// 	}
// }

/*
=====================================
glupの実行 - 通常のHTML開発
=====================================
*/

function defaultTask(done) {
	//監視
	gulp.watch([config.path.ejsDir, config.path.templateDir], EJS);
	gulp.watch([config.path.sassCompile], SASS);
	gulp.watch([config.path.devJs], JS);
	gulp.watch([config.path.devImage], IMAGEMIN);
	// gulp.watch([public], RELOAD);
	// gulp.watch([theme], RELOAD); //wp開発時はこの行をイキ

	//サーバー起動
	browserSync({
		server:{
			baseDir: "./"+public //ルートとなるディレクトリ
		}
		// wp開発時は以下をイキ
		// port: 8888,
		// proxy: "localhost:8888", //各自指定
	});

	//ejsファイルのコンパイル
	function EJS() {
		return gulp
			.src([config.path.ejsDir,'!'+config.path.templateDir])
			.pipe(plumber({
				errorHandler: notify.onError('Error: <%= error.message %>')//エラーがあればデスクトップに通知
			}))
			.pipe(ejs())
			.pipe(rename({ extname: '.html' }))
			.pipe(gulp.dest(config.path.afterCompileEjs))
			.pipe(browserSync.stream())
		;
	}

	//sassファイルのコンパイルとプレフィックスの付与（/css/ディレクトリに一式のjsファイルを格納するパターン）
	function SASS() {
		return gulp
			.src([config.path.sassCompile,'!'+config.path.sassModule])
			.pipe(plumber({
				errorHandler: notify.onError('Error: <%= error.message %>')//エラーがあればデスクトップに通知
			}))
			.pipe(sass.sync({
				outputStyle : 'expanded',
				indentType : 'tab'
			}))
			// .pipe(sass({outputStyle: 'expanded', indentType: 'tab'}))
			.pipe(autoprefixer({grid: true}))//プレフィックスを付与
			.pipe(gulp.dest(config.path.afterCompileSass))//一度コンパイルしてから
			.pipe(mmq({ log: false }))
			.pipe(replace(/@charset "UTF-8";/g, ''))
			.pipe(header('@charset "UTF-8";\n\n'))
			.pipe(gulp.dest(config.path.afterCompileSass))//整形したcssを再度吐きだし
			// .pipe(gulp.dest(theme+"css/")) //★CSSをWPthemeにも複製
			.pipe(browserSync.stream())//変更した部分だけをブラウザ更新
		;
	}
	//sassファイルのコンパイルとプレフィックスの付与（/指定ディレクトリ/css/のように階層化するパターン）
	// function SASS() {
	// 	return gulp
	// 		.src([config.path.sassCompile,'!'+config.path.sassModule], { since: gulp.lastRun(SASS) })
	// 		.pipe(plumber({
	// 			errorHandler: notify.onError('Error: <%= error.message %>')//エラーがあればデスクトップに通知
	// 		}))
	// 		.pipe(sass({outputStyle: 'expanded', indentType: 'tab'}))
	// 		.pipe(autoprefixer({grid: true}))//プレフィックスを付与
	// 		.pipe(rename(function (path) { path.dirname += '/css'; })) //対象ディレクトリに css/ というディレクトリを作って格納
	// 		.pipe(replace(/@charset "UTF-8";/g, ''))
	// 		.pipe(header('@charset "UTF-8";\n\n'))
	// 		.pipe(gulp.dest(config.path.afterCompileSass))//一度コンパイルしてから
	// 		.pipe(mmq({ log: true }))
	// 		.pipe(gulp.dest(config.path.afterCompileSass))//整形したcssを再度吐きだし
	// 		// .pipe(gulp.dest(theme+"css/")) //★CSSをWPthemeにも複製
	// 		.pipe(browserSync.stream())//変更した部分だけをブラウザ更新
	// 	;
	// }

	//jsファイルの移動と圧縮（/js/ディレクトリに一式のjsファイルを格納するパターン）
	function JS() {
		return gulp
			.src(config.path.devJs, { since: gulp.lastRun(JS) })
			// .pipe(jsmin()) // JS圧縮
			.pipe(gulp.dest(config.path.pubJs))
			// .pipe(replace('$(function(){', 'jQuery(document).ready( function( $ ) {'))//★JSをWP用記述に変更
			// .pipe(jsmin()) // ★JS圧縮
			// .pipe(gulp.dest(theme+"js/")) //★JSをWPthemeにも複製
			.pipe(browserSync.stream())
		;
	}
	// jsファイルの移動と圧縮（/指定ディレクトリ/js/のように階層化するパターン）
	// function JS() {
	// 	return gulp
	// 		.src(config.path.devJs, { since: gulp.lastRun(JS) })
	// 		.pipe(rename(function (path) { path.dirname += '/js'; })) //対象ディレクトリに js/ というディレクトリを作って格納
	// 		// .pipe(jsmin()) // JS圧縮
	// 		.pipe(gulp.dest(config.path.pubJs))
	// 		// .pipe(replace('$(function(){', 'jQuery(document).ready( function( $ ) {'))//★JSをWP用記述に変更
	// 		// .pipe(jsmin()) // ★JS圧縮
	// 		// .pipe(gulp.dest(theme+"js/")) //★JSをWPthemeにも複製
	// 		.pipe(browserSync.stream())
	// 	;
	// }

	//画像の移動と圧縮（/img/ディレクトリに一式の画像を格納するパターン）
	function IMAGEMIN() {
		return gulp
			.src( config.path.devImage )
			// .pipe(cached('IMAGEMIN'))
			.pipe(changed( config.path.pubImage ))
			.pipe(imagemin([
				imageminPng({ 
					quality: [ 0.65, 0.8 ], speed: 1 
				}),
				imageminJpg({ 
					quality: 80
				}),
				imagemin.gifsicle({
					interlaced: false
				}),
				imagemin.svgo({
					plugins: [
						{ removeViewBox: false },
						{ cleanupIDs: false }
					]
				}),
			]))
			.pipe(gulp.dest( config.path.pubImage ))
			.pipe(browserSync.stream())
		;
	};
	// 画像の移動と圧縮（/指定ディレクトリ/img/のように階層化するパターン）
	// function IMAGEMIN() {
	// 	return gulp
	// 		.src( config.path.devImage )
	// 		.pipe(cached('IMAGEMIN'))
	// 		// .pipe(changed( config.path.pubImage ))
	// 		.pipe(imagemin([
	// 			imageminPng({ 
	// 				quality: [ 0.65, 0.8 ], speed: 1 
	// 			}),
	// 			imageminJpg({ 
	// 				quality: 80
	// 			}),
	// 			imagemin.gifsicle({
	// 				interlaced: false
	// 			}),
	// 			imagemin.svgo({
	// 				plugins: [
	// 					{ removeViewBox: false },
	// 					{ cleanupIDs: false }
	// 				]
	// 			}),
	// 		]))
	// 		.pipe(rename(function (path) { path.dirname += '/img'; })) //対象ディレクトリに img/ というディレクトリを作って格納
	// 		.pipe(gulp.dest( config.path.pubImage ))
	// 		.pipe(browserSync.stream())
	// 	;
	// };

	//ブラウザの自動リロード
	function RELOAD(done){
		browserSync.reload();
		done();
	}

}
exports.default = defaultTask;
