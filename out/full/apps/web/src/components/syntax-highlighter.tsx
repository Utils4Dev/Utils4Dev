import { CodeLanguage } from "@src/api/models";
import { Prism as ReactSyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

type SyntaxHighlighterProps = {
  language: CodeLanguage;
  className?: string;
  children: string | string[];
  theme?: "dark" | "light";
};

export function SyntaxHighlighter({
  language,
  className,
  children,
  theme = "light",
}: SyntaxHighlighterProps) {
  const highlightStyle = theme === "light" ? oneLight : oneDark;

  return (
    <ReactSyntaxHighlighter
      language={language.toLowerCase()}
      style={highlightStyle}
      showLineNumbers
      className={className}
    >
      {children}
    </ReactSyntaxHighlighter>
  );
}
