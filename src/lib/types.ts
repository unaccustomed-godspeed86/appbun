export type PackageManager = "bun" | "npm";

export interface CreateCommandOptions {
  name?: string;
  outDir?: string;
  title?: string;
  description?: string;
  identifier?: string;
  themeColor?: string;
  width: number;
  height: number;
  packageManager: PackageManager;
  install: boolean;
  showConfig: boolean;
  quiet: boolean;
}

export interface SiteMetadata {
  title?: string;
  description?: string;
  themeColor?: string;
  sourceUrl: string;
}

export interface ResolvedAppConfig {
  name: string;
  title: string;
  description: string;
  identifier: string;
  packageName: string;
  slug: string;
  themeColor: string;
  url: string;
  origin: string;
  outDir: string;
  width: number;
  height: number;
  packageManager: PackageManager;
}

export interface GeneratedFile {
  path: string;
  content: string | Uint8Array;
}
