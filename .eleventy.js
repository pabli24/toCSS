module.exports = function(eleventyConfig) {

	eleventyConfig.addPassthroughCopy('./src/img');

	eleventyConfig.addPassthroughCopy({
		"node_modules/lz-string/libs/lz-string.min.js": "/js/lz-string.min.js",

		"node_modules/ace-builds/src-min-noconflict/worker-css.js": "/js/worker-css.js",

		"node_modules/stylus-lang-bundle/dist/stylus-renderer.min.js": "/js/stylus-renderer.min.js",

		"node_modules/less/dist/less.min.js": "/js/less.min.js",
		"node_modules/less/dist/less.min.js.map": "/js/less.min.js.map",

		"node_modules/usercss-meta/dist/usercss-meta.min.js": "/js/usercss-meta.min.js",
		"node_modules/usercss-meta/dist/usercss-meta.min.js.map": "/js/usercss-meta.min.js.map"
	});

	return {
		dir: {
			input: "src",
			output: "dist",
		}
	}
}