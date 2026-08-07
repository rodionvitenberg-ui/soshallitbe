/**
 * Renders a preserved production HTML fragment as-is.
 * Prefer assemble-home-ui for page composition (no extra wrappers).
 * Use this only when the host element is already the correct parent.
 */
export function RawFragment({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
