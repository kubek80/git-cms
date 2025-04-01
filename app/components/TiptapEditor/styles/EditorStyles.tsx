import styled from 'styled-components';

const EditorContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1rem;

  figure {
    position: relative;
    cursor: grab;
    transition: all 0.2s ease;
    user-select: none;
    width: 100%;
    margin: 2rem auto;
    padding: 1rem;
    border-radius: 8px;
    box-sizing: border-box;
    background-color: #f9f9f9;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.02);
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
    }
    
    &::after {
      content: '✏️';
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: white;
      border-radius: 4px;
      padding: 4px;
      font-size: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    
    &:hover::after {
      opacity: 1;
    }
  }
  
  figcaption {
    text-align: center;
    font-style: italic;
    margin-top: 12px;
    color: #666;
    pointer-events: none;
    width: 100%;
    box-sizing: border-box;
  }
  
  img {
    display: block;
    max-width: 100%;
    width: auto;
    height: auto;
    margin: 0 auto;
    padding-top: 0.5rem;
    pointer-events: none; /* Prevent direct interaction with the image */
    -webkit-user-drag: none; /* Disable native image dragging in browsers */
    user-select: none; /* Prevent text selection on image */
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
  }
  
  .ProseMirror {
    min-height: 100px;
    padding: 0.5rem;
    &:focus {
      outline: none;
    }
    
    > * + * {
      margin-top: 0.75em;
    }
    
    h1 {
      margin-top: 0;
    }
  }
`;

export default EditorContainer; 