import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, Loader2 } from 'lucide-react';
import { FileNode } from '@/types/github';
import { getFileIcon, formatFileSize } from '@/utils/file-utils';
import { Tooltip } from '@/components/ui/tooltip';

interface CommitInfo {
  message: string;
  author: string;
  date: string;
  sha: string;
}

interface FileTreeItemProps {
  node: FileNode;
  level: number;
  isExpanded: boolean;
  repoInfo: { owner: string; repo: string; } | null;
  onToggle: (path: string) => void;
}

export const FileTreeItem: React.FC<FileTreeItemProps> = ({
  node,
  level,
  isExpanded,
  repoInfo,
  onToggle,
}) => {
  const [commitInfo, setCommitInfo] = useState<CommitInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCommitInfo = async () => {
    if (!repoInfo || node.type === 'directory' || commitInfo) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/commits?path=${node.path}&per_page=1`
      );

      if (!response.ok) throw new Error('Failed to fetch commit info');

      const [latestCommit] = await response.json();

      setCommitInfo({
        message: latestCommit.commit.message,
        author: latestCommit.commit.author.name,
        date: new Date(latestCommit.commit.author.date).toLocaleDateString(),
        sha: latestCommit.sha.slice(0, 7)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch commit info');
    } finally {
      setIsLoading(false);
    }
  };

  const { icon: FileIcon, color } = node.type === 'directory'
    ? { icon: Folder, color: 'text-blue-400' }
    : getFileIcon(node.name);

  const tooltipContent = (
    <div className="max-w-xs">
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading commit info...</span>
        </div>
      ) : error ? (
        <span className="text-red-400">{error}</span>
      ) : commitInfo ? (
        <div className="space-y-1">
          <p className="font-medium">{commitInfo.message}</p>
          <p className="text-xs text-gray-400">
            by {commitInfo.author} on {commitInfo.date}
          </p>
          <p className="text-xs text-gray-500">Commit: {commitInfo.sha}</p>
        </div>
      ) : null}
    </div>
  );

  const innerContent = (
    <div
      className="flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-800 cursor-pointer"
      style={{ paddingLeft: `${level * 1.5}rem` }}
      onClick={() => {
        if (node.type === 'directory') {
          onToggle(node.path);
        }
      }}
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
  );

  return (
    <div className="flex flex-col">
      {node.type === 'directory' ? (
        innerContent
      ) : (
        <Tooltip
          content={tooltipContent}
          onShow={fetchCommitInfo}
        >
          {innerContent}
        </Tooltip>
      )}
      
      {node.type === 'directory' && isExpanded && node.children && (
        <div className="flex flex-col">
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              level={level + 1}
              isExpanded={isExpanded}
              repoInfo={repoInfo}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};