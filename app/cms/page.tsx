'use client';

import CmsEditor from '../components/CmsEditor';
import Layout from '../components/Layout';
import { CmsData } from '../components/CmsEditor';

export default function CmsPage() {
  const handleSave = (data: CmsData | string, isRawContent?: boolean) => {
    if (isRawContent && typeof data === 'string') {
      console.log('Saved raw content:', data.substring(0, 100) + '...');
    } else {
      console.log('Saved data:', data);
    }
    // In a real application, you would save this data to your backend
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">CMS Editor</h1>
        <p className="mb-8 text-gray-700">
          Create and edit content with metadata and social sharing information. The editor will 
          generate a .cmsjs file that can be used in your front-end application.
        </p>
        
        <div className="mb-6">
          <CmsEditor onSave={handleSave} />
        </div>
      </div>
    </Layout>
  );
} 