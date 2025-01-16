import React from 'react';
import { FolderTree, Copy, Check } from 'lucide-react';
import { FileNode, RepoInfo } from '@/types/github';
import { FileTreeItem } from './FileTreeItem';

interface FileTreeViewProps {
  fileStructure: FileNode[];
  expandedFolders: Set<string>;
  isCopied: boolean;
  repoInfo: RepoInfo | null;
  onToggleFolder: (path: string) => void;
  onCopy: () => void;
}

export const FileTreeView: React.FC<FileTreeViewProps> = ({
  fileStructure,
  expandedFolders,
  isCopied,
  repoInfo,
  onToggleFolder,
  onCopy,
}) => {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <FolderTree className="w-5 h-5" />
          <h3 className="font-medium">File Structure:</h3>
        </div>
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
      <div className="p-4 bg-gray-900 text-white rounded-md overflow-x-auto font-mono border border-gray-800">
        {fileStructure.map((node) => (
          <FileTreeItem
            key={node.path}
            node={node}
            level={0}
            isExpanded={expandedFolders.has(node.path)}
            repoInfo={repoInfo}
            onToggle={onToggleFolder}
          />
        ))}
      </div>
    </div>
  );
};