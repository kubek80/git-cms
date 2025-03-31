import { Repository } from "../components/RepositoryGrid";
import { FileItem } from "../components/RepositoryContent";

interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
}

interface GitHubContent {
  name: string;
  path: string;
  type: "file" | "dir";
}

interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
}

export async function getRepositories(): Promise<Repository[]> {
  const token = localStorage.getItem("github_token");
  if (!token) {
    throw new Error("GitHub token not found");
  }

  const response = await fetch("https://api.github.com/user/repos", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch repositories");
  }

  const repos = (await response.json()) as GitHubRepo[];
  return repos.map((repo) => ({
    id: repo.name,
    name: repo.name,
    documentCount: 0, // This will be updated when we fetch content
  }));
}

export async function getRepositoryContent(
  repoName: string,
  path: string = "content",
  branch: string = "main"
): Promise<FileItem[]> {
  const token = localStorage.getItem("github_token");
  if (!token) {
    throw new Error("GitHub token not found");
  }

  const response = await fetch(
    `https://api.github.com/repos/${repoName}/${path}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch repository content");
  }

  const contents = (await response.json()) as GitHubContent[];
  return contents.map((item) => ({
    name: item.name,
    type: item.type === "dir" ? "folder" : "file",
    path: item.path,
  }));
}

export async function getFileBranches(repoName: string): Promise<string[]> {
  const token = localStorage.getItem("github_token");
  if (!token) {
    throw new Error("GitHub token not found");
  }

  const response = await fetch(
    `https://api.github.com/repos/${repoName}/branches`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch branches");
  }

  const branches = (await response.json()) as GitHubBranch[];
  return branches.map((branch) => branch.name);
}

export async function getFileContent(
  repoName: string,
  path: string,
  branch: string = "main"
): Promise<string> {
  const token = localStorage.getItem("github_token");
  if (!token) {
    throw new Error("GitHub token not found");
  }

  const response = await fetch(
    `https://api.github.com/repos/${repoName}/contents/${path}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch file content");
  }

  const data = await response.json();
  return atob(data.content);
}

export async function createPullRequest(
  repoName: string,
  path: string,
  content: string,
  branch: string = "main"
): Promise<void> {
  const token = localStorage.getItem("github_token");
  if (!token) {
    throw new Error("GitHub token not found");
  }

  // Create a new branch
  const timestamp = Date.now();
  const newBranch = `cms-update-${timestamp}`;

  // Get the SHA of the current branch
  const branchResponse = await fetch(
    `https://api.github.com/repos/${repoName}/git/refs/heads/${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!branchResponse.ok) {
    throw new Error("Failed to get branch reference");
  }

  const branchData = await branchResponse.json();

  // Create new branch
  await fetch(`https://api.github.com/repos/${repoName}/git/refs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ref: `refs/heads/${newBranch}`,
      sha: branchData.object.sha,
    }),
  });

  // Update file in new branch
  await fetch(`https://api.github.com/repos/${repoName}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `Update ${path} via CMS`,
      content: btoa(content),
      branch: newBranch,
    }),
  });

  // Create pull request
  await fetch(`https://api.github.com/repos/${repoName}/pulls`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: `Update ${path}`,
      head: newBranch,
      base: branch,
      body: "Updated via GitHub CMS",
    }),
  });
}
