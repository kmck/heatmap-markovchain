import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import json from 'rollup-plugin-json';

import pkg from './package.json';

const external = id => (
  /heatmap\.json$/.test(id) ||
  ([
    'chalk',
    'change-case',
    'markovchain',
    'minimist',
  ].indexOf(id) >= 0)
);

export default [{
  input: 'src/index.js',
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' },
  ],
  plugins: [
    json(),
    babel(babelrc()),
  ],
  external,
}, {
  input: 'src/cli.js',
  output: [
    { file: pkg.bin['heatmap-markovchain'], format: 'cjs' },
  ],
  plugins: [
    json(),
    babel(babelrc()),
  ],
  external,
}];
