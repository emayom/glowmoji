module.exports = {
  ci: {
    collect: {
      url: ["https://emayom.github.io/glowmoji/"],
      numberOfRuns: 5,
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.9 }],
        // "categories:accessibility": ["error", { minScore: 1 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
    server: {},
    wizard: {},
  },
};
