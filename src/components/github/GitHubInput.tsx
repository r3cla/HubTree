import React from 'react';
import { Download } from 'lucide-react';
import { RepoInfo } from '@/types/github';

interface GitHubInputProps {
  url: string;
  loading: boolean;
  hasFileStructure: boolean;
  onUrlChange: (url: string) => void;
  onFetch: () => void;
  onDownload: () => void;
}

export const GitHubInput: React.FC<GitHubInputProps> = ({
  url,
  loading,
  hasFileStructure,
  onUrlChange,
  onFetch,
  onDownload,
}) => {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder="Enter GitHub repository URL"
        className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white placeholder-gray-400"
      />
      <button
        onClick={onFetch}
        disabled={loading || !url}
        className="px-4 py-2 text-sm text-white bg-blue-800 rounded-md hover:bg-blue-600 disabled:bg-blue-200 disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        {loading ? 'Loading...' : 'Get Structure'}
      </button>
      {hasFileStructure && (
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-green-700 rounded-md hover:bg-green-600"
        >
          <Download size={16} />
          Download ZIP
        </button>
      )}
    </div>
  );
};