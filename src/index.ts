import { watch, src, dest } from "gulp";
import transform from "gulp-transform";
import rename from "gulp-rename";
import path from "path";
import gulpif from "gulp-if";

export interface IDevConfig {
  transform: (path: string, content: string) => string
  rename?: {
    extension?: string
  }
}

export function dev(srcGlob: string, dest: string, config: IDevConfig) {
  const [baseDir] = srcGlob.split(path.sep);
  const watcher = watch([dest], { ignoreInitial: false });
  const onTransform = (inputPath: string) => transfromFile(inputPath, baseDir, dest, config);
  watcher.on("change", onTransform);
  watcher.on("add", onTransform);
}

function transfromFile(inputPath: string, baseDir: string, outDir: string, config: IDevConfig) {
  const filePath = path.resolve(inputPath);

  // add baseDir to keep directory structure
  src(filePath, { base: baseDir })
    .pipe(gulpif(Boolean(config.transform), transform("utf8", code => config.transform(filePath, code))))
    .pipe(gulpif(Boolean(config.rename), rename({ extname: config.rename.extension })))
    .pipe(dest(outDir));
}

// dev("draft/**/*.{ts,tsx}", "draft", "src/copy");
