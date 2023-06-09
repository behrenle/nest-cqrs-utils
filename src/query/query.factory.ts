import {
  Rule,
  SchematicContext,
  Source,
  Tree,
  apply,
  branchAndMerge,
  chain,
  mergeWith,
  move,
  url,
  template,
  filter,
} from "@angular-devkit/schematics";
import { QueryOptions } from "./query.schema";

import { Path, join, normalize, strings } from "@angular-devkit/core";
import { dasherize } from "@angular-devkit/core/src/utils/strings";
import { convertHttpMethodToNestDecorator } from "../utils/convert-http-method-to-nest-decorator";
import { getSourceRoot } from "../utils/get-source-root";

export function main(options: QueryOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const sourceRoot = getSourceRoot(tree);
    return branchAndMerge(
      chain([
        mergeWith(
          generateFiles({
            ...options,
            module: join(sourceRoot as Path, options.module),
          })
        ),
      ])
    )(tree, context);
  };
}

function generateFiles(options: QueryOptions): Source {
  const httpMethodDecorator = convertHttpMethodToNestDecorator(options.method);
  const nestCommonImports: string[] = [httpMethodDecorator];
  if (options.requestQueryDto) nestCommonImports.push("Query");
  if (options.requestParamsDto) nestCommonImports.push("Param");

  return apply(url("./files/ts"), [
    filter((path) => {
      if (path.endsWith("response.dto.ts") && !options.responseDto) {
        return false;
      }
      if (path.endsWith("request.query.dto.ts") && !options.requestQueryDto) {
        return false;
      }
      if (path.endsWith("request.params.dto.ts") && !options.requestParamsDto) {
        return false;
      }
      return true;
    }),
    template({
      name: dasherize(options.name),
      responseDto: options.responseDto,
      requestQueryDto: options.requestQueryDto,
      requestParamsDto: options.requestParamsDto,
      url: options.url,
      httpMethodDecorator,
      nestCommonImports,
      ...strings,
    }),
    move(join(normalize(options.module), "queries", dasherize(options.name))),
  ]);
}
