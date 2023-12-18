const fs = require("fs");
const { minify } = require("terser");
const CleanCSS = require("clean-css");

let minifiedYouTubeJavaScript;
let minifiedYouTubeCSS;

async function getYouTubeJavaScript() {
  if (!minifiedYouTubeJavaScript) {
    const liteYouTubeJavaScript = fs
      .readFileSync("./node_modules/lite-youtube-embed/src/lite-yt-embed.js")
      .toString();
    minifiedYouTubeJavaScript = (
      await minify(liteYouTubeJavaScript, { keep_classnames: true })
    ).code;
  }
  return minifiedYouTubeJavaScript;
}

function getYouTubeCSS() {
  if (!minifiedYouTubeCSS) {
    const liteYouTubeCSS = fs
      .readFileSync("./node_modules/lite-youtube-embed/src/lite-yt-embed.css")
      .toString();
    minifiedYouTubeCSS = new CleanCSS({}).minify(liteYouTubeCSS).styles;
  }
  return minifiedYouTubeCSS;
}

function replaceHTMLWithLiteYoutube(content, index, length, videoId) {
  return (
    content.substring(0, index) +
    `<lite-youtube videoid="${videoId}"></lite-youtube>` +
    content.substring(index + length)
  );
}

async function hydrateLiteYoutube(content) {
  content += `\n<style>${getYouTubeCSS()}</style>`;
  content += `\n<script>${await getYouTubeJavaScript()}</script>`;
  return content;
}

async function transformLiteYoutube(content) {
  const IFRAME =
    /<iframe\s+.*?src="\S*?(youtube\.com|youtu\.be)\/(embed\/|watch\?v=)?(?<videoId>[^?<\s]+).*?\s*?<\/iframe>/i;
  const SINGLE_LINE =
    /<p(\s+.*?)?>\s*(http(s)?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(embed\/|watch\?v=)?(?<videoId>[^?<\s]+).*?\s*<\/p>/i;
  const FIGURE =
    /(<figure(\s+.*?)?>|<\/figcaption>)\s*(http(s)?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(embed\/|watch\?v=)?(?<videoId>[^?<\s]+).*?\s*?(<\/figure>|<figcaption(\s+.*?)?>)/i;

  const PATTERN = [IFRAME, SINGLE_LINE, FIGURE];

  let found = false;
  for (const pattern of PATTERN) {
    while ((match = content.match(pattern))) {
      found = true;
      content = replaceHTMLWithLiteYoutube(
        content,
        match.index,
        match[0].length,
        match.groups.videoId
      );
    }
  }

  if (found) {
    content = await hydrateLiteYoutube(content);
  }

  return content;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addTransform("lite-video", async function (content) {
    return await transformLiteYoutube(content);
  });
};
