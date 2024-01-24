export default {
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
    },
  },
  resolve: {
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
    },
  },
};
