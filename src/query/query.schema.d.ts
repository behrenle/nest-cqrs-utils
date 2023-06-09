import { Path } from "@angular-devkit/core";

export interface QueryOptions {
  name: string;
  module: string;
  url: string;
  method: string;
  responseDto: boolean;
  requestQueryDto: boolean;
  requestParamsDto: boolean;
}
