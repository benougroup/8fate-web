/**
 * cx.ts – utility to join class names conditionally.
 * Example: cx("btn", isActive && "active") => "btn active"
 */
export function cx(...tokens: Array<string | false | null | undefined>): string {
  return tokens.filter(Boolean).join(" ");
}