// Common constants for the application

// Default template for .cmsjs files
export const DEFAULT_CMSJS_TEMPLATE = `export default { // Add your CMS configuration here };`;

// Empty CMS data structure
export const EMPTY_CMS_DATA = {
  content: "",
  metadata: {
    title: "",
    description: "",
    keywords: "",
    canonicalUrl: "",
  },
  social: {
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    twitterCardType: "summary_large_image" as const,
  },
};

// Default CMS sample data for autofill
export const SAMPLE_CMS_DATA = {
  content:
    "<h1>Sample Page Title</h1><p>This is an example of content created with the GitCMS editor. You can create rich content with formatting, headings, lists, and more.</p><ul><li>Feature one</li><li>Feature two</li><li>Feature three</li></ul>",
  metadata: {
    title: "Example Page Title",
    description:
      "This is an example page description that would be used for SEO purposes. It should be informative and contain relevant keywords.",
    keywords: "example, cms, content management, seo",
    canonicalUrl: "https://example.com/sample-page",
  },
  social: {
    ogTitle: "Share This Example Page",
    ogDescription:
      "Check out this example page created with GitCMS, a lightweight content management system for developers.",
    ogImage: "https://example.com/images/social-share.jpg",
    twitterTitle: "Example Page on Twitter",
    twitterDescription:
      "This is how the page will appear when shared on Twitter. Customize this description for better engagement.",
    twitterImage: "https://example.com/images/twitter-share.jpg",
    twitterCardType: "summary_large_image" as const,
  },
};
