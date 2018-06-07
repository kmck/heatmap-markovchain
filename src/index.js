import { titleCase, upperCaseFirst } from 'change-case';
import MarkovChain from 'markovchain';

const ARTIST_MIN_WORDS = 1;
const ARTIST_MAX_WORDS = 3;
const TITLE_MIN_WORDS = 2;
const TITLE_MAX_WORDS = 10;
const RELEASE_MAX_WORDS = 2;
const REVIEW_MIN_SENTENCES = 5;
const REVIEW_MAX_SENTENCES = 25;
const SENTENCE_MIN_WORDS = 3;
const SENTENCE_MAX_WORDS = 15;
const LABEL_MIN_WORDS = 1;
const LABEL_MAX_WORDS = 5;

const BORING_WORDS = [
  'a',
  'an',
  'the',
  'this',
  'that',
  'it',
  'he',
  'him',
  'his',
  'she',
  'her',
  'hers',
  'it',
  'its',
  'they',
  'them',
  'their',
  'theirs',
  'in',
  'on',
  'of',
  'for',
  'and',
  'or',
];

const PUNCTUATION = '............………—!!!!????'.split('');

function randomWithinRange(min, max) {
  return min + Math.round(Math.random() * (max - min));
}

function randomWord(wordList) {
  const words = Object.keys(wordList);
  const word = words[Math.floor(Math.random() * words.length)];
  return word;
}

function randomPunctuation() {
  return PUNCTUATION[Math.floor(Math.random() * PUNCTUATION.length)];
}

function removeBoringEnding(phrase) {
  const words = phrase.split(' ');
  if (words.length < 1 || BORING_WORDS.indexOf(words[words.length - 1].toLowerCase()) < 0) {
    return phrase;
  }
  return words.slice(0, -1).join(' ');
}

export default function createArticleGenerator(articles) {
  // Get all the words
  let everything = articles
    .map(article => (
      Object.keys(article)
        .filter(key => (['release'].indexOf(key) < 0))
        .map(key => article[key].replace(/[^\w\s%\-'’.…—!?/]/g, ''))
        .join(' ')
    ))
    .join(' ').toLowerCase();

  // Add the whole thing backwards for some spice
  everything += ` ${
    everything
      .split(' ')
      .slice(1)
      .filter(word => (BORING_WORDS.indexOf(word) >= 0))
      .reverse()
      .join(' ')
  }`;

  // const artists = articles.map(article => article.artist || '').join('\n').toLowerCase();
  // const titles = articles.map(article => article.title || '').join('\n').toLowerCase();
  const releases = articles.map(article => article.release || '').join('\n');
  // const reviews = articles.map(article => article.review || '').join('\n').toLowerCase();
  // const labels = articles.map(article => article.label || '').join('\n').toLowerCase();

  // Normalize each word (for filtering out characters)
  const normFn = word => word;
  // Parse individual words from a string of characters
  const parseBy = /(?:[.…—!?\n])/ig;

  // const artistsChain = new MarkovChain('', normFn).parse(artists, parseBy);
  // const titlesChain = new MarkovChain('', normFn).parse(titles, parseBy);
  const releasesChain = new MarkovChain('', normFn).parse(releases, parseBy);
  // const reviewsChain = new MarkovChain('', normFn).parse(reviews, parseBy);
  // const labelsChain = new MarkovChain('', normFn).parse(labels, parseBy);

  // Using all the words to get a little more variety
  const everythingChain = new MarkovChain('', normFn).parse(everything, parseBy);
  const artistsChain = everythingChain;
  const titlesChain = everythingChain;
  // const releasesChain = everythingChain;
  const reviewsChain = everythingChain;
  const labelsChain = everythingChain;

  return function generateArticle() {
    // Start: Random word to start the phrase
    // End: Random max length for the phrase (if it doesn't run out of words first)
    const artistStart = randomWord;
    const artistEnd = randomWithinRange(ARTIST_MIN_WORDS, ARTIST_MAX_WORDS);
    const titleStart = randomWord;
    const titleEnd = randomWithinRange(TITLE_MIN_WORDS, TITLE_MAX_WORDS);
    const releaseStart = randomWord;
    const releaseEnd = RELEASE_MAX_WORDS;
    const sentenceStart = randomWord;
    const sentenceEnd = randomWithinRange(SENTENCE_MIN_WORDS, SENTENCE_MAX_WORDS);
    const labelStart = randomWord;
    const labelEnd = randomWithinRange(LABEL_MIN_WORDS, LABEL_MAX_WORDS);

    // Generate the values for all the fields
    const artist = artistsChain.start(artistStart).end(artistEnd).process();
    const title = titlesChain.start(titleStart).end(titleEnd).process();
    const release = releasesChain.start(releaseStart).end(releaseEnd).process();
    const review = (new Array(randomWithinRange(REVIEW_MIN_SENTENCES, REVIEW_MAX_SENTENCES)))
      .fill()
      .map(() => {
        const sentence = reviewsChain.start(sentenceStart).end(sentenceEnd).process();
        return `${upperCaseFirst(removeBoringEnding(sentence))}${randomPunctuation()}`;
      })
      .join(' ');
    const label = labelsChain.start(labelStart).end(labelEnd).process();

    // Do some formatting on the way out
    return {
      artist: titleCase(removeBoringEnding(artist)),
      title: titleCase(removeBoringEnding(title)),
      release,
      review,
      label: titleCase(removeBoringEnding(label)),
    };
  };
}
