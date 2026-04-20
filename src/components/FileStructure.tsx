"use client";

import React, { useState, useEffect } from 'react';
import { Github, ExternalLink, Star, GitFork, Clock, Code2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { GitHubInput } from './github/GitHubInput';
import { FileTreeView } from './github/FileTreeView';
import { RepoInfo, RepoStats, FileNode, GitHubApiResponse } from '@/types/github';
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
  const [selectedBranch, setSelectedBranch] = useState<string>('main');
  const [branches, setBranches] = useState<string[]>([]);
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
  const [repoStats, setRepoStats] = useState<RepoStats | null>(null);
  const [token, setToken] = useState<string>('');
  const [showToken, setShowToken] = useState<boolean>(false);

  useEffect(() => {
    setToken(localStorage.getItem('github_pat') ?? '');
  }, []);

  const handleTokenChange = (newToken: string) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('github_pat', newToken);
    } else {
      localStorage.removeItem('github_pat');
    }
  };

  useEffect(() => {
    return () => {
      if (copiedTimeout) clearTimeout(copiedTimeout);
    };
  }, [copiedTimeout]);

  const extractRepoInfo = (url: string): RepoInfo => {
    try {
      const regex = new RegExp('github\\.com\\/([^\\/]+)\\/([^\\/]+)');
      const match = url.match(regex);

      if (!match) throw new Error('Invalid GitHub URL format');

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
        if (node.children) paths = paths.concat(getAllFolderPaths(node.children));
      }
    });
    return paths;
  };

  const handleExpandAll = () => setExpandedFolders(new Set(getAllFolderPaths(fileStructure)));
  const handleCollapseAll = () => setExpandedFolders(new Set());

  const handleCopyToClipboard = async () => {
    const generatePlainText = (nodes: FileNode[], level: number = 0): string =>
      nodes.map(node => {
        const indent = '  '.repeat(level);
        const line = `${indent}${node.name}${node.type === 'directory' ? '/' : ''}`;
        if (node.type === 'directory' && node.children) {
          return [line, generatePlainText(node.children, level + 1)].join('\n');
        }
        return line;
      }).join('\n');

    await navigator.clipboard.writeText(generatePlainText(fileStructure));
    setIsCopied(true);
    if (copiedTimeout) clearTimeout(copiedTimeout);
    setCopiedTimeout(setTimeout(() => setIsCopied(false), 2000));
  };

  const handleDownload = () => {
    try {
      const { owner, repo } = extractRepoInfo(url);
      window.open(`https://github.com/${owner}/${repo}/archive/refs/heads/${defaultBranch}.zip`, '_blank');
    } catch {
      setError('Failed to generate download URL');
    }
  };

  const fetchFileStructure = async (): Promise<void> => {
    setLoading(true);
    setError('');
    setFileStructure([]);
    setRepoStats(null);
    setBranches([]);

    try {
      const { owner, repo } = extractRepoInfo(url);
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });

      if (!repoResponse.ok) {
        if (repoResponse.status === 404) {
          throw new Error('Repository not found. If this is a private repo, add a Personal Access Token using the key icon above.');
        }
        if (repoResponse.status === 401 || repoResponse.status === 403) {
          throw new Error('Access denied. Add a Personal Access Token using the key icon above to view private repositories.');
        }
        throw new Error(`GitHub API error (${repoResponse.status})`);
      }

      const repoData = await repoResponse.json();
      setDefaultBranch(repoData.default_branch);
      setSelectedBranch(repoData.default_branch);
      setRepoStats({
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        language: repoData.language,
        updatedAt: new Date(repoData.pushed_at).toLocaleDateString(),
        description: repoData.description,
      });

      const [treeResponse, branchesResponse] = await Promise.all([
        fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${repoData.default_branch}?recursive=1`, { headers }),
        fetch(`https://api.github.com/repos/${owner}/${repo}/branches?per_page=100`, { headers }),
      ]);

      if (branchesResponse.ok) {
        const branchesData = await branchesResponse.json();
        setBranches(branchesData.map((b: { name: string }) => b.name));
      }

      if (!treeResponse.ok) throw new Error('Failed to fetch repository structure');

      const data: GitHubApiResponse = await treeResponse.json();

      if (data.truncated) {
        setError('Warning: Repository is too large, showing partial structure');
      }

      const filteredTree = data.tree.filter(item => !item.path.includes('.git/'));
      setFileStructure(buildFileTree(filteredTree));
      setExpandedFolders(new Set());
    } catch (error: unknown) {
      console.error('Error in fetchFileStructure:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch repository structure');
    } finally {
      setLoading(false);
    }
  };

  const fetchTreeForBranch = async (branch: string): Promise<void> => {
    if (!repoInfo) return;
    setLoading(true);
    setError('');
    setFileStructure([]);
    setSelectedBranch(branch);

    try {
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
      const treeResponse = await fetch(
        `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/git/trees/${branch}?recursive=1`,
        { headers }
      );

      if (!treeResponse.ok) throw new Error('Failed to fetch repository structure');

      const data: GitHubApiResponse = await treeResponse.json();
      if (data.truncated) setError('Warning: Repository is too large, showing partial structure');

      const filteredTree = data.tree.filter(item => !item.path.includes('.git/'));
      setFileStructure(buildFileTree(filteredTree));
      setExpandedFolders(new Set());
    } catch (error: unknown) {
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
          <GitHubInput
            url={url}
            loading={loading}
            hasFileStructure={fileStructure.length > 0}
            token={token}
            showToken={showToken}
            onUrlChange={setUrl}
            onFetch={fetchFileStructure}
            onDownload={handleDownload}
            onTokenChange={handleTokenChange}
            onToggleShowToken={() => setShowToken(prev => !prev)}
          />

          {repoStats && (
            <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap px-1">
              {repoStats.language && (
                <span className="flex items-center gap-1">
                  <Code2 size={12} />
                  {repoStats.language}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Star size={12} />
                {repoStats.stars.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <GitFork size={12} />
                {repoStats.forks.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {repoStats.updatedAt}
              </span>
              {repoStats.description && (
                <span className="text-gray-500 truncate max-w-xs">{repoStats.description}</span>
              )}
            </div>
          )}

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
              token={token}
              branches={branches}
              selectedBranch={selectedBranch}
              onToggleFolder={handleToggleFolder}
              onCopy={handleCopyToClipboard}
              onExpandAll={handleExpandAll}
              onCollapseAll={handleCollapseAll}
              onBranchChange={fetchTreeForBranch}
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
