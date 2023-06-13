import {
  Rule,
  SchematicContext,
  Tree,
  branchAndMerge,
  chain,
  mergeWith,
} from "@angular-devkit/schematics";
import { CommandOptions } from "./command.schema";
import { Path, join, normalize } from "@angular-devkit/core";
import { getSourceRoot } from "../utils/get-source-root";
import { generateFiles } from "./steps/generate-files";
import { generateIndexFile } from "./steps/generate-index-file";

export function main(options: CommandOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const sourceRoot = getSourceRoot(tree);
    const indexFileLocation = normalize(
      join(sourceRoot as Path, options.module, "commands/index.ts")
    );
    const modulePath = join(sourceRoot as Path, options.module);

    return branchAndMerge(
      chain([
        mergeWith(
          generateFiles({
            ...options,
            module: modulePath,
          })
        ),
        mergeWith(generateIndexFile(!tree.get(indexFileLocation), modulePath)),
      ])
    )(tree, context);
  };
}
