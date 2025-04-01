'use client';

import { useState, useEffect } from 'react';

export default function GitHubSettings() {
  const [credentials, setCredentials] = useState({
    token: '',
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
      setCredentials({ token: savedToken });
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('github_token', credentials.token);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-800">GitHub Settings</h1>
        <p className="text-gray-600">
          Configure your GitHub access to enable repository management and content editing.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Personal Access Token</h2>
            <p className="text-gray-600 text-sm mt-1">
              A token is required to access and modify your GitHub repositories.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-gray-800">
              Token
            </label>
            <input
              type="password"
              value={credentials.token}
              onChange={(e) => setCredentials({ token: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              placeholder="ghp_..."
            />
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {isSaved ? '✓ Saved' : 'Save Credentials'}
          </button>
        </div>

        <div className="space-y-4 border-t pt-6">
          <h3 className="font-semibold text-gray-800">Required Token Permissions</h3>
          <div className="space-y-3 text-sm">
            <p className="text-gray-600">Your token needs the following permissions to work properly:</p>
            <ul className="space-y-2 list-disc pl-5 text-gray-600">
              <li>
                <span className="font-semibold">repo</span> - Full control of private repositories
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Access repositories and their content</li>
                  <li>Create new branches</li>
                  <li>Read and modify files</li>
                  <li>Create pull requests</li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg space-y-3">
            <h4 className="font-semibold text-blue-800">How to Create a Token</h4>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-blue-900">
              <li>Go to <a 
                href="https://github.com/settings/tokens" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                GitHub Token Settings
              </a></li>
              <li>Click &quot;Generate new token&quot; and select &quot;Generate new token (classic)&quot;</li>
              <li>Give your token a descriptive name (e.g., &quot;GitHub CMS Editor&quot;)</li>
              <li>Set the expiration as needed (recommended: 90 days)</li>
              <li>Under &quot;Select scopes&quot;, check the following:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>✓ <span className="font-mono bg-blue-100 px-1 rounded">repo</span> (all repo permissions)</li>
                </ul>
              </li>
              <li>Click &quot;Generate token&quot; at the bottom</li>
              <li>Copy the generated token immediately (you won&apos;t be able to see it again)</li>
              <li>Paste the token in the field above and click &quot;Save Credentials&quot;</li>
            </ol>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800">Security Note</h4>
            <p className="text-sm text-yellow-800 mt-1">
              Your token is stored locally in your browser and is only used to communicate with GitHub.
              For security, consider using a token with an expiration date and regularly rotating it.
              Never share your token with others.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 