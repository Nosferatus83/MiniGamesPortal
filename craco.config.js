module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Заменяем восклицательные знаки в путях
      if (webpackConfig.cache && webpackConfig.cache.cacheDirectory) {
        webpackConfig.cache.cacheDirectory =
          webpackConfig.cache.cacheDirectory.replace(/!/g, "_");
      }

      if (webpackConfig.output && webpackConfig.output.path) {
        webpackConfig.output.path = webpackConfig.output.path.replace(
          /!/g,
          "_"
        );
      }

      if (webpackConfig.module && webpackConfig.module.rules) {
        webpackConfig.module.rules.forEach((rule) => {
          if (rule.oneOf) {
            rule.oneOf.forEach((oneOfRule) => {
              if (oneOfRule.include && typeof oneOfRule.include === "string") {
                oneOfRule.include = oneOfRule.include.replace(/!/g, "_");
              }
            });
          }
        });
      }

      return webpackConfig;
    },
  },
};
