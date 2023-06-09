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
import { CommandOptions } from "./command.schema";

import { join, normalize, strings } from "@angular-devkit/core";
import { dasherize } from "@angular-devkit/core/src/utils/strings";
import { convertHttpMethodToNestDecorator } from "../utils/convert-http-method-to-nest-decorator";

export function main(options: CommandOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(chain([mergeWith(generateFiles(options))]))(
      tree,
      context
    );
  };
}

function generateFiles(options: CommandOptions): Source {
  const httpMethodDecorator = convertHttpMethodToNestDecorator(options.method);
  const nestCommonImports: string[] = [httpMethodDecorator];
  if (options.requestQueryDto) nestCommonImports.push("Query");
  if (options.requestParamsDto) nestCommonImports.push("Param");
  if (options.requestBodyDto) nestCommonImports.push("Body");

  return apply(url("./files/ts"), [
    filter((path) => {
      if (path.endsWith("response.dto.ts") && !options.responseDto) {
        return false;
      }
      if (path.endsWith("request.body.dto.ts") && !options.requestBodyDto) {
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
      requestBodyDto: options.requestBodyDto,
      requestParamsDto: options.requestParamsDto,
      url: options.url,
      httpMethodDecorator,
      nestCommonImports,
      ...strings,
    }),
    move(join(normalize(options.module), "commands", dasherize(options.name))),
  ]);
}
