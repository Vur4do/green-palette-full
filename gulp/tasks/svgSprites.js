import svgSprites from "gulp-svg-sprite";

export const svgSprite = () => {
	return app.gulp.src(`${app.path.src.svgicons}`, {})
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "SVG",
				message: "Error: <%= error.message %>",
			})
		))
		.pipe(svgSprites({
			mode: {
				stack: {
					sprite: `../icons/icons.svg`,
					// створювати сторінку з переліком іконок
					example: true,
				}
			},
		}))
		.pipe(app.gulp.dest(`${app.path.build.images}`));
}