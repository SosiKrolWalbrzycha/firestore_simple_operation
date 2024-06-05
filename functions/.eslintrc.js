
// module.exports = {
//   env: {
//     es6: true,
//     node: true,
//   },
//   parserOptions: {
//     "ecmaVersion": 2018,
//   },
//   extends: [
//     "eslint:recommended",
//     "google",
//   ],
//   rules: {
//     // Wyłączone reguły
//     "no-restricted-globals": "off",
//     "prefer-arrow-callback": "off",
//     // Ustawienie reguły dla cudzysłowów
//     "quotes": "off",
//     // Wyłączenie reguł dotyczących formatowania
//     "max-len": "off", // Ignoruje ograniczenia długości linii
//     "indent": "off", // Nie wymusza konkretnego wcięcia
//     "linebreak-style": "off", // Nie wymusza jednolitego stylu końca linii

// Tutaj możesz dodać więcej reguł, które chcesz zmodyfikować lub wyłączyć
//   },
//   overrides: [
//     {
//       files: ["**/*.spec.*"],
//       env: {
//         mocha: true,
//       },
//       rules: {
//         // Tutaj możesz określić reguły specyficzne dla testów
//       },
//     },
//   ],
//   globals: {
//     // Tutaj możesz zdefiniować globalne zmienne
//   },
// };


module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 2018,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "no-restricted-globals": "off",
    "prefer-arrow-callback": "off",
    "quotes": ["error", "double", {"allowTemplateLiterals": true}],
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
