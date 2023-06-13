import { join, normalize } from "@angular-devkit/core";
import { Source, apply, filter, move, url } from "@angular-devkit/schematics";

export function generateIndexFile(
  generateIndexFile: boolean,
  modulePath: string
): Source {
  return apply(url("./files/ts"), [
    filter((path) => path.endsWith("index.ts") && generateIndexFile),
    move(join(normalize(modulePath), "commands")),
  ]);
}
