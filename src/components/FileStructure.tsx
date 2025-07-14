"use client";

import React, { useState, useEffect } from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { GitHubInput } from './github/GitHubInput';
import { FileTreeView } from './github/FileTreeView';
import { RepoInfo, FileNode, GitHubApiResponse } from '@/types/github';
import { buildFileTree } from '@/utils/file-utils';

const FileStructure: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [fileStructure, setFileStructure] = useState<FileNode[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [copiedTimeout, setCopiedTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [defaultBranch, setDefaultBranch] = useState<string>('main');
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (copiedTimeout) {
        clearTimeout(copiedTimeout);
      }
    };
  }, [copiedTimeout]);

  const extractRepoInfo = (url: string): RepoInfo => {
    try {
      const regex = new RegExp('github\\.com\\/([^\\/]+)\\/([^\\/]+)');
      const match = url.match(regex);

      if (!match) {
        throw new Error('Invalid GitHub URL format');
      }

      const info = {
        owner: match[1],
        repo: match[2].split('#')[0].split('?')[0]
      };
      setRepoInfo(info);
      return info;
    } catch (error) {
      console.error('Error extracting repo info:', error);
      setRepoInfo(null);
      throw new Error('Unable to parse GitHub URL');
    }
  };

  const handleToggleFolder = (path: string) => {
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

  const getAllFolderPaths = (nodes: FileNode[]): string[] => {
    let paths: string[] = [];

    nodes.forEach(node => {
      if (node.type === 'directory') {
        paths.push(node.path);
        if (node.children) {
          paths = paths.concat(getAllFolderPaths(node.children));
        }
      }
    });

    return paths;
  };

  const handleExpandAll = () => {
    const allPaths = getAllFolderPaths(fileStructure);
    setExpandedFolders(new Set(allPaths));
  };

  const handleCollapseAll = () => {
    setExpandedFolders(new Set());
  };

  const handleCopyToClipboard = async () => {
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

    const plainText = generatePlainText(fileStructure);
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

  const handleDownload = () => {
    try {
      const { owner, repo } = extractRepoInfo(url);
      const downloadUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/${defaultBranch}.zip`;
      window.open(downloadUrl, '_blank');
    } catch (error) {
      setError('Failed to generate download URL');
    }
  };

  const fetchFileStructure = async (): Promise<void> => {
    setLoading(true);
    setError('');
    setFileStructure([]);

    try {
      const { owner, repo } = extractRepoInfo(url);
      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);

      if (!repoResponse.ok) {
        throw new Error(`Repository not found or not accessible`);
      }

      const repoData = await repoResponse.json();
      setDefaultBranch(repoData.default_branch);

      const treeResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${repoData.default_branch}?recursive=1`
      );

      if (!treeResponse.ok) {
        throw new Error(`Failed to fetch repository structure`);
      }

      const data: GitHubApiResponse = await treeResponse.json();

      if (data.truncated) {
        setError('Warning: Repository is too large, showing partial structure');
      }

      const filteredTree = data.tree.filter(item => !item.path.includes('.git/'));
      const fileTree = buildFileTree(filteredTree);
      setFileStructure(fileTree);
      setExpandedFolders(new Set());
    } catch (error: unknown) {
      console.error('Error in fetchFileStructure:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to fetch repository structure'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-900 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="w-8 h-8" />
          GitHub File Structure Visualizer (Public Repos)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <GitHubInput
            url={url}
            loading={loading}
            hasFileStructure={fileStructure.length > 0}
            onUrlChange={setUrl}
            onFetch={fetchFileStructure}
            onDownload={handleDownload}
          />

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {fileStructure.length > 0 && (
            <FileTreeView
              fileStructure={fileStructure}
              expandedFolders={expandedFolders}
              isCopied={isCopied}
              repoInfo={repoInfo}
              onToggleFolder={handleToggleFolder}
              onCopy={handleCopyToClipboard}
              onExpandAll={handleExpandAll}
              onCollapseAll={handleCollapseAll}
            />
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
          This project is open-source, licensed under MIT
        </a>
      </div>
    </Card>
  );
};

export default FileStructure;