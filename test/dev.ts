import { dev } from "../src";

// example
dev("temp/draft/**/*.{ts,tsx}", "temp/dest", {
    rename: {
        extension: ".js"
    },
    baseDir: "temp/draft",
    transform(path, code) {
        console.log(path, code);
        return code;
    }
});