import {
  File,
  FileCode,
  FileJson,
  FileType,
  FileText,
  FileSpreadsheet,
  Package,
  Database,
  Lock,
  Copyright,
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
  tsx: { icon: FileCode, color: 'text-blue-400' },
  ts: { icon: FileCode, color: 'text-blue-400' },
  jsx: { icon: FileCode, color: 'text-yellow-400' },
  js: { icon: FileCode, color: 'text-yellow-400' },
  mjs: { icon: FileCode, color: 'text-yellow-400' },
  py: { icon: FileCode, color: 'text-green-400' },
  rb: { icon: FileCode, color: 'text-red-400' },
  php: { icon: FileCode, color: 'text-purple-400' },
  java: { icon: FileCode, color: 'text-orange-400' },
  cpp: { icon: FileCode, color: 'text-blue-300' },
  c: { icon: FileCode, color: 'text-blue-300' },
  go: { icon: FileCode, color: 'text-cyan-400' },
  rs: { icon: FileCode, color: 'text-orange-400' },
  swift: { icon: FileCode, color: 'text-orange-400' },
  kt: { icon: FileCode, color: 'text-purple-400' },
};

const dataExtensions: ExtensionMap = {
  json: { icon: FileJson, color: 'text-yellow-300' },
  yaml: { icon: FileType, color: 'text-yellow-200' },
  yml: { icon: FileType, color: 'text-yellow-200' },
  xml: { icon: FileType, color: 'text-orange-300' },
  csv: { icon: FileSpreadsheet, color: 'text-green-300' },
  xls: { icon: FileSpreadsheet, color: 'text-green-400' },
  xlsx: { icon: FileSpreadsheet, color: 'text-green-400' },
  db: { icon: Database, color: 'text-blue-300' },
  sql: { icon: Database, color: 'text-blue-300' },
};

const specialFiles: ExtensionMap = {
  'package.json': { icon: Package, color: 'text-red-300' },
  'package-lock.json': { icon: Lock, color: 'text-yellow-300' },
  'yarn.lock': { icon: Lock, color: 'text-blue-300' },
  '.gitignore': { icon: FileText, color: 'text-gray-400' },
  '.env': { icon: Lock, color: 'text-yellow-300' },
  'LICENSE': { icon: Copyright, color: 'text-yellow-200' },
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