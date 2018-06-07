# Heat Map Markov Chain Generator

[heatmap]: http://thefanzine.com/the-heat-map-exciting-new-music-from-an-alien-earth/

This generates album reviews in the style of Thomson Guster's [Heat Map][heatmap].

Keep in mind that these generated version don't have quite the same charm (or proper grammar), but
you can really churn the shit out!

## Installation

Make sure you have [Yarn](https://yarnpkg.com/en/docs/install#mac-stable) installed first.

Next, install the dependencies:

```bash
yarn install
```

## Usage

Generate one review:

```bash
yarn generate
```

Generate a bunch of reviews.

```bash
yarn generate --articles 10
```

If you modify the `src` scripts, make sure you `yarn build` before trying to generate new stuff!
