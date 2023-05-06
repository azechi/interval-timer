import { resolve } from "path";
import { defineConfig } from "vite";
import fs from "node:fs";

export default defineConfig({
  build: {
    rollupOptions: {
      input: [
        resolve(__dirname, "index.html"),
        ...fs
          .readdirSync("./lab")
          .filter((s) => s.endsWith(".html"))
          .map((s) => resolve(__dirname + "/lab/", s)),
      ],
    },
  },
});
