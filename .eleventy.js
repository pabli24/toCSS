const fs = require("fs");
const path = require("path");

module.exports = function(eleventyConfig) {

	eleventyConfig.setServerOptions({
		// https://www.11ty.dev/docs/dev-server/#options
		// https://github.com/FiloSottile/mkcert
		https: {
			key: "./localhost-key.pem",
			cert: "./localhost.pem",
		},
	});

	eleventyConfig.addGlobalData("stylusVersion", () => {
		const packagePath = path.join(__dirname, "node_modules/stylus-lang-bundle/package.json");
		try {
			if (fs.existsSync(packagePath)) {
				const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
				return packageJson.version;
			}
		} catch (error) {
			console.error("Error reading stylus version:", error);
		}
		return "0.64.0";
	});

	eleventyConfig.addPassthroughCopy('./src/img');
	eleventyConfig.addPassthroughCopy('./src/manifest.json');

	eleventyConfig.addPassthroughCopy({
		"node_modules/lz-string/libs/lz-string.min.js": "/js/lz-string.min.js",

		"node_modules/ace-builds/src-min-noconflict/worker-css.js": "/js/worker-css.js",

		"node_modules/stylus-lang-bundle/dist/stylus-renderer.min.js": "/js/stylus-renderer.min.js",
		"node_modules/stylus-lang-bundle/dist/stylus-renderer.min.js.map": "/js/stylus-renderer.min.js.map",

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
	};
}