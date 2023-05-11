const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function(eleventyConfig) {

	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

	eleventyConfig.addPassthroughCopy('./src/style.css');
	eleventyConfig.addPassthroughCopy('./src/img');
	eleventyConfig.addPassthroughCopy('./src/js');

	return {
		dir: {
			input: "src",
			output: "dist",
		}
	}
}