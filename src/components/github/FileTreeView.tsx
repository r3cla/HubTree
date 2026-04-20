import React, { useState, useMemo } from 'react';
import { FolderTree, Copy, Check, FolderOpen, FolderClosed, Search, Eye, EyeOff, GitBranch, X } from 'lucide-react';
import { FileNode, RepoInfo } from '@/types/github';
import { FileTreeItem } from './FileTreeItem';
import { filterTree, filterNoisyFolders } from '@/utils/file-utils';

interface FileTreeViewProps {
  fileStructure: FileNode[];
  expandedFolders: Set<string>;
  isCopied: boolean;
  repoInfo: RepoInfo | null;
  token: string;
  branches: string[];
  selectedBranch: string;
  onToggleFolder: (path: string) => void;
  onCopy: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onBranchChange: (branch: string) => void;
}

export const FileTreeView: React.FC<FileTreeViewProps> = ({
  fileStructure,
  expandedFolders,
  isCopied,
  repoInfo,
  token,
  branches,
  selectedBranch,
  onToggleFolder,
  onCopy,
  onExpandAll,
  onCollapseAll,
  onBranchChange,
}) => {
  const [search, setSearch] = useState('');
  const [hideNoisy, setHideNoisy] = useState(false);

  const displayTree = useMemo(() => {
    let result = fileStructure;
    if (hideNoisy) result = filterNoisyFolders(result);
    if (search) result = filterTree(result, search);
    return result;
  }, [fileStructure, hideNoisy, search]);

  return (
    <div className="mt-4">
      {/* Top toolbar */}
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <div className="flex items-center gap-2">
          <FolderTree className="w-5 h-5" />
          <h3 className="font-medium">File Structure</h3>
          {branches.length > 1 && (
            <div className="flex items-center gap-1 ml-1">
              <GitBranch size={13} className="text-gray-400" />
              <select
                value={selectedBranch}
                onChange={(e) => onBranchChange(e.target.value)}
                className="bg-gray-800 text-gray-200 text-xs rounded px-1.5 py-1 border border-gray-700 focus:outline-none focus:border-gray-500"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHideNoisy(prev => !prev)}
            title={hideNoisy ? 'Show all folders' : 'Hide noisy folders (node_modules, dist, etc.)'}
            className={`flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors ${
              hideNoisy
                ? 'bg-blue-800 hover:bg-blue-700 text-white'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {hideNoisy ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>Hide noise</span>
          </button>
          <button
            onClick={onExpandAll}
            className="flex items-center gap-1 px-2 py-1 text-sm rounded bg-gray-800 hover:bg-gray-700"
          >
            <FolderOpen size={14} />
            <span>Expand All</span>
          </button>
          <button
            onClick={onCollapseAll}
            className="flex items-center gap-1 px-2 py-1 text-sm rounded bg-gray-800 hover:bg-gray-700"
          >
            <FolderClosed size={14} />
            <span>Collapse All</span>
          </button>
          <button
            onClick={onCopy}
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
      </div>

      {/* Search bar */}
      <div className="relative mb-2">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search files..."
          className="w-full pl-8 pr-8 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Tree */}
      <div className="p-4 bg-gray-900 text-white rounded-md overflow-x-auto font-mono border border-gray-800">
        {displayTree.length === 0 ? (
          <p className="text-gray-500 text-sm">No files match your search.</p>
        ) : (
          displayTree.map((node) => (
            <FileTreeItem
              key={node.path}
              node={node}
              level={0}
              isExpanded={expandedFolders.has(node.path)}
              forceExpand={!!search}
              repoInfo={repoInfo}
              token={token}
              branch={selectedBranch}
              onToggle={onToggleFolder}
            />
          ))
        )}
      </div>
    </div>
  );
};
