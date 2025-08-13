import replace from "gulp-replace"; //пошук і заміна
import plumber from "gulp-plumber"; //обробка помилок
import notify from "gulp-notify"; //сповіщення
import browserSync from "browser-sync"; //локальний сервер
import newer from "gulp-newer"; //перевірка оновлення
import gulpIf from "gulp-if"; //Умовний перехід

export const plugins = {
	replace: replace,
	plumber: plumber,
	notify: notify,
	browserSync: browserSync,
	newer: newer,
	gulpIf: gulpIf,
}