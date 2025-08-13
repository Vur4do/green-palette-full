import gulpWebp from "gulp-webp";
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';

export const images = () => {
	return app.gulp.src(app.path.src.images)
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "IMAGES",
				message: "Error: <%= error.message %>",
			})
		))
		.pipe(app.plugins.newer(app.path.build.images))
		.pipe(
			app.plugins.gulpIf(
				app.isBuild,
				gulpWebp()
			)
		)
		.pipe(
			app.plugins.gulpIf(
				app.isBuild,
				app.gulp.dest(app.path.build.images)
			)
		)
		.pipe(

			app.plugins.gulpIf(
				app.isBuild,
				app.gulp.src(app.path.src.images)
			)
		)
		.pipe(
			app.plugins.gulpIf(
				app.isBuild,
				app.plugins.newer(app.path.build.images)
			)
		)
		.pipe(
			app.plugins.gulpIf(
				app.isBuild,
				imagemin([
					gifsicle({ interlaced: true }),
					mozjpeg({ quality: 80, progressive: true }),
					optipng({ optimizationLevel: 3 }),
					svgo({
						plugins: [
							{
								name: 'removeViewBox',
								active: true
							},
							{
								name: 'cleanupIDs',
								active: false
							}
						]
					})
				])
			)
		)
		.pipe(app.gulp.dest(app.path.build.images))
		.pipe(app.gulp.src(app.path.src.svg))
		.pipe(app.gulp.dest(app.path.build.images))
		.pipe(app.plugins.browserSync.stream());
}