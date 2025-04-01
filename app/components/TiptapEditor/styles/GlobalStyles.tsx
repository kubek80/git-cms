import React, { useEffect } from 'react';

/**
 * Component that adds global styles for the editor through JavaScript
 */
const GlobalStyles: React.FC = () => {
  useEffect(() => {
    // Create a style element for global CSS
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      .ProseMirror figure {
        cursor: grab !important;
        width: 100% !important;
        margin: 2rem auto !important;
        padding: 1rem !important;
        border-radius: 8px !important;
        transition: all 0.2s ease !important;
        box-sizing: border-box !important; 
        background-color: #f9f9f9 !important;
      }
      
      .ProseMirror figure:hover {
        background-color: rgba(0, 0, 0, 0.02) !important;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3) !important;
      }
      
      .ProseMirror figure img {
        pointer-events: none !important;
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
        user-select: none !important;
        display: block !important;
        max-width: 100% !important;
        width: auto !important;
        height: auto !important;
        margin: 0 auto !important;
        padding-top: 0.5rem !important;
        border-radius: 4px !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
        box-sizing: border-box !important;
      }
      
      .ProseMirror figure figcaption {
        pointer-events: none !important;
        text-align: center !important;
        font-style: italic !important;
        margin-top: 12px !important;
        color: #666 !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      
      /* While dragging */
      .ProseMirror-selectednode {
        outline: 2px solid #3b82f6 !important;
      }
      
      /* Edit button that appears on hover */
      .ProseMirror figure::after {
        content: "✏️" !important;
        position: absolute !important;
        top: 10px !important;
        right: 10px !important;
        background-color: white !important;
        border-radius: 4px !important;
        padding: 4px !important;
        font-size: 12px !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        opacity: 0 !important;
        transition: opacity 0.2s ease !important;
        z-index: 10 !important;
      }
      
      .ProseMirror figure:hover::after {
        opacity: 1 !important;
      }
      
      /* Make icons in controls darker */
      .bg-white svg {
        stroke: #333 !important;
        stroke-width: 2.5px !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Clean up
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // This component doesn't render anything, it just adds global styles
  return null;
};

export default GlobalStyles; 