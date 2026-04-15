import { createContext, useContext } from 'react';

const EditorContext = createContext(null);

export function EditorProvider({ children, value }) {
  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  return useContext(EditorContext);
}
