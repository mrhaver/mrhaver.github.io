const { src, dest, series, watch } = require("gulp");
const del = require("del");
const njk = require("gulp-nunjucks-render");
const beautify = require("gulp-beautify");
const sass = require("gulp-sass")(require("sass"));
const minify = require("gulp-minify");

function buildStyles() {
	return src("./src/sass/main.scss")
		.pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
		.pipe(dest("./dist/css"));
}

function jsCompress() {
	return src(["src/js/*.js"]).pipe(minify()).pipe(dest("dist/js"));
}

function moveFiles() {
	return src(["public/**"]).pipe(dest("dist"));
}

function clean() {
	return del(["dist"]);
}

function html() {
	return src("src/html/pages/*.+(html|njk)")
		.pipe(
			njk({
				path: ["src/html", "src/macros"],
			})
		)
		.pipe(beautify.html({ indent_size: 4, preserve_newlines: false }))
		.pipe(dest("dist"));
}

function watchFiles() {
	watch("src/html/**/*", html);
	watch("src/sass/**/*", buildStyles);
}

exports.build = series(clean, html, buildStyles, jsCompress, moveFiles, watchFiles);
exports.default = series(clean, html, watchFiles);
