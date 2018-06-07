import minimist from 'minimist';
import chalk from 'chalk';
import {
  titleCase,
  upperCase,
} from 'change-case';

import content from '../heatmap.json';
import createArticleGenerator from './index';

const generateArticle = createArticleGenerator(content.articles);

function formatArticle(article) {
  return [
    chalk.bold([
      upperCase(article.artist),
      '–',
      `“${titleCase(article.title)}”`,
      article.release,
    ].filter(v => v).join(' ')),
    article.review,
    `(${upperCase(article.label)})`,
  ].join(' ');
}

const {
  articles = 1,
} = minimist(process.argv.slice(2));

console.log(`Generating ${chalk.bold(articles)} ${articles == 1 ? 'article' : 'articles'} for THE HEAT MAP...`);
console.log('');

for (let i = 0; i < articles; i += 1) {
  console.log(formatArticle(generateArticle()));
  console.log('');
}
