import {
  File,
  FileCode,
  FileJson,
  FileType,
  FileText,
  FileImage,
  FileAudio,
  FileVideo,
  Image,
  Star,
  Hash,
  Info,
  FileSpreadsheet,
  Package,
  Database,
  Lock,
  Copyright,
  Terminal,
  Globe,
  Palette,
  Archive,
  Container,
  Type,
  Layers,
  ScrollText,
  Braces,
  ShieldCheck,
  Paintbrush,
  Settings,
  LucideIcon
} from 'lucide-react';
import { TreeItem, FileNode } from '@/types/github';

type FileIconConfig = {
  icon: LucideIcon;
  color: string;
};

type ExtensionMap = {
  [key: string]: FileIconConfig;
};

const codeExtensions: ExtensionMap = {
  // TypeScript / JavaScript
  tsx:     { icon: FileCode, color: 'text-blue-500' },
  ts:      { icon: FileCode, color: 'text-blue-400' },
  jsx:     { icon: FileCode, color: 'text-yellow-500' },
  js:      { icon: FileCode, color: 'text-yellow-400' },
  mjs:     { icon: FileCode, color: 'text-yellow-400' },
  cjs:     { icon: FileCode, color: 'text-yellow-400' },
  // Web
  html:    { icon: Globe,    color: 'text-orange-400' },
  htm:     { icon: Globe,    color: 'text-orange-400' },
  css:     { icon: Hash,     color: 'text-blue-200' },
  scss:    { icon: Palette,  color: 'text-pink-400' },
  sass:    { icon: Palette,  color: 'text-pink-400' },
  less:    { icon: Palette,  color: 'text-blue-300' },
  // Frameworks
  vue:     { icon: FileCode, color: 'text-green-400' },
  svelte:  { icon: FileCode, color: 'text-orange-500' },
  mdx:     { icon: FileCode, color: 'text-blue-300' },
  // Systems / compiled
  py:      { icon: FileCode, color: 'text-green-400' },
  rb:      { icon: FileCode, color: 'text-red-400' },
  php:     { icon: FileCode, color: 'text-purple-400' },
  java:    { icon: FileCode, color: 'text-orange-400' },
  cs:      { icon: FileCode, color: 'text-purple-500' },
  cpp:     { icon: FileCode, color: 'text-blue-400' },
  c:       { icon: FileCode, color: 'text-blue-400' },
  h:       { icon: FileCode, color: 'text-blue-300' },
  go:      { icon: FileCode, color: 'text-cyan-400' },
  rs:      { icon: FileCode, color: 'text-orange-400' },
  swift:   { icon: FileCode, color: 'text-orange-400' },
  kt:      { icon: FileCode, color: 'text-purple-400' },
  dart:    { icon: FileCode, color: 'text-cyan-400' },
  scala:   { icon: FileCode, color: 'text-red-400' },
  lua:     { icon: FileCode, color: 'text-blue-400' },
  r:       { icon: FileCode, color: 'text-blue-400' },
  // Query / schema
  graphql: { icon: Braces,   color: 'text-pink-500' },
  gql:     { icon: Braces,   color: 'text-pink-500' },
  // Shell
  sh:      { icon: Terminal, color: 'text-gray-300' },
  bash:    { icon: Terminal, color: 'text-gray-300' },
  zsh:     { icon: Terminal, color: 'text-gray-300' },
  fish:    { icon: Terminal, color: 'text-gray-300' },
  // Images
  svg:     { icon: FileImage, color: 'text-purple-300' },
};

const dataExtensions: ExtensionMap = {
  // Data formats
  json:    { icon: FileJson,       color: 'text-yellow-300' },
  yaml:    { icon: FileType,       color: 'text-yellow-200' },
  yml:     { icon: FileType,       color: 'text-yellow-200' },
  xml:     { icon: FileType,       color: 'text-orange-300' },
  toml:    { icon: Settings,       color: 'text-gray-300' },
  ini:     { icon: Settings,       color: 'text-gray-300' },
  conf:    { icon: Settings,       color: 'text-gray-300' },
  cfg:     { icon: Settings,       color: 'text-gray-300' },
  // Docs
  md:      { icon: Info,           color: 'text-blue-300' },
  txt:     { icon: FileText,       color: 'text-gray-300' },
  log:     { icon: ScrollText,     color: 'text-gray-400' },
  pdf:     { icon: FileText,       color: 'text-red-500' },
  // Spreadsheets / databases
  csv:     { icon: FileSpreadsheet, color: 'text-green-300' },
  xls:     { icon: FileSpreadsheet, color: 'text-green-400' },
  xlsx:    { icon: FileSpreadsheet, color: 'text-green-400' },
  db:      { icon: Database,       color: 'text-blue-400' },
  sql:     { icon: Database,       color: 'text-blue-400' },
  // Images
  ico:     { icon: Star,           color: 'text-yellow-400' },
  gif:     { icon: Image,          color: 'text-purple-300' },
  jpg:     { icon: Image,          color: 'text-purple-300' },
  jpeg:    { icon: Image,          color: 'text-purple-300' },
  png:     { icon: Image,          color: 'text-purple-300' },
  webp:    { icon: Image,          color: 'text-purple-300' },
  bmp:     { icon: Image,          color: 'text-purple-300' },
  tiff:    { icon: Image,          color: 'text-purple-300' },
  // Audio
  mp3:     { icon: FileAudio,      color: 'text-green-400' },
  wav:     { icon: FileAudio,      color: 'text-green-400' },
  flac:    { icon: FileAudio,      color: 'text-green-400' },
  ogg:     { icon: FileAudio,      color: 'text-green-400' },
  m4a:     { icon: FileAudio,      color: 'text-green-400' },
  // Video
  mp4:     { icon: FileVideo,      color: 'text-blue-400' },
  mov:     { icon: FileVideo,      color: 'text-blue-400' },
  avi:     { icon: FileVideo,      color: 'text-blue-400' },
  webm:    { icon: FileVideo,      color: 'text-blue-400' },
  mkv:     { icon: FileVideo,      color: 'text-blue-400' },
  // Fonts
  woff:    { icon: Type,           color: 'text-yellow-300' },
  woff2:   { icon: Type,           color: 'text-yellow-300' },
  ttf:     { icon: Type,           color: 'text-yellow-300' },
  otf:     { icon: Type,           color: 'text-yellow-300' },
  eot:     { icon: Type,           color: 'text-yellow-300' },
  // Archives
  zip:     { icon: Archive,        color: 'text-yellow-500' },
  tar:     { icon: Archive,        color: 'text-yellow-500' },
  gz:      { icon: Archive,        color: 'text-yellow-500' },
  rar:     { icon: Archive,        color: 'text-yellow-500' },
  '7z':    { icon: Archive,        color: 'text-yellow-500' },
  bz2:     { icon: Archive,        color: 'text-yellow-500' },
};

const specialFiles: ExtensionMap = {
  // Package managers
  'package.json':       { icon: Package,     color: 'text-red-300' },
  'package-lock.json':  { icon: Lock,        color: 'text-yellow-300' },
  'yarn.lock':          { icon: Lock,        color: 'text-blue-400' },
  'pnpm-lock.yaml':     { icon: Lock,        color: 'text-orange-400' },
  'bun.lockb':          { icon: Lock,        color: 'text-yellow-300' },
  'Gemfile':            { icon: Package,     color: 'text-red-400' },
  'Gemfile.lock':       { icon: Lock,        color: 'text-red-300' },
  'Cargo.toml':         { icon: Package,     color: 'text-orange-500' },
  'Cargo.lock':         { icon: Lock,        color: 'text-orange-400' },
  'requirements.txt':   { icon: Package,     color: 'text-blue-400' },
  'pyproject.toml':     { icon: Package,     color: 'text-blue-400' },
  'go.mod':             { icon: Package,     color: 'text-cyan-400' },
  'go.sum':             { icon: Lock,        color: 'text-cyan-300' },
  '.npmrc':             { icon: Package,     color: 'text-red-400' },
  // Docker
  'Dockerfile':         { icon: Container,   color: 'text-blue-400' },
  'docker-compose.yml': { icon: Layers,      color: 'text-blue-400' },
  'docker-compose.yaml':{ icon: Layers,      color: 'text-blue-400' },
  'compose.yml':        { icon: Layers,      color: 'text-blue-400' },
  'compose.yaml':       { icon: Layers,      color: 'text-blue-400' },
  // TypeScript
  'tsconfig.json':      { icon: Settings,    color: 'text-blue-400' },
  'tsconfig.node.json': { icon: Settings,    color: 'text-blue-400' },
  // ESLint
  '.eslintrc':          { icon: ShieldCheck, color: 'text-purple-400' },
  '.eslintrc.js':       { icon: ShieldCheck, color: 'text-purple-400' },
  '.eslintrc.cjs':      { icon: ShieldCheck, color: 'text-purple-400' },
  '.eslintrc.json':     { icon: ShieldCheck, color: 'text-purple-400' },
  '.eslintrc.yml':      { icon: ShieldCheck, color: 'text-purple-400' },
  '.eslintrc.yaml':     { icon: ShieldCheck, color: 'text-purple-400' },
  'eslint.config.js':   { icon: ShieldCheck, color: 'text-purple-400' },
  'eslint.config.mjs':  { icon: ShieldCheck, color: 'text-purple-400' },
  'eslint.config.cjs':  { icon: ShieldCheck, color: 'text-purple-400' },
  'eslint.config.ts':   { icon: ShieldCheck, color: 'text-purple-400' },
  // Prettier
  '.prettierrc':        { icon: Paintbrush,  color: 'text-green-300' },
  '.prettierrc.js':     { icon: Paintbrush,  color: 'text-green-300' },
  '.prettierrc.json':   { icon: Paintbrush,  color: 'text-green-300' },
  '.prettierrc.yml':    { icon: Paintbrush,  color: 'text-green-300' },
  'prettier.config.js': { icon: Paintbrush,  color: 'text-green-300' },
  'prettier.config.ts': { icon: Paintbrush,  color: 'text-green-300' },
  'prettier.config.cjs':{ icon: Paintbrush,  color: 'text-green-300' },
  // Build / framework configs
  'vite.config.js':     { icon: Settings,    color: 'text-purple-400' },
  'vite.config.ts':     { icon: Settings,    color: 'text-purple-400' },
  'vitest.config.ts':   { icon: Settings,    color: 'text-green-400' },
  'webpack.config.js':  { icon: Settings,    color: 'text-blue-400' },
  'webpack.config.ts':  { icon: Settings,    color: 'text-blue-400' },
  'next.config.js':     { icon: Settings,    color: 'text-gray-300' },
  'next.config.ts':     { icon: Settings,    color: 'text-gray-300' },
  'tailwind.config.js': { icon: Settings,    color: 'text-cyan-400' },
  'tailwind.config.ts': { icon: Settings,    color: 'text-cyan-400' },
  'postcss.config.js':  { icon: Settings,    color: 'text-red-400' },
  'postcss.config.mjs': { icon: Settings,    color: 'text-red-400' },
  'jest.config.js':     { icon: Settings,    color: 'text-red-400' },
  'jest.config.ts':     { icon: Settings,    color: 'text-red-400' },
  'babel.config.js':    { icon: Settings,    color: 'text-yellow-400' },
  '.babelrc':           { icon: Settings,    color: 'text-yellow-400' },
  // Git / env / misc
  '.gitignore':         { icon: FileText,    color: 'text-gray-400' },
  '.env':               { icon: Lock,        color: 'text-yellow-300' },
  '.hintrc':            { icon: FileText,    color: 'text-gray-400' },
  'LICENSE':            { icon: Copyright,   color: 'text-yellow-200' },
};

const NOISY_FOLDERS = new Set([
  // Dependencies / build output
  'node_modules', '.next', 'dist', 'build', '__pycache__',
  'vendor', 'coverage', '.cache', 'out', '.venv', 'venv',
  '.turbo', '.vercel', '.parcel-cache', 'target', '.gradle',
  'tmp', '.tmp',
  // Editor / IDE config folders
  '.github', '.gitlab', '.vscode', '.idea', '.vs',
  '.zed', '.claude', '.cursor', '.windsurf', '.fleet',
  // Test asset folders
  'test_files', 'test_folders',
]);

export const filterNoisyFolders = (nodes: FileNode[]): FileNode[] =>
  nodes.reduce<FileNode[]>((acc, node) => {
    if (node.type === 'directory' && NOISY_FOLDERS.has(node.name)) return acc;
    acc.push(
      node.type === 'directory' && node.children
        ? { ...node, children: filterNoisyFolders(node.children) }
        : node
    );
    return acc;
  }, []);

export const filterTree = (nodes: FileNode[], query: string): FileNode[] => {
  if (!query) return nodes;
  const q = query.toLowerCase();
  return nodes.reduce<FileNode[]>((acc, node) => {
    if (node.type === 'file') {
      if (node.name.toLowerCase().includes(q)) acc.push(node);
    } else {
      const filteredChildren = filterTree(node.children ?? [], q);
      if (filteredChildren.length > 0 || node.name.toLowerCase().includes(q)) {
        acc.push({ ...node, children: filteredChildren });
      }
    }
    return acc;
  }, []);
};

export const getFileIcon = (filename: string): FileIconConfig => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';

  if (filename in specialFiles) {
    return specialFiles[filename];
  }

  const allExtensions: ExtensionMap = {
    ...codeExtensions,
    ...dataExtensions,
  };

  if (extension in allExtensions) {
    return allExtensions[extension];
  }

  return { icon: File, color: 'text-gray-400' };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const buildFileTree = (files: TreeItem[]): FileNode[] => {
  const makeNode = (path: string, type: 'file' | 'directory', size?: number): FileNode => ({
    name: path.split('/').pop() || '',
    path,
    type,
    children: type === 'directory' ? [] : undefined,
    ...(size !== undefined ? { size } : {})
  });

  const root: { [key: string]: FileNode } = {};

  files.forEach(file => {
    const parts = file.path.split('/');
    let path = '';

    parts.forEach((part, index) => {
      path = path ? `${path}/${part}` : part;
      if (index < parts.length - 1 || file.type === 'tree') {
        if (!root[path]) {
          root[path] = makeNode(path, 'directory');
        }
      }
    });
  });

  files.forEach(file => {
    if (file.type !== 'tree') {
      root[file.path] = makeNode(file.path, 'file', file.size);
    }
  });

  Object.keys(root).forEach(path => {
    const parts = path.split('/');
    if (parts.length > 1) {
      const parentPath = parts.slice(0, -1).join('/');
      const parent = root[parentPath];
      if (parent && parent.children) {
        parent.children.push(root[path]);
      }
    }
  });

  const rootNodes = Object.values(root).filter(node => !node.path.includes('/'));
  return rootNodes.sort((a, b) => {
    if (a.type === 'directory' && b.type === 'file') return -1;
    if (a.type === 'file' && b.type === 'directory') return 1;
    return a.name.localeCompare(b.name);
  });
};
