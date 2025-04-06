import { cn } from "@src/lib/utils";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal as XTerm } from "@xterm/xterm";
import {
  ComponentProps,
  PropsWithoutRef,
  useLayoutEffect,
  useRef,
} from "react";

import "@xterm/xterm/css/xterm.css";

type TerminalProps = PropsWithoutRef<ComponentProps<"div">> & {
  setTerminal?: (term: XTerm) => void;
};

export function Terminal({ setTerminal, className, ...props }: TerminalProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useLayoutEffect(() => {
    if (!divRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      cursorStyle: "underline",
      fontSize: 14,
      fontFamily: "monospace",
      allowTransparency: true,
      windowOptions: {},
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(divRef.current);

    setTerminal?.(term);
    fitAddonRef.current = fitAddon;

    const handleResize = () => {
      fitAddon.fit();
    };

    const observer = new ResizeObserver(handleResize);
    if (divRef.current) {
      observer.observe(divRef.current);
    }

    return () => {
      if (divRef.current) {
        observer.unobserve(divRef.current);
      }
      observer.disconnect();
      term.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={divRef} className={cn("", className)} {...props} />;
}
