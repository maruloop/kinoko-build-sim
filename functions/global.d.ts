declare module "https://esm.sh/lz-string" {
  export function compressToEncodedURIComponent(input: string): string;
  export function decompressFromEncodedURIComponent(input: string): string;
}
