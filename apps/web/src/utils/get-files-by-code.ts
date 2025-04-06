import { Code } from "@src/types/code";
import { FileSystemTree } from "@webcontainer/api";

type Language = "typescript" | "javascript";

export function createCodeFiles(
  language: Language,
  code?: Code,
): FileSystemTree {
  const extension = language === "typescript" ? "ts" : "js";

  const dependencies = (code?.dependencies ?? []).reduce((acc, dep) => {
    return {
      ...acc,
      [dep.name]: dep.version,
    };
  }, {});

  const devDependencies = (code?.devDependencies ?? []).reduce((acc, dep) => {
    return {
      ...acc,
      [dep.name]: dep.version,
    };
  }, {});

  const packageJson = {
    name: "util-code",
    private: true,
    version: "0.0.0",
    dependencies,
    devDependencies,
  };

  return {
    "package.json": {
      file: {
        contents: JSON.stringify(packageJson, null, 2),
      },
    },
    [`index.${extension}`]: {
      file: {
        contents: code?.content ?? "",
      },
    },
    [`index.spec.${extension}`]: {
      file: {
        contents: code?.tests ?? "",
      },
    },
  };
}
