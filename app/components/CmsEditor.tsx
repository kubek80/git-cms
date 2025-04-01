'use client';

import { useState } from 'react';
import TiptapEditor from './TiptapEditor';
import CmsModal from './CmsModal';
import { EMPTY_CMS_DATA, SAMPLE_CMS_DATA } from '../utils/constants';

interface Metadata {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
}

interface Social {
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterCardType: 'summary' | 'summary_large_image';
}

export interface CmsData {
  content: string;
  metadata: Metadata;
  social: Social;
}

interface CmsEditorProps {
  initialData?: CmsData;
  onSave: (data: CmsData | string, isRawContent?: boolean) => void;
}

type TabType = 'content' | 'metadata' | 'social';

export default function CmsEditor({ initialData, onSave }: CmsEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('content');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cmsData, setCmsData] = useState<CmsData>(() => {
    if (initialData) {
      // Make sure content isn't empty or meaningless default
      const contentIsEmpty = !initialData.content || initialData.content.trim() === '';
      
      return {
        ...initialData,
        content: contentIsEmpty ? '' : initialData.content,
      };
    }
    
    return EMPTY_CMS_DATA;
  });

  const handleContentChange = (content: string) => {
    setCmsData((prev) => ({
      ...prev,
      content,
    }));
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCmsData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [name]: value,
      },
    }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCmsData((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        [name]: value,
      },
    }));
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveToRepository = (rawContent: string) => {
    // Call the onSave with the rawContent string and flag it as raw content
    try {
      console.log('Saving raw content to repository:', rawContent);
      onSave(rawContent, true); // Pass true to indicate this is raw content
    } catch (e) {
      console.error('Error saving to repository:', e);
    }
  };

  const handleAutofill = () => {
    setCmsData(SAMPLE_CMS_DATA);
  };

  const TabButton = ({ tab, label }: { tab: TabType; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 font-medium ${
        activeTab === tab
          ? 'bg-white border-b-2 border-blue-600 text-blue-700'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return (
          <div className="p-4">
            <h2 className="text-lg font-medium mb-2 text-gray-800">Content Editor</h2>
            <TiptapEditor initialContent={cmsData.content} onChange={handleContentChange} />
          </div>
        );
      case 'metadata':
        return (
          <div className="p-4">
            <h2 className="text-lg font-medium mb-6 text-gray-800">Metadata Information (SEO)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={cmsData.metadata.title}
                  onChange={handleMetadataChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-500"
                  placeholder="Page title (important for SEO)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  name="description"
                  value={cmsData.metadata.description}
                  onChange={handleMetadataChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-500"
                  placeholder="Brief description of the page content (recommended: 150-160 characters)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keywords
                </label>
                <input
                  type="text"
                  name="keywords"
                  value={cmsData.metadata.keywords}
                  onChange={handleMetadataChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-500"
                  placeholder="Comma-separated keywords"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Canonical URL
                </label>
                <input
                  type="text"
                  name="canonicalUrl"
                  value={cmsData.metadata.canonicalUrl}
                  onChange={handleMetadataChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-500"
                  placeholder="https://example.com/page"
                />
              </div>
            </div>
          </div>
        );
      case 'social':
        return (
          <div className="p-4">
            <h2 className="text-lg font-medium mb-6 text-gray-800">Social Sharing Information</h2>
            
            <div className="mb-8">
              <h3 className="text-md font-medium mb-4 border-b pb-2 text-gray-800">Open Graph (Facebook, LinkedIn)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OG Title
                  </label>
                  <input
                    type="text"
                    name="ogTitle"
                    value={cmsData.social.ogTitle}
                    onChange={handleSocialChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-500"
                    placeholder="Title for social sharing"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OG Description
                  </label>
                  <textarea
                    name="ogDescription"
                    value={cmsData.social.ogDescription}
                    onChange={handleSocialChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-500"
                    placeholder="Description for social sharing"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OG Image URL
                  </label>
                  <input
                    type="text"
                    name="ogImage"
                    value={cmsData.social.ogImage}
                    onChange={handleSocialChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-4 border-b pb-2 text-gray-800">Twitter</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter Card Type
                  </label>
                  <select
                    name="twitterCardType"
                    value={cmsData.social.twitterCardType}
                    onChange={handleSocialChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                  >
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary with Large Image</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter Title
                  </label>
                  <input
                    type="text"
                    name="twitterTitle"
                    value={cmsData.social.twitterTitle}
                    onChange={handleSocialChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-500"
                    placeholder="Title for Twitter"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter Description
                  </label>
                  <textarea
                    name="twitterDescription"
                    value={cmsData.social.twitterDescription}
                    onChange={handleSocialChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-500"
                    placeholder="Description for Twitter"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter Image URL
                  </label>
                  <input
                    type="text"
                    name="twitterImage"
                    value={cmsData.social.twitterImage}
                    onChange={handleSocialChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-500"
                    placeholder="https://example.com/twitter-image.jpg"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden">
      <div className="flex border-b">
        <TabButton tab="content" label="Content" />
        <TabButton tab="metadata" label="Metadata" />
        <TabButton tab="social" label="Social" />
      </div>
      
      {renderTabContent()}
      
      <div className="p-4 border-t bg-gray-50 flex justify-between">
        <button
          onClick={handleAutofill}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Fill with Example Data
        </button>
        <button
          onClick={handleOpenModal}
          className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Export .cms.json File
        </button>
      </div>
      
      <CmsModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        cmsData={cmsData}
        onSaveToRepository={handleSaveToRepository}
      />
    </div>
  );
} 