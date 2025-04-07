export type CodeDependency = {
  name: string;
  version: string;
};

export type Code = {
  name: string;
  content: string;
  tests?: string;
  dependencies?: CodeDependency[];
  devDependencies?: CodeDependency[];
};
