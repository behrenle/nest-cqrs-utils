import { Path, join } from "@angular-devkit/core";
import { classify } from "@angular-devkit/core/src/utils/strings";
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from "@angular-devkit/schematics";
import { Node, SyntaxKind } from "typescript";
import { findEndOfLastArrayItem } from "../../utils/find-end-of-last-array-item";

// @ts-ignore
function showTree(node: Node, indent: string = "    ") {
  let str = indent + SyntaxKind[node.kind] + "\n";

  if (node.getChildCount() === 0) {
    str += indent + "    Text: " + node.getText() + "\n";
  }

  for (let child of node.getChildren()) {
    str += showTree(child, indent + "    ");
  }

  return str;
}

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
    const indexFileContent = tree.readText(
      join(modulePath as Path, "commands/index.ts")
    );

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
      }
    );
    tree.overwrite(join(modulePath as Path, "commands/index.ts"), newContent);
    return tree;
  };
}
