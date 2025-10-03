module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Other plugins can go here
      'react-native-reanimated/plugin', // This must be last!
    ],
  };
};