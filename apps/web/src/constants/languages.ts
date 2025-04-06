import { CodeLanguage } from "@src/api/models";

type LanguageInfo = {
  name: string;
  color: string;
  extension: string;
};

export const Languages: Record<CodeLanguage, LanguageInfo> = {
  TypeScript: {
    name: "TypeScript",
    color: "#255bd0",
    extension: "ts",
  },
  JavaScript: {
    name: "JavaScript",
    color: "#f1e05a",
    extension: "js",
  },
};
