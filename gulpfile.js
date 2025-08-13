//основний модуль
import gulp from "gulp";

//імпорт шляхів
import { path } from "./gulp/config/path.js";

//імпорт загальних плагінів
import { plugins } from "./gulp/config/plugins.js";

//передаємо значення в глобальну змінну
global.app = {
	isBuild: process.argv.includes('--build'),
	isDev: !process.argv.includes('--build'),
	path: path,
	gulp: gulp,
	plugins: plugins,
}

//імпорт задач
import { copy } from "./gulp/tasks/copy.js";
import { libs } from "./gulp/tasks/libs.js";
import { reset } from "./gulp/tasks/reset.js";
import { html } from "./gulp/tasks/html.js";
import { server } from "./gulp/tasks/server.js";
import { scss } from "./gulp/tasks/scss.js";
import { js } from "./gulp/tasks/js.js";
import { images } from "./gulp/tasks/images.js";
import { video } from "./gulp/tasks/video.js";
import { otfToTtf, ttfToWoff, fontsStyle } from "./gulp/tasks/fonts.js";
import { svgSprite } from "./gulp/tasks/svgSprites.js";
import { zip } from "./gulp/tasks/zip.js";
import { ftp } from "./gulp/tasks/ftp.js";

//спостерігач за змінами у файлах
function watcher() {
	//щоб при зміні все автоматично вивантажувалось на сервер 
	//замість кожної задачі(останній параметр, copy, html...) треба написати
	//gulp.series(copy, ftp), gulp.series(html, ftp)...
	gulp.watch(path.watch.files, copy);
	gulp.watch(path.watch.html, html);
	gulp.watch(path.watch.scss, scss);
	gulp.watch(path.watch.js, js);
	gulp.watch(path.watch.images, images);
	gulp.watch(path.watch.video, video);
}

export { svgSprite }

// послідовна обробка шрифтів
const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

//основні задачі
const mainTasks = gulp.series(fonts, libs, gulp.parallel(copy, html, scss, js, images, video));

//побудова сценаріїв виконання задач
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server)); //метод series виконує задачі послідовно
const build = gulp.series(reset, mainTasks);
const deployZIP = gulp.series(reset, mainTasks, zip);
const deployFTP = gulp.series(reset, mainTasks, ftp);

// експорт сценаріїв
export { dev }
export { build }
export { deployZIP }
export { deployFTP }

//виконання сценарію за замовчуванням
gulp.task('default', dev);