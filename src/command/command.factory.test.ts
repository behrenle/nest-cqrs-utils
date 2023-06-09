import { SchematicTestRunner } from "@angular-devkit/schematics/testing";
import * as path from "path";
import { CommandOptions } from "./command.schema";

describe("command factory", () => {
  const runner = new SchematicTestRunner(
    ".",
    path.join(process.cwd(), "src/collection.json")
  );

  it("should generate files with dtos", async () => {
    const options: CommandOptions = {
      name: "FooBar",
      module: "bar",
      url: ":foo/bar",
      method: "post",
      requestBodyDto: true,
      requestParamsDto: true,
      requestQueryDto: true,
      responseDto: true,
    };

    const tree = await runner.runSchematic("command", options);
    const files: string[] = tree!.files;

    const expectedFiles = [
      "/src/bar/commands/foo-bar/foo-bar.command.ts",
      "/src/bar/commands/foo-bar/foo-bar.handler.ts",
      "/src/bar/commands/foo-bar/foo-bar.response.dto.ts",
      "/src/bar/commands/foo-bar/foo-bar.request.body.dto.ts",
      "/src/bar/commands/foo-bar/foo-bar.request.query.dto.ts",
      "/src/bar/commands/foo-bar/foo-bar.request.params.dto.ts",
    ];

    console.debug(expectedFiles.map((f) => files.includes(f)));

    expectedFiles.forEach((expectedFilename) =>
      expect(
        files.find((filename) => filename === expectedFilename)
      ).toBeDefined()
    );
  });

  it("should generate files without dtos", async () => {
    const options: CommandOptions = {
      name: "FooBar",
      module: "bar",
      url: ":foo/bar",
      method: "post",
      requestBodyDto: false,
      requestParamsDto: false,
      requestQueryDto: false,
      responseDto: false,
    };

    const tree = await runner.runSchematic("command", options);
    const files: string[] = tree!.files;

    const expectedFiles = [
      "/src/bar/commands/foo-bar/foo-bar.command.ts",
      "/src/bar/commands/foo-bar/foo-bar.handler.ts",
    ];

    const notExpectedFiles = [
      "/src/bar/commands/foo-bar/foo-bar.response.dto.ts",
      "/src/bar/commands/foo-bar/foo-bar.request.body.dto.ts",
      "/src/bar/commands/foo-bar/foo-bar.request.query.dto.ts",
      "/src/bar/commands/foo-bar/foo-bar.request.params.dto.ts",
    ];

    expectedFiles.forEach((expectedFilename) =>
      expect(
        files.find((filename) => filename === expectedFilename)
      ).toBeDefined()
    );

    notExpectedFiles.forEach((expectedFilename) =>
      expect(
        files.find((filename) => filename === expectedFilename)
      ).toBeUndefined()
    );
  });
});
