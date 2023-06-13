import { Node, SyntaxKind } from "typescript";

export function showTree(node: Node, indent: string = "    ") {
  let str = indent + SyntaxKind[node.kind] + "\n";

  if (node.getChildCount() === 0) {
    str += indent + "    Text: " + node.getText() + "\n";
  }

  for (let child of node.getChildren()) {
    str += showTree(child, indent + "    ");
  }

  return str;
}
