import { CommandOptions } from "../command.schema";
import { convertHttpMethodToNestDecorator } from "../../utils/convert-http-method-to-nest-decorator";
import {
  Source,
  apply,
  move,
  url,
  template,
  filter,
} from "@angular-devkit/schematics";
import { dasherize } from "@angular-devkit/core/src/utils/strings";
import { join, normalize, strings } from "@angular-devkit/core";

export function generateFiles(options: CommandOptions): Source {
  const httpMethodDecorator = convertHttpMethodToNestDecorator(options.method);
  const nestCommonImports: string[] = [httpMethodDecorator];
  if (options.requestQueryDto) nestCommonImports.push("Query");
  if (options.requestParamsDto) nestCommonImports.push("Param");
  if (options.requestBodyDto) nestCommonImports.push("Body");

  return apply(url("./files/ts"), [
    filter((path) => {
      if (path.endsWith("index.ts")) {
        return false;
      }
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
