export interface RepoInfo {
  owner: string;
  repo: string;
}

export interface RepoStats {
  stars: number;
  forks: number;
  language: string | null;
  updatedAt: string;
  description: string | null;
}

export interface TreeItem {
  path: string;
  type: string;
  sha: string;
  url: string;
  size?: number;
}

export interface GitHubApiResponse {
  tree: TreeItem[];
  truncated: boolean;
  sha: string;
  url: string;
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  size?: number;
}