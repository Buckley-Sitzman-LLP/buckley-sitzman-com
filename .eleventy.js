const htmlmin = require("html-minifier");
const {DateTime} = require("luxon");
const util = require("util")
const MarkdownIt = require("markdown-it");

const markdown = new MarkdownIt();

module.exports = function(eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);

  // Recompile pages on changes to Assets
  eleventyConfig.addWatchTarget("./src/assets/");

  // Copy files over to _site
  eleventyConfig.addPassthroughCopy("./src/assets/");
  eleventyConfig.addPassthroughCopy("admin/");
  eleventyConfig.addPassthroughCopy("./img");

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
    const files = collectionApi.getFilteredByGlob("src/people/*.md");
    if (!files || files.length === 0) {
      throw new Error("COLLECTION ERROR: No files found matching 'src/people/*.md'. The people collection requires at least one markdown file.");
    }
    if (!files[0].data || !files[0].data.members) {
      throw new Error("COLLECTION ERROR: File 'src/people/*.md' is missing required 'members' array in frontmatter.");
    }
    return files[0].data.members;
  });

  eleventyConfig.addCollection("other_people", function(collectionApi) {
    const files = collectionApi.getFilteredByGlob("src/other_people/*.md");
    if (!files || files.length === 0) {
      throw new Error("COLLECTION ERROR: No files found matching 'src/other_people/*.md'. The other_people collection requires at least one markdown file.");
    }
    if (!files[0].data || !files[0].data.members) {
      throw new Error("COLLECTION ERROR: File 'src/other_people/*.md' is missing required 'members' array in frontmatter.");
    }
    return files[0].data.members;
  });

  // Get all services
  eleventyConfig.addCollection("services", function(collectionApi) {
    const files = collectionApi.getFilteredByGlob("src/services/*.md");
    if (!files || files.length === 0) {
      throw new Error("COLLECTION ERROR: No files found matching 'src/services/*.md'. The services collection requires at least one markdown file.");
    }
    if (!files[0].data || !files[0].data.items) {
      throw new Error("COLLECTION ERROR: File 'src/services/*.md' is missing required 'items' array in frontmatter.");
    }
    return files[0].data.items;
  });

  // Get all job postings
  eleventyConfig.addCollection("job_postings", function(collectionApi) {
    const files = collectionApi.getFilteredByGlob("src/job_postings/*.md");
    if (!files || files.length === 0) {
      throw new Error("COLLECTION ERROR: No files found matching 'src/job_postings/*.md'. The job_postings collection requires at least one markdown file.");
    }
    if (!files[0].data || !files[0].data.items) {
      throw new Error("COLLECTION ERROR: File 'src/job_postings/*.md' is missing required 'items' array in frontmatter.");
    }
    return files[0].data.items;
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

  return {
    templateFormats: ["md", "njk", "html"],
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: "src",
    }
  };
};
