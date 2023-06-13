import { ScriptTarget, SyntaxKind, createSourceFile } from "typescript";

export function findEndOfImportsBlock(content: string): number {
  const sourceFile = createSourceFile(
    "index.ts",
    content,
    ScriptTarget.ES2017,
    true
  );
  const children = sourceFile.getChildAt(0).getChildren();
  return children
    .filter((n) => n.kind === SyntaxKind.ImportDeclaration)
    .map((n) => n.end)
    .reduce((a, b) => Math.max(a, b), 0);
}
