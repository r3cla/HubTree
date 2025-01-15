"use client";

import React, { useState } from 'react';
import {
  FolderTree,
  Github,
  ExternalLink,
  File,
  Folder,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Download,
  FileJson,
  FileType,
  FileCode,
  FileText,
  Image,
  FileSpreadsheet,
  Film,
  Music,
  Package,
  FileArchive,
  Database,
  Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface RepoInfo {
  owner: string;
  repo: string;
}

interface TreeItem {
  path: string;
  type: string;
  sha: string;
  url: string;
  size?: number;
}

interface GitHubApiResponse {
  tree: TreeItem[];
  truncated: boolean;
  sha: string;
  url: string;
}

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  size?: number;
}

type IconComponent = typeof File;

type StringIndexed<T> = {
  [K in keyof T]: T[K];
} & { [key: string]: { icon: IconComponent; color: string } };

const getFileIcon = (filename: string): { icon: IconComponent; color: string } => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';

  // Code files
  const codeExtensions: { [key: string]: { icon: IconComponent; color: string } } = {
    tsx: { icon: FileCode, color: 'text-blue-400' },
    ts: { icon: FileCode, color: 'text-blue-400' },
    jsx: { icon: FileCode, color: 'text-yellow-400' },
    js: { icon: FileCode, color: 'text-yellow-400' },
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

  // Data files
  const dataExtensions: { [key: string]: { icon: IconComponent; color: string } } = {
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

  // Style files
  const styleExtensions: { [key: string]: { icon: IconComponent; color: string } } = {
    css: { icon: FileCode, color: 'text-blue-400' },
    scss: { icon: FileCode, color: 'text-pink-400' },
    sass: { icon: FileCode, color: 'text-pink-400' },
    less: { icon: FileCode, color: 'text-blue-300' },
    styled: { icon: FileCode, color: 'text-pink-300' },
  };

  // Document files
  const docExtensions: { [key: string]: { icon: IconComponent; color: string } } = {
    md: { icon: FileText, color: 'text-white' },
    txt: { icon: FileText, color: 'text-gray-300' },
    pdf: { icon: FileText, color: 'text-red-400' },
    doc: { icon: FileText, color: 'text-blue-400' },
    docx: { icon: FileText, color: 'text-blue-400' },
  };

  // Media files
  const mediaExtensions: { [key: string]: { icon: IconComponent; color: string } } = {
    jpg: { icon: Image, color: 'text-purple-400' },
    jpeg: { icon: Image, color: 'text-purple-400' },
    png: { icon: Image, color: 'text-purple-400' },
    gif: { icon: Image, color: 'text-purple-400' },
    svg: { icon: Image, color: 'text-purple-400' },
    mp4: { icon: Film, color: 'text-blue-400' },
    avi: { icon: Film, color: 'text-blue-400' },
    mov: { icon: Film, color: 'text-blue-400' },
    mp3: { icon: Music, color: 'text-green-400' },
    wav: { icon: Music, color: 'text-green-400' },
  };

  // Package and config files
  const configExtensions: { [key: string]: { icon: IconComponent; color: string } } = {
    package: { icon: Package, color: 'text-red-300' },
    lock: { icon: Lock, color: 'text-yellow-300' },
    zip: { icon: FileArchive, color: 'text-yellow-400' },
    rar: { icon: FileArchive, color: 'text-yellow-400' },
    tar: { icon: FileArchive, color: 'text-yellow-400' },
    gz: { icon: FileArchive, color: 'text-yellow-400' },
  };

  // Special filenames
  const specialFiles: { [key: string]: { icon: IconComponent; color: string } } = {
    'package.json': { icon: Package, color: 'text-red-300' },
    'package-lock.json': { icon: Lock, color: 'text-yellow-300' },
    'yarn.lock': { icon: Lock, color: 'text-blue-300' },
    '.gitignore': { icon: FileText, color: 'text-gray-400' },
    '.env': { icon: Lock, color: 'text-yellow-300' },
  };

  // Check special filenames first
  if (filename in specialFiles) {
    return specialFiles[filename];
  }

  // Then check file extensions
  const allExtensions = {
    ...codeExtensions,
    ...dataExtensions,
    ...styleExtensions,
    ...docExtensions,
    ...mediaExtensions,
    ...configExtensions,
  };

  // Type guard to check if extension is a key of allExtensions
  function isValidExtension(extension: string): extension is string {
    return extension in allExtensions;
  }

  if (isValidExtension(extension)) {
    return allExtensions[extension];
  }

  return { icon: File, color: 'text-gray-400' };
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const FileStructure: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [fileStructure, setFileStructure] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [copiedTimeout, setCopiedTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [defaultBranch, setDefaultBranch] = useState<string>('main');

  const extractRepoInfo = (url: string): RepoInfo => {
    try {
      const regex = /github\.com\/([^/]+)\/([^/]+)/;
      const match = url.match(regex);

      if (!match) {
        throw new Error('Invalid GitHub URL format');
      }

      return {
        owner: match[1],
        repo: match[2].split('#')[0].split('?')[0]
      };
    } catch (error: unknown) {
      console.error('Error extracting repo info:', error);
      throw new Error('Unable to parse GitHub URL');
    }
  };

  const downloadRepository = (owner: string, repo: string, defaultBranch: string) => {
    const downloadUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/${defaultBranch}.zip`;
    window.open(downloadUrl, '_blank');
  };

  const buildFileTree = (files: TreeItem[]): FileNode[] => {
    const makeNode = (path: string, type: 'file' | 'directory', size?: number): FileNode & { size?: number } => ({
      name: path.split('/').pop() || '',
      path,
      type,
      children: type === 'directory' ? [] : undefined,
      ...(size !== undefined ? { size } : {})
    });

    const root: { [key: string]: FileNode & { size?: number } } = {};

    // First, create all directories
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

    // Then add all files with their sizes
    files.forEach(file => {
      if (file.type !== 'tree') {
        root[file.path] = makeNode(file.path, 'file', file.size);
      }
    });

    // Build the tree structure
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

    // Get only root level nodes and sort them
    const rootNodes = Object.values(root).filter(node => !node.path.includes('/') || node.path === node.name);
    return rootNodes.sort((a, b) => {
      if (a.type === 'directory' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'directory') return 1;
      return a.name.localeCompare(b.name);
    });
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const copyToClipboard = async (fileTree: FileNode[]) => {
    const generatePlainText = (nodes: FileNode[], level: number = 0): string => {
      return nodes.map(node => {
        const indent = '  '.repeat(level);
        const line = `${indent}${node.name}${node.type === 'directory' ? '/' : ''}`;
        if (node.type === 'directory' && node.children) {
          return [line, generatePlainText(node.children, level + 1)].join('\n');
        }
        return line;
      }).join('\n');
    };

    const plainText = generatePlainText(fileTree);
    await navigator.clipboard.writeText(plainText);
    setIsCopied(true);

    if (copiedTimeout) {
      clearTimeout(copiedTimeout);
    }

    const timeout = setTimeout(() => {
      setIsCopied(false);
    }, 2000);

    setCopiedTimeout(timeout);
  };

  const renderFileTree = (node: FileNode & { size?: number }, level: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const { icon: FileIcon, color } = node.type === 'directory'
      ? { icon: Folder, color: 'text-blue-400' }
      : getFileIcon(node.name);

    return (
      <div key={node.path} className="flex flex-col">
        <div
          className={`flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-800 cursor-pointer`}
          style={{ paddingLeft: `${level * 1.5}rem` }}
          onClick={() => node.type === 'directory' && toggleFolder(node.path)}
        >
          {node.type === 'directory' ? (
            <>
              <span className="w-4 h-4">
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </span>
              <FileIcon size={16} className={color} />
            </>
          ) : (
            <>
              <span className="w-4 h-4" />
              <FileIcon size={16} className={color} />
            </>
          )}
          <span className={`${node.type === 'directory' ? 'text-blue-400 font-medium' : 'text-gray-200'} flex-1`}>
            {node.name}
          </span>
          {node.type === 'file' && node.size !== undefined && (
            <span className="text-gray-400 text-sm">
              {formatFileSize(node.size)}
            </span>
          )}
        </div>
        {node.type === 'directory' && isExpanded && node.children && (
          <div className="flex flex-col">
            {node.children.map(child => renderFileTree(child as FileNode & { size?: number }, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const fetchFileStructure = async (): Promise<void> => {
    setLoading(true);
    setError('');
    setFileStructure('');

    try {
      const { owner, repo } = extractRepoInfo(url);
      console.log('Extracted repo info:', { owner, repo });

      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!repoResponse.ok) {
        throw new Error(`Repository not found or not accessible`);
      }

      const repoData = await repoResponse.json();
      const defaultBranch = repoData.default_branch;
      setDefaultBranch(defaultBranch);
      console.log('Default branch:', defaultBranch);

      const treeResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`
      );

      if (!treeResponse.ok) {
        throw new Error(`Failed to fetch repository structure`);
      }

      const data: GitHubApiResponse = await treeResponse.json();
      console.log('Raw API response data:', data);
      console.log('Raw tree data:', data.tree);

      if (data.truncated) {
        setError('Warning: Repository is too large, showing partial structure');
      }

      const filteredTree = data.tree.filter(item => !item.path.includes('.git/'));
      console.log('Filtered tree (after removing .git):', filteredTree);

      const fileTree = buildFileTree(filteredTree);
      console.log('Final built file tree:', fileTree);

      setFileStructure(JSON.stringify(fileTree));
      console.log('Set file structure to:', fileTree);
      setExpandedFolders(new Set()); // Reset expanded folders
    } catch (error: unknown) {
      console.error('Error in fetchFileStructure:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch repository structure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-900 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="w-8 h-8" />
          GitHub File Structure Visualizer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter GitHub repository URL"
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white placeholder-gray-400"
            />
            <button
              onClick={fetchFileStructure}
              disabled={loading || !url}
              className="px-4 py-2 text-sm text-white bg-blue-800 rounded-md hover:bg-blue-600 disabled:bg-blue-200 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Get Structure'}
            </button>
            {fileStructure && (
              <button
                onClick={() => {
                  const { owner, repo } = extractRepoInfo(url);
                  downloadRepository(owner, repo, defaultBranch);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-green-700 rounded-md hover:bg-green-600"
              >
                <Download size={16} />
                Download ZIP
              </button>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {fileStructure && (
            <div className="mt-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <FolderTree className="w-5 h-5" />
                  <h3 className="font-medium">File Structure:</h3>
                </div>
                <button
                  onClick={() => copyToClipboard(JSON.parse(fileStructure))}
                  className="flex items-center gap-1 px-2 py-1 text-sm rounded bg-gray-800 hover:bg-gray-700"
                >
                  {isCopied ? (
                    <>
                      <Check size={14} className="text-green-500" />
                      <span className="text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 bg-gray-900 text-white rounded-md overflow-x-auto font-mono border border-gray-800">
                {JSON.parse(fileStructure).map((node: FileNode) => renderFileTree(node))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <div className="border-t border-gray-800 py-4 px-6 text-center text-xs text-gray-400">
        <a 
          href="https://github.com/r3cla/github-file-viewer"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 hover:text-white transition-colors"
        >
          <ExternalLink size={13} />
          View Source
        </a>
      </div>
    </Card>
  );
};

export default FileStructure;