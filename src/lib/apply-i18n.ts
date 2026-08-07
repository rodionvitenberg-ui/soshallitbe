type Messages = Record<string, unknown>;

function getByPath(messages: Messages, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Messages)) {
      return (acc as Messages)[key];
    }
    return undefined;
  }, messages);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Replace `{{dotted.keys}}` in HTML templates with message values.
 * Missing keys are left as-is (visible in dev) so gaps are obvious.
 */
export function applyI18n(html: string, messages: Messages): string {
  return html.replace(/\{\{([a-zA-Z0-9_.]+)\}\}/g, (match, key: string) => {
    const value = getByPath(messages, key);
    if (value == null || typeof value === "object") {
      return match;
    }
    return escapeHtml(String(value));
  });
}
