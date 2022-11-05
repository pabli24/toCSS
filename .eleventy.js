module.exports = function(eleventyConfig) {

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