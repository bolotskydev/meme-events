module.exports = {
    "env": {
        "node": true,
	"browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": ["airbnb", "prettier"],
    "globals": {
      "Atomics": "readonly",
      "SharedArrayBuffer": "readonly",
      "window": true,
      "document": true,
      "localStorage": true,
      "FormData": true,
      "FileReader": true,
      "Blob": true,
      "navigator": true,
      "global": true,
      "process": true
    },
    "parser": "babel-eslint",
    "parserOptions": {
      "sourceType": "module",
      "ecmaVersion": 2019
    },
    "plugins": ["prettier", "promise"],
    "rules": {
    "no-underscore-dangle": 0,
    "import/imports-first": ["error", "absolute-first"],
    "import/newline-after-import": "error",
    "semi": ["error", "never"],
    "no-console": "warn",
    "promise/always-return": "error",
    "promise/no-return-wrap": "error",
    "promise/param-names": "error",
    "promise/catch-or-return": "error",
    "promise/no-native": "off",
    "promise/no-nesting": "error",
    "promise/no-promise-in-callback": "error",
    "promise/no-callback-in-promise": "error",
    "promise/no-return-in-finally": "error",
    "prefer-arrow-callback": "error"
    }
};

