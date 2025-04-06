import Editor from "@monaco-editor/react";
import { CodeLanguage } from "@src/api/models";
import { cn } from "@src/lib/utils";

type Options = {
  automaticLayout?: boolean;
};

type CodeEditorProps = {
  language: CodeLanguage;
  value?: string;
  onChange?: (code: string) => void;
  options?: Options;
  className?: string;
};

export function CodeEditor({
  language,
  value,
  onChange,
  options,
  className,
}: CodeEditorProps) {
  return (
    <Editor
      language={language.toLowerCase()}
      value={value}
      onChange={(value) => onChange?.(value || "")}
      options={{
        automaticLayout: options?.automaticLayout,
      }}
      className={cn(
        "border-input overflow-hidden rounded-md border",
        className,
      )}
    />
  );
}
