/**
 *
 * @param content
 * @returns {{}}
 */

/* eslint-disable no-use-before-define */

function extract(content) {
  let values = {};

  content = removeComments(content);

  content.split(/;(?=(?:[^"']*['"][^"']*['"])*[^"']*$)/gi).forEach((value) => {
    values = { ...values, ...parseVariableNameValuePair(value) };
  });

  return values;
}

function parseVariableNameValuePair(string) {
  const pair = {};

  const match = /(\$[a-z-_][a-z-_0-9]+:)/gim.exec(string);
  if (match) {
    const name = match[0].replace(/[$:]/gi, '');
    string = string.trim()
      // Remove variable name.
      .replace(/\$[a-zA-Z-0-9]+:/gi, '')
      // Remove new lines and double spaces.
      .replace(/[\n\r]/gi, '')
      .replace(/[\s]{2,}/gi, ' ')
      .replace('!default', '')
      .replace('!important', '')
      .trim();
    pair[name] = parseValue(string);
  }

  return pair;
}

function parseKeyValuePair(string) {
  const pair = {};

  const parts = string.split(/:(.*)/s);

  let key = parts[0];
  let value = parts[1];

  key = key.replace(/[^a-zA-Z-_0-9]/gi, '').trim();
  value = value.replace(/[\n\r]/gi, '')
    .replace(/[\s]{2,}/gi, ' ')
    .trim();

  pair[key] = parseValue(value);

  return pair;
}

function parseValue(string) {
  return isScalarValue(string) ? string.trim() : parseValueMap(string);
}

function parseValueMap(string) {
  let ret = {};

  string = string.trim();
  // "Unwrap" value map.
  if (string.substring(0, 1) === '(' && (string.substring(string.length - 1) === ')' || string.substring(string.length - 2) === ');')) {
    string = string.substring(1);
    string = string.substring(string.length - 1) === ')' ? string.substring(0, string.length - 1) : string.substring(0, string.length - 2);
  }

  validateValueMap(string);

  const values = splitMultipleValues(string);

  for (let i = 0; i < values.length; i++) {
    if (isKeyValuePairValue(values[i])) {
      ret = { ...ret || {}, ...parseKeyValuePair(values[i]) };
    } else {
      ret = Array.isArray(ret) ? (ret || []) : [];
      ret.push(parseValue(values[i]));
    }
  }

  return ret;
}

function validateValueMap(string) {
  let braces = 0;
  let quotes = 0;

  // Validate structures.
  for (let i = 0; i < string.length; i++) {
    if (string[i] === '(') {
      braces++;
    } else if (string[i] === ')') {
      braces--;
    } else if (string[i] === "'") {
      quotes++;
    }
  }

  if (braces !== 0) {
    throw new Error('Missing paired parenthesis.');
  }

  if (quotes % 2 !== 0) {
    throw new Error('Missing closing quotes.');
  }
}

function splitMultipleValues(string) {
  let values = [];

  let braces = 0;
  let quotesSingle = 0;
  let quotesDouble = 0;

  let lastIdx = 0;

  for (let i = 0; i < string.length; i++) {
    if (string[i] === '(') {
      braces++;
    } else if (string[i] === ')') {
      braces--;
    } else if (string[i] === "'") {
      if (quotesSingle % 2 === 0) {
        quotesSingle++;
      } else {
        quotesSingle--;
      }
    } else if (string[i] === '"') {
      if (quotesDouble % 2 === 0) {
        quotesDouble++;
      } else {
        quotesDouble--;
      }
    } else if (string[i] === ',') {
      if (braces === 0 && quotesSingle === 0 && quotesDouble === 0 && i > 0) {
        values.push(string.substring(lastIdx, i));
        lastIdx = i + 1;
      }
    }
  }

  values.push(string.substring(lastIdx));

  values = values.filter((element) => element.trim() !== '');

  return values;
}

function isScalarValue(string) {
  return string.trim().indexOf('(') !== 0;
}

function isKeyValuePairValue(string) {
  if (!string.includes(':')) {
    return false;
  }

  const parts = string.split(':');

  return !parts[0].includes('(');
}

function removeComments(string) {
  let lines = string.split(/\r?\n/);
  lines = lines.filter((line) => !/^\s*\/\/[^\n]*/.test(line));
  return lines.join('\n');
}

if (typeof module !== 'undefined' && module.exports) {
  exports.extract = extract;
}
