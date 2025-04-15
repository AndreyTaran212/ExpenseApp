module.exports = {
  presets: ['module:@react-native/babel-preset'],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
    development: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
