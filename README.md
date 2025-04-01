# GitCMS

GitCMS is a lightweight, Git-based content management system that creates JSON files for your content. It provides an easy-to-use interface for creating and editing content, with metadata for SEO and social sharing.

## Features

- Rich text editor powered by Tiptap
- Separate tabs for content, metadata, and social sharing information
- Exports content as JSON (.cms.json) files
- Easy integration with your front-end application
- Version control through Git

## Getting Started

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/gitcms.git
   cd gitcms
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000/cms](http://localhost:3000/cms) in your browser to access the CMS editor.

## Using the CMS Editor

The CMS Editor has three tabs:

1. **Content**: This is where you create and edit your content using a rich text editor.
2. **Metadata**: Add SEO-related information like title, description, keywords, and canonical URL.
3. **Social**: Configure how your content appears when shared on social media platforms.

After filling in the necessary information, click the "Export .cms.json File" button to download your content as a JSON file.

## .cms.json File Format

The exported .cms.json file has the following structure:

```json
{
  "content": "<p>Your content here...</p>",
  
  "metadata": {
    "title": "Page Title",
    "description": "Page description",
    "keywords": "comma, separated, keywords",
    "canonicalUrl": "https://example.com/page"
  },
  
  "social": {
    "ogTitle": "Title for social sharing",
    "ogDescription": "Description for social sharing",
    "ogImage": "https://example.com/image.jpg",
    "twitterTitle": "Title for Twitter",
    "twitterDescription": "Description for Twitter",
    "twitterImage": "https://example.com/twitter-image.jpg",
    "twitterCardType": "summary_large_image"
  }
}
```

## Importing Content in Your Application

You can import the .cms.json file in your application:

```javascript
// Using fetch to load the JSON file
fetch('/content.cms.json')
  .then(response => response.json())
  .then(data => {
    // Access content
    console.log(data.content);

    // Access metadata
    console.log(data.metadata.title);

    // Access social information
    console.log(data.social.ogTitle);
  });
```

## License

MIT
