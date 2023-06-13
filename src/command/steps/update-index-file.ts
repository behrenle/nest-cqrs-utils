import { Path, join } from "@angular-devkit/core";
import { classify, dasherize } from "@angular-devkit/core/src/utils/strings";
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from "@angular-devkit/schematics";
import { findEndOfLastArrayItem } from "../../utils/find-end-of-last-array-item";
import { findEndOfImportsBlock } from "../../utils/find-end-of-imports-block";

function insertMultiple(
  str: string,
  ...insertions: { at: number; content: string }[]
): string {
  const result: string[] = [];
  const sortedInsertions = insertions.sort((a, b) => a.at - b.at);
  let offset = 0;
  let rest = str;

  sortedInsertions.forEach(({ at, content }) => {
    const before = rest.substring(0, at - offset);
    const after = rest.substring(at - offset);
    result.push(before);
    result.push(content);
    rest = after;
    offset += at;
  });
  result.push(rest);

  return result.join("");
}

export function updateIndexFile(modulePath: string, name: string): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const filePath = join(modulePath as Path, "commands/index.ts");
    const indexFileContent = tree.readText(filePath);

    const commandHandlerInsertionPos = findEndOfLastArrayItem(
      "commandHandlers",
      indexFileContent
    );
    const commandControllerInsertionPos = findEndOfLastArrayItem(
      "commandControllers",
      indexFileContent
    );
    if (!commandHandlerInsertionPos) {
      throw new SchematicsException("cannot find commandHandlers array");
    }
    if (!commandControllerInsertionPos) {
      throw new SchematicsException("cannot find commandControllers array");
    }

    const endOfImports = findEndOfImportsBlock(indexFileContent);
    const controllerName = classify(name) + "Controller";
    const handlerName = classify(name) + "Handler";

    const newContent = insertMultiple(
      indexFileContent,
      {
        at: commandControllerInsertionPos.end,
        content: controllerName,
      },
      {
        at: commandHandlerInsertionPos.end,
        content: handlerName,
      },
      {
        at: endOfImports,
        content: `\nimport { ${controllerName} } from './${dasherize(
          name
        )}/${dasherize(
          name
        )}.controller';\nimport { ${handlerName} } from './${dasherize(
          name
        )}/${dasherize(name)}.handler';${endOfImports === 0 ? "\n\n" : ""}`,
      }
    );
    tree.overwrite(filePath, newContent);
    return tree;
  };
}
