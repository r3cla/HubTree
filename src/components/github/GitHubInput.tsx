import React from 'react';
import { Download, KeyRound } from 'lucide-react';

interface GitHubInputProps {
  url: string;
  loading: boolean;
  hasFileStructure: boolean;
  token: string;
  showToken: boolean;
  onUrlChange: (url: string) => void;
  onFetch: () => void;
  onDownload: () => void;
  onTokenChange: (token: string) => void;
  onToggleShowToken: () => void;
}

export const GitHubInput: React.FC<GitHubInputProps> = ({
  url,
  loading,
  hasFileStructure,
  token,
  showToken,
  onUrlChange,
  onFetch,
  onDownload,
  onTokenChange,
  onToggleShowToken,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && url && onFetch()}
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
        <button
          onClick={onToggleShowToken}
          title={token ? 'GitHub token set' : 'Add GitHub token (optional)'}
          className={`flex items-center px-2 py-2 rounded-md transition-colors ${
            token
              ? 'text-green-400 bg-gray-800 hover:bg-gray-700'
              : 'text-gray-500 bg-gray-800 hover:bg-gray-700 hover:text-gray-300'
          }`}
        >
          <KeyRound size={16} />
        </button>
      </div>

      {showToken && (
        <div className="flex flex-col gap-1">
          <input
            type="password"
            value={token}
            onChange={(e) => onTokenChange(e.target.value)}
            placeholder="GitHub Personal Access Token (optional)"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white placeholder-gray-400 text-sm"
          />
          <ul className="text-xs text-gray-500 space-y-0.5 list-none">
            <li>• Raises rate limit from 60 to 5,000 req/hr</li>
            <li>• Enables browsing your <span className="text-gray-400">private repositories</span></li>
            <li>• Stored in browser local storage — only sent to api.github.com</li>
            <li>• For more information visit the <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GitHub PAT information page</a></li>
          </ul>
        </div>
      )}
    </div>
  );
};