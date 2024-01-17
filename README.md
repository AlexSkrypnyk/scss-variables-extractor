<p align="center">
  <a href="" rel="noopener">
  <img width=200px height=200px src="https://placehold.jp/000000/ffffff/200x200.png?text=SCSS+variables+extractor&css=%7B%22border-radius%22%3A%22%20100px%22%7D" alt="Yourproject logo"></a>
</p>

<h1 align="center">SCSS variables extractor</h1>

<div align="center">

[![GitHub Issues](https://img.shields.io/github/issues/AlexSkrypnyk/scss-variables-extractor.svg)](https://github.com/AlexSkrypnyk/scss-variables-extractor/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/AlexSkrypnyk/scss-variables-extractor.svg)](https://github.com/AlexSkrypnyk/scss-variables-extractor/pulls)
[![Test](https://github.com/AlexSkrypnyk/scss-variables-extractor/actions/workflows/test-nodejs.yml/badge.svg)](https://github.com/AlexSkrypnyk/scss-variables-extractor/actions/workflows/test-nodejs.yml)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/AlexSkrypnyk/scss-variables-extractor)
![LICENSE](https://img.shields.io/github/license/AlexSkrypnyk/scss-variables-extractor)
![Renovate](https://img.shields.io/badge/renovate-enabled-green?logo=renovatebot)

</div>

---

<p align="center"> Extract SCSS variables to make them available in scripts using vanilla JS.
    <br>
</p>


## Features

Extract SCSS variables to make them available in scripts using vanilla JS.

## Installation

    npm install @alexskrypnyk/scss-variables-extractor

## Usage

```javascript
const extractor = require('./scss-variables-extractor');

// SCSS content.
const content = `
    $theme-colors-brands-default: (
      'light': (
        'brand1': #123456,
        'brand2': #234567,
        'brand3': #345678,
      ),
      'dark': (
        'brand1': #987654,
        'brand2': #876543,
        'brand3': #765432,
      )
    );
`;

const vars = extractor.extract(content);

console.log(vars);

// Output:
// {
//   'theme-colors-brands-default': {
//     'light': {
//       'brand1': '#123456',
//       'brand2': '#234567',
//       'brand3': '#345678',
//     },
//     'dark': {
//       'brand1': '#987654',
//       'brand2': '#876543',
//       'brand3': '#765432',
//     }
//   }
// }

```

## Maintenance
    npm install
    npm lint
    npm test
