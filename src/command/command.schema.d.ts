import { Path } from "@angular-devkit/core";

export interface CommandOptions {
  name: string;
  module: string;
  url: string;
  method: string;
  responseDto: boolean;
  requestBodyDto: boolean;
  requestQueryDto: boolean;
  requestParamsDto: boolean;
}
