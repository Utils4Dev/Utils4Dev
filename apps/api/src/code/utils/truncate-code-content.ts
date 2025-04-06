const MAX_CODE_LINES = 5;
const TRUNCATED_CODE_INDICATOR = '...';

export function truncateCodeContent(code: string): string {
  const lines = code.split('\n');
  if (lines.length > MAX_CODE_LINES) {
    return (
      lines.slice(0, MAX_CODE_LINES).join('\n') +
      `\n${TRUNCATED_CODE_INDICATOR}`
    );
  }
  return code;
}
