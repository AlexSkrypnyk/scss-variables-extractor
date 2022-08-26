# SCSS variables extractor

Extract SCSS variables to make them available in scripts using vanilla JS.

![Build](https://github.com/integratedexperts/scss-variables-extractor/actions/workflows/main.yml/badge.svg)


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
