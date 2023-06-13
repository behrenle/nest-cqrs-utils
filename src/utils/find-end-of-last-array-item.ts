import { ScriptTarget, SyntaxKind, createSourceFile } from "typescript";

export function findEndOfLastArrayItem(
  arrayName: string,
  content: string
): { end: number; endsWithCommaToken: boolean } | undefined {
  const sourceFile = createSourceFile(
    "index.ts",
    content,
    ScriptTarget.ES2017,
    true
  );
  const children = sourceFile.getChildAt(0).getChildren();
  const filteredChildren = children
    .map((child) => {
      if (child.kind !== SyntaxKind.FirstStatement) {
        return false;
      }
      if (
        child.getChildAt(0).kind !== SyntaxKind.SyntaxList ||
        child.getChildAt(0).getChildAt(0).kind !== SyntaxKind.ExportKeyword
      ) {
        return false;
      }
      const declarationList = child.getChildAt(1);
      if (declarationList.kind !== SyntaxKind.VariableDeclarationList) {
        return false;
      }
      if (declarationList.getChildAt(0).kind !== SyntaxKind.ConstKeyword) {
        return false;
      }
      const declarations = declarationList.getChildAt(1);
      if (
        declarations.getChildCount() !== 1 ||
        declarations.kind !== SyntaxKind.SyntaxList
      ) {
        return false;
      }
      const declaration = declarations.getChildAt(0);
      if (declaration.kind !== SyntaxKind.VariableDeclaration) {
        return false;
      }
      const identifier = declaration.getChildAt(0);
      if (
        identifier.kind !== SyntaxKind.Identifier ||
        identifier.getText() !== arrayName ||
        declaration.getChildAt(1).kind !== SyntaxKind.FirstAssignment
      ) {
        return false;
      }
      const arrayExpression = declaration.getChildAt(2);
      if (arrayExpression.kind !== SyntaxKind.ArrayLiteralExpression) {
        return false;
      }
      const lastArrayItem = arrayExpression.getChildAt(
        arrayExpression.getChildCount() - 2
      );
      return {
        end: lastArrayItem.end,
        endsWithCommaToken: lastArrayItem.kind === SyntaxKind.CommaToken,
      };
    })
    .filter((n) => n !== false);
  return filteredChildren[0] as
    | { end: number; endsWithCommaToken: boolean }
    | undefined;
}
