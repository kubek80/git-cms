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
  download_url: string | null;
}

interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
}

interface PullRequest {
  number: number;
  title: string;
  html_url: string;
  state: string;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
  mergeable?: boolean;
  mergeable_state?: string;
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
    id: repo.full_name,
    name: repo.name,
    documentCount: 0, // This will be updated when we fetch content
  }));
}

export async function getRepositoryContent(
  repoFullName: string,
  path: string = "(content)",
  branch: string = "main"
): Promise<FileItem[]> {
  const token = localStorage.getItem("github_token");
  if (!token) {
    throw new Error("GitHub token not found");
  }

  const encodedPath = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  const response = await fetch(
    `https://api.github.com/repos/${repoFullName}/contents/${encodedPath}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch repository content: ${response.status} ${response.statusText}`
    );
  }

  const contents = (await response.json()) as GitHubContent[];
  return contents.map((item) => ({
    name: item.name,
    type: item.type === "dir" ? "folder" : "file",
    path: item.path,
    download_url: item.download_url,
  }));
}

export async function getFileBranches(repoFullName: string): Promise<string[]> {
  const token = localStorage.getItem("github_token");
  if (!token) {
    throw new Error("GitHub token not found");
  }

  const response = await fetch(
    `https://api.github.com/repos/${repoFullName}/branches`,
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
  repoFullName: string,
  path: string,
  branch: string = "main"
): Promise<string> {
  const token = localStorage.getItem("github_token");
  if (!token) {
    throw new Error("GitHub token not found");
  }

  const encodedPath = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  const response = await fetch(
    `https://api.github.com/repos/${repoFullName}/contents/${encodedPath}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch file content: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  if (!data.content) {
    throw new Error("No content found in the response");
  }

  // GitHub API returns content as base64 encoded
  const content = data.content.replace(/\n/g, ""); // Remove any newlines in the base64 string
  return atob(content);
}

export async function createPullRequest(
  repoFullName: string,
  path: string,
  content: string,
  branch: string = "main"
): Promise<void> {
  const token = localStorage.getItem("github_token");
  if (!token) {
    throw new Error("GitHub token not found");
  }

  const encodedPath = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  // Get the SHA of the current branch
  const branchResponse = await fetch(
    `https://api.github.com/repos/${repoFullName}/git/refs/heads/${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!branchResponse.ok) {
    throw new Error("Failed to get branch information");
  }

  const branchData = await branchResponse.json();
  const sha = branchData.object.sha;

  // Create new branch
  const timestamp = Date.now();
  const newBranchName = `create-${path.replace(
    /[^a-zA-Z0-9]/g,
    "-"
  )}-${timestamp}`;

  const createBranchResponse = await fetch(
    `https://api.github.com/repos/${repoFullName}/git/refs`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ref: `refs/heads/${newBranchName}`,
        sha,
      }),
    }
  );

  if (!createBranchResponse.ok) {
    throw new Error("Failed to create new branch");
  }

  // Create or update file in new branch
  const updateResponse = await fetch(
    `https://api.github.com/repos/${repoFullName}/contents/${encodedPath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Create ${path}`,
        content: btoa(unescape(encodeURIComponent(content))),
        branch: newBranchName,
      }),
    }
  );

  if (!updateResponse.ok) {
    const errorData = await updateResponse.json();
    throw new Error(`Failed to create file: ${errorData.message}`);
  }

  // Create pull request
  const prResponse = await fetch(
    `https://api.github.com/repos/${repoFullName}/pulls`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `Create ${path}`,
        head: newBranchName,
        base: branch,
        body: "Created new file via CMS",
      }),
    }
  );

  if (!prResponse.ok) {
    throw new Error("Failed to create pull request");
  }
}

export async function mergePullRequest(
  repoFullName: string,
  pullNumber: number
): Promise<void> {
  const token = localStorage.getItem("github_token");
  if (!token) {
    throw new Error("GitHub token not found");
  }

  const response = await fetch(
    `https://api.github.com/repos/${repoFullName}/pulls/${pullNumber}/merge`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to merge pull request: ${error.message}`);
  }
}

export async function getFilePullRequests(
  repoFullName: string,
  path: string
): Promise<PullRequest[]> {
  const token = localStorage.getItem("github_token");
  if (!token) {
    throw new Error("GitHub token not found");
  }

  // Get all pull requests for the repository
  const response = await fetch(
    `https://api.github.com/repos/${repoFullName}/pulls?state=all`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch pull requests");
  }

  const allPRs = await response.json();

  // Filter PRs that modified this file by checking their files
  const filePRs = await Promise.all(
    allPRs.map(async (pr: PullRequest) => {
      // Get PR details including mergeable status
      const prDetailsResponse = await fetch(
        `https://api.github.com/repos/${repoFullName}/pulls/${pr.number}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!prDetailsResponse.ok) {
        return null;
      }

      const prDetails = await prDetailsResponse.json();

      const filesResponse = await fetch(
        `https://api.github.com/repos/${repoFullName}/pulls/${pr.number}/files`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!filesResponse.ok) {
        return null;
      }

      const files = await filesResponse.json();
      if (files.some((file: { filename: string }) => file.filename === path)) {
        return {
          ...pr,
          mergeable: prDetails.mergeable,
          mergeable_state: prDetails.mergeable_state,
        };
      }
      return null;
    })
  );

  return filePRs.filter((pr): pr is PullRequest => pr !== null);
}

export async function createFile(
  repoFullName: string,
  path: string,
  content: string
): Promise<void> {
  const token = localStorage.getItem("github_token");
  if (!token) {
    throw new Error("GitHub token not found");
  }

  const encodedPath = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  const response = await fetch(
    `https://api.github.com/repos/${repoFullName}/contents/${encodedPath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Create ${path}`,
        content: btoa(unescape(encodeURIComponent(content))),
        branch: "main", // Always create in main branch
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create file: ${errorData.message}`);
  }
}
