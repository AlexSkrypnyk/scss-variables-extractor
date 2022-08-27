if (typeof(require) !== 'undefined') {
  extract = require('../index.js').extract;
}

QUnit.module('SCSS variables extractor');

QUnit.test.each('Variables', [
  ["$var1: val1;", {'var1': 'val1'}],
  ["$var1: val1;\n", {'var1': 'val1'}],
  ["$var1:   val1;\n", {'var1': 'val1'}],
  ["$var1:   val1  ;\n", {'var1': 'val1'}],

  ["$var1: 'val1';\n", {'var1': "'val1'"}],
  ["$var1: ' val1 ';\n", {'var1': "' val1 '"}],
  ["$var1: \"val1\";\n", {'var1': '"val1"'}],
  ["$var1: \" val1 \";\n", {'var1': '" val1 "'}],

  ["$var1: 'val1, val2';\n", {'var1': "'val1, val2'"}],
  ["$var1: val1, val2;\n", {'var1': 'val1, val2'}],
  ["$var1: '\"val1\"';\n", {'var1': '\'"val1"\''}],
  ["$var1: \"val1\", val2;\n", {'var1': '"val1", val2'}],
  ["$var1: '\"val1\", val2';\n", {'var1': '\'"val1", val2\''}],

  ["$var1: \" val1 \";\n", {'var1': '" val1 "'}],

  ["$var1: val1 !default;\n", {'var1': 'val1'}],
  ["$var1: val1!default;\n", {'var1': 'val1'}],
  ["$var1: val1!important;\n", {'var1': 'val1'}],

  ["$var-long-1: val1;\n", {'var-long-1': 'val1'}],
  ["$varLong-1: val1;\n", {'varLong-1': 'val1'}],

  ["$var1: $var2;", {'var1': '$var2'}],

  // Mixin.
  ["$var1: mixin(123);", {'var1': 'mixin(123)'}],
  ["$var1: mixin($var2);", {'var1': 'mixin($var2)'}],

  // Function.
  ["$var1: map.get($val2, 'mapval1');", {'var1': "map.get($val2, 'mapval1')"}],

  // List.
  ["$var1: ();", {'var1': {}}],
  ["$var1: (v1);", {'var1': ['v1']}],
  ["$var1: (v1, v2);", {'var1': ['v1', 'v2']}],
  ["$var1: ('v1', 'v2');", {'var1': ["'v1'", "'v2'"]}],
  ["$var1: (\"v1\", \"v2\");", {'var1': ['"v1"', '"v2"']}],
  ["$var1: (\"v1\", v2);", {'var1': ['"v1"', 'v2']}],

  // Map.
  ["$var1: ('k1': v1, 'k2': v2);", {'var1': {k1: 'v1', k2: 'v2'}}],
  ["$var1: ('k1': 'v1', 'k2': 'v2');", {'var1': {k1: "'v1'", k2: "'v2'"}}],
  ["$var1: ('k1': v1, 'k2': 'v2');", {'var1': {k1: 'v1', k2: "'v2'"}}],

  // Map of lists.
  ["$var1: ('k1': (v11, v12), 'k2': v2);", {'var1': {k1: ['v11', 'v12'], k2: 'v2'}}],
  ["$var1: ('k1': ('v11', 'v12'), 'k2': 'v2');", {'var1': {k1: ["'v11'", "'v12'"], k2: "'v2'"}}],
  ["$var1: ('k1': ('k11': (v111, 'v112'), 'k12': 'v12'), 'k2': 'v2');", {'var1': {k1: {k11: ['v111', "'v112'"], k12: "'v12'"}, k2: "'v2'"}}],

  ["$var1: (\"k1\": (\"k11\": (v111, \"v112\"), \"k12\": \"v12\"), \"k2\": \"v2\");", {'var1': {k1: {k11: ['v111', '"v112"'], k12: '"v12"'}, k2: '"v2"'}}],
  ["$var1: (\"k1\": ('k11': (v111, 'v112'), \"k12\": \"v12\"), \"k2\": \"v2\");", {'var1': {k1: {k11: ['v111', "'v112'"], k12: '"v12"'}, k2: '"v2"'}}],

  // List of maps.
  ["$var1: (('k1': v1), ('k2': v2));", {'var1': [{k1: 'v1'}, {k2: 'v2'}]}],
  ["$var1: (('k1': 'v1'), ('k2': v2));", {'var1': [{k1: "'v1'"}, {k2: 'v2'}]}],
  ["$var1: ((\"k1\": '\"v1\"'), ('k2': v2));", {'var1': [{k1: '\'"v1"\''}, {k2: 'v2'}]}],

  [
    `
    // Comment 1
    // Comment 2

    @use 'sass:map';
    @use 'sass:math';
    @use 'sass:color';
    @import 'mixins';

    $var1: 'val1';
    `,
    {'var1': "'val1'"}
  ],

  [
    `
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
    `,
    {
      'theme-colors-brands-default': {
        'light': {
          'brand1': '#123456',
          'brand2': '#234567',
          'brand3': '#345678',
        },
        'dark': {
          'brand1': '#987654',
          'brand2': '#876543',
          'brand3': '#765432',
        }
      }
    }
  ],

  [
    `
    $theme-fonts-default: (
      'primary': (
        'family': '"Lexend", sans-serif',
      )
    );
    `,
    {
      "theme-fonts-default": {
        "primary": {
          "family": "'\"Lexend\", sans-serif'"
        }
      }
    }
  ],

  [
    `
    $theme-colors-brands: () !default;
    $theme-colors-brands-default: (
      'light': (
        'brand1': #345678,
        'brand2': #E6E9EB,
        'brand3': #121313,
      ),
      'dark': (
        'brand1': #123456,
        'brand2': #234567,
        'brand3': #345678,
      )
    );

    // Default theme colors palette.
    // Use $theme-colors to override and extend color palette values.
    $theme-colors: () !default;
    $theme-colors-default: (
      'light': (
        'background': theme-color-brand-light('brand2'),
        'background-light': theme-color-tint(90, theme-color-brand-light('brand2')),
        'background-dark': theme-color-shade(20, theme-color-brand-light('brand2')),
        'border': theme-color-shade(60, theme-color-brand-light('brand2')),
        'warning': #c95100,
      ),
      'dark': (
        'background': theme-color('brand2'),
        'background-light': theme-color-tint(5, theme-color-brand-dark('brand2')),
        'background-dark': theme-color-shade(30, theme-color-brand-dark('brand2')),
        'border': theme-color-tint(10, theme-color-brand-dark('brand2')),
        'warning': #E38444,
      )
    );

    $theme-theme-light-background-color: white;
    $theme-theme-dark-background-color: black;
    `,
    {
      "theme-colors": {},
      "theme-colors-brands": {},
      "theme-colors-brands-default": {
        "dark": {
          "brand1": "#123456",
          "brand2": "#234567",
          "brand3": "#345678"
        },
        "light": {
          "brand1": "#345678",
          "brand2": "#E6E9EB",
          "brand3": "#121313"
        }
      },
      "theme-colors-default": {
        "dark": {
          "background": "theme-color('brand2')",
          "background-dark": "theme-color-shade(30, theme-color-brand-dark('brand2'))",
          "background-light": "theme-color-tint(5, theme-color-brand-dark('brand2'))",
          "border": "theme-color-tint(10, theme-color-brand-dark('brand2'))",
          "warning": "#E38444"
        },
        "light": {
          "background": "theme-color-brand-light('brand2')",
          "background-dark": "theme-color-shade(20, theme-color-brand-light('brand2'))",
          "background-light": "theme-color-tint(90, theme-color-brand-light('brand2'))",
          "border": "theme-color-shade(60, theme-color-brand-light('brand2'))",
          "warning": "#c95100"
        }
      },
      "theme-theme-dark-background-color": "black",
      "theme-theme-light-background-color": "white"
    }
  ],

  [
    `
    $theme-fonts-default: (
      'primary': (
        'types': (
          (
            'uri': 'https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap',
          ),
        ),
      )
    );
    `,
    {
      "theme-fonts-default": {
        "primary": {
          "types": [
            {
              'uri': "'https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap'",
            }
          ]
        }
      }
    }
  ],
], (assert, [content, expected]) => {
  // const actual = extractor.getVariables('../fixtures/fixture0.scss');
  const actual = extract(content);
  assert.deepEqual(actual, expected, content);
});
