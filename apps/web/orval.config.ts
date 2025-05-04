import { defineConfig } from "orval";

export default defineConfig({
  "api-file": {
    input: "http://localhost:3000/docs/json",
    output: {
      mode: "tags-split",

      target: "./src/api",
      schemas: "./src/api/models",
      client: "react-query",
      mock: false,
      override: {
        query: {
          useSuspenseQuery: true,
          shouldSplitQueryKey: true,
        },
        mutator: {
          path: "./src/api/http-instance.ts",
          name: "instance",
        },
      },
    },
  },
});
