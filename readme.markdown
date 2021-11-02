# Buckley Sitzman Site

[![Netlify Status](https://api.netlify.com/api/v1/badges/73ecf749-2877-4199-8f15-ab6d162ce1db/deploy-status)](https://app.netlify.com/sites/thirsty-bassi-038c1d/deploys)

## Install and Setup

Run `yarn install` to get all dependencies running. You may also need to do
`asdf install` to install dependencies of yarn.

## Running Locally

`yarn build` will build the site

`yarn start` will start the site and its watchers -- from there, you can open it
up in the browser at `localhost:8080`

## Content Management

Visiting `/admin` will send you to the admin dashboard. As a caveat, this pull
content from the current `main` branch on GitHub, rather than locally. You'll
need to authenticate with your GitHub account.

## Debugging

If you're working with a collection or some other JS object and you need to see
what's up with it, you can do something like this, where `someObject` is valid
JSON (an array, object literal, string, etc.), nested arbitrarily deeply.

```njk
<pre>{{ someObject | dump }}</pre>
```

This makes use of the `dump` function defined in `.eleventy.js`

[Source for this trick](https://justbea.dev/notes/nunjucks-dump/)

## Guidelines and Conventions

We make use of:

+ Eleventy for the site itself
+ Nunjucks for templating
+ TailwindCSS for styles
+ AlpineJS for little bits of JS
+ Our wonderful and delicious brains
