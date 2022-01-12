const htmlmin = require("html-minifier");
const {DateTime} = require("luxon");
const util = require("util")
const Image = require("@11ty/eleventy-img");
const MarkdownIt = require("markdown-it");

const markdown = new MarkdownIt();

// Preprocess Images on demand - https://www.11ty.dev/docs/plugins/image/#use-this-in-your-templates
async function imageShortcode(src, alt, klass="", sizes="(min-width: 1024px) 100vw, 50vw") {
  const newSrc = `.${src}`

  let metadata = await Image(newSrc, {
    widths: [300, 600, 900, null],
    urlPath: "/img/",
    outputDir: "./_site/img",
    formats: ["webp", "jpeg", "svg", "png"],
  });

  let imageAttributes = {
    class: klass,
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function(eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);

  // Recompile pages on changes to Assets
  eleventyConfig.addWatchTarget("./src/assets/");

  // Copy files over to _site
  eleventyConfig.addPassthroughCopy("./src/assets/");
  eleventyConfig.addPassthroughCopy("./img");
  eleventyConfig.addPassthroughCopy("./src/admin");
  eleventyConfig.addPassthroughCopy({
    "./node_modules/alpinejs/dist/alpine.js": "./js/alpine.js"
  });

  eleventyConfig.addShortcode("version", function() {
    return String(Date.now());
  });

  // JSON dump of `obj`
  eleventyConfig.addFilter("dump", obj => {
    return util.inspect(obj)
  });

  // Render Markdown
  eleventyConfig.addFilter("markdown", string => {
    return markdown.render(string);
  });

  // Human Readable published date
  eleventyConfig.addFilter("readableDate", (dateStr) => {
    return DateTime.fromJSDate(dateStr).toFormat("LLLL d, yyyy");
  });

  // Given a list, take the first n items of that list. Useful when showing the
  // first `count` items in a collection of posts.
  //
  // Example:
  // {{collections.articles | take(3)}}
  eleventyConfig.addFilter("take", (collection, count) => {
    return collection.slice(0, count);
  });

  // Sort a collection by an arbitrary attribute.
  //
  // Example:
  // {{collections.articles } | sort("title") }} to sort alphabetically by title
  eleventyConfig.addFilter("sortBy", (values, field) => {
    // Return a new list, instead of sorting the original list in place
    return [...values].sort((left, right) => Math.sign(left.data[field] - right.data[field]));
  });

  /*********************** COLLECTIONS ***********************************/
  // Get all people
  eleventyConfig.addCollection("people", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/people/*.md")[0].data.members;
  });

  // Get all services
  eleventyConfig.addCollection("services", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/services/*.md")[0].data.items;
  });

  // Get all job postings
  eleventyConfig.addCollection("job_postings", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/job_postings/*.md")[0].data.items;
  });

  // Minify HTML by removing whitespace, etc.
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (
      process.env.ELEVENTY_PRODUCTION &&
      outputPath &&
      outputPath.endsWith(".html")
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }
    return content;
  });

  // Generate responsive images, pre-processed and sized perfectly.
  //
  // Usage:
  // {% image "/path/to/img", "alt-text", "classes to apply", "sizes" %}
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  return {
    templateFormats: ["md", "njk", "html"],
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: "src",
    }
  };
};
