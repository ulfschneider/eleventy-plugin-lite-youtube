# Eleventy plugin for easy embedding of YouTube videos with a minimal size

The plugin leverages [Paul Irish´s lite-youtube web component](https://github.com/paulirish/lite-youtube-embed).

The typical YouTube embed has a weight above 1 MB, while Paul Irish´s `<lite-youtube>` comes with a total weight of 32 KB (which is about 2-3 % of the original size). This way pages load _much faster_ and consume _much less_ bandwidth. And, as a bonus, it´s easier to embed a YouTube video – dropping the URL in a dedicated textline is enough.

Please also refer to [ONE YOUTUBE EMBED WEIGHS ALMOST 1.2 MB](https://www.zachleat.com/web/youtube-embeds/).

## Install

```sh
npm install --save-dev eleventy-plugin-lite-youtube
```

In your `eleventy.js` file:

```js
const liteYoutube = require("eleventy-plugin-lite-youtube");
//...
eleventyConfig.addPlugin(liteYoutube);
```

## Usage

The plugin will replace the following occurrences in your content with the `<lite-youtube>` web component:

- A YouTube url within a single line of your markdown
- A YouTube url enclosed by `<p></p>`
- A YouTube url enclosed by `<figure></figure>` (`<figcaption>` is fine)
- A YouTube embedding `<iframe>`
