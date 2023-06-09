import { JsonObject, isJsonObject } from "@angular-devkit/core";
import { Tree } from "@angular-devkit/schematics";

const defaultSourceRoot = "src";

export function getSourceRoot(tree: Tree): string {
  if (!tree.exists("nest-cli.json")) {
    return defaultSourceRoot;
  }

  const nestCliJson = tree.readJson("nest-cli.json");

  if (!isJsonObject(nestCliJson)) {
    return defaultSourceRoot;
  }

  return (nestCliJson as JsonObject).sourceRoot as string;
}
