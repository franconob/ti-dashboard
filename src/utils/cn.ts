/** Merge CSS module classnames, filtering out falsy values. */
export function cn(
  ...args: (string | undefined | null | false)[]
): string {
  return args.filter(Boolean).join(' ');
}
