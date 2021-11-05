import { watch, src as gulpSrc, dest as gulpDest } from "gulp";
import transform from "gulp-transform";
import rename from "gulp-rename";
import gulpif from "gulp-if";
import fs from "fs-extra";

export interface IDevConfig {
  transform: (path: string, content: string) => string
  // by default, use src segment 0 as baseDir
  baseDir?: string
  rename?: {
    extension?: string
  }
}

export function dev(src: string, dest: string, config: IDevConfig) {
  const baseDir = config?.baseDir || src.split("/")[0];
  const watcher = watch([src], { ignoreInitial: false });
  const onTransform = (inputPath: string) => transfromFile(inputPath, baseDir, dest, config);
  watcher.on("change", onTransform);
  watcher.on("add", onTransform);
}

export function build(src: string, dest: string, config: IDevConfig) {
  const baseDir = config?.baseDir || src.split("/")[0];
  transfromFile(src, baseDir, dest, config);
}

export function clean(dir: string) {
  fs.removeSync(dir);
}

function transfromFile(src: string, baseDir: string, dest: string, config: IDevConfig) {
  // add baseDir to keep directory structure
  gulpSrc(src, { base: baseDir })
    .pipe(gulpif(Boolean(config.transform), transform("utf8", (code, file) => config.transform(file.path, code))))
    .pipe(gulpif(Boolean(config?.rename), rename({ extname: config?.rename?.extension })))
    .pipe(gulpDest(dest));
}