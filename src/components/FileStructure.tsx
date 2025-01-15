"use client";

import React, { useState } from 'react';
import { FolderTree, Github, File, Folder, ChevronRight, ChevronDown, Copy, Check } from 'lucide-react';
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
    } catch (err) {
      throw new Error('Unable to parse GitHub URL');
    }
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
              <Folder size={16} className="text-blue-400" />
            </>
          ) : (
            <>
              <span className="w-4 h-4" />
              <File size={16} className="text-gray-400" />
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
    } catch (err) {
      console.error('Error in fetchFileStructure:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch repository structure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-900 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="w-6 h-6" />
          GitHub Repository File Structure
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
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Get Structure'}
            </button>
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
    </Card>
  );
};

export default FileStructure;