'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FileText, Eye, Columns2 as Columns, Maximize, Plus, X, Save, MoveHorizontal as MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Toolbar } from '@/components/editor/toolbar';
import { Editor } from '@/components/editor/editor';
import { Preview } from '@/components/editor/preview';
import { TableOfContents } from '@/components/editor/table-of-contents';
import { Sidebar } from '@/components/editor/sidebar';
import { VersionHistory } from '@/components/editor/version-history';
import { CollaboratorPanel } from '@/components/editor/collaborator-panel';

interface Document {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
}

export function EditorLayout() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      title: 'Bienvenue.md',
      content: `# Bienvenue dans MarkFlow 📝

Ceci est un **éditeur Markdown** moderne avec de nombreuses fonctionnalités avancées.

## Fonctionnalités

- ✅ **Prévisualisation en temps réel**
- ✅ **Coloration syntaxique**
- ✅ **Export PDF/HTML**
- ✅ **Mode collaboratif**
- ✅ **Thèmes personnalisés**

## Code

\`\`\`javascript
const markflow = {
  name: 'MarkFlow',
  version: '1.0.0',
  features: ['realtime', 'collaborative', 'export']
};

console.log('Bienvenue dans', markflow.name);
\`\`\`

## Tableau

| Fonctionnalité | Statut | Description |
|---|---|---|
| Éditeur | ✅ | Éditeur Markdown avancé |
| Prévisualisation | ✅ | Aperçu temps réel |
| Export | ✅ | PDF, HTML, DOCX |

## Citation

> "La simplicité est la sophistication suprême." - Léonard de Vinci

---

Commencez à écrire votre contenu Markdown ici ! 🚀
`,
      lastModified: new Date(),
    }
  ]);
  
  const [activeDocumentId, setActiveDocumentId] = useState(documents[0].id);
  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'split'>('split');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const { t } = useTranslation();

  const activeDocument = documents.find(doc => doc.id === activeDocumentId);

  const updateDocumentContent = (content: string) => {
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === activeDocumentId
          ? { ...doc, content, lastModified: new Date() }
          : doc
      )
    );
  };

  const createNewDocument = () => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title: `${t('untitled')}-${documents.length + 1}.md`,
      content: `# ${t('untitled')} ${documents.length + 1}\n\n${t('loading')}...`,
      lastModified: new Date(),
    };
    
    setDocuments([...documents, newDoc]);
    setActiveDocumentId(newDoc.id);
  };

  const closeDocument = (docId: string) => {
    const updatedDocs = documents.filter(doc => doc.id !== docId);
    setDocuments(updatedDocs);
    
    if (activeDocumentId === docId && updatedDocs.length > 0) {
      setActiveDocumentId(updatedDocs[0].id);
    }
  };

  const viewModeButtons = [
    { mode: 'editor' as const, icon: FileText, label: t('editor') },
    { mode: 'preview' as const, icon: Eye, label: t('preview') },
    { mode: 'split' as const, icon: Columns, label: t('split_view') },
  ];

  if (!activeDocument) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{t('error')}</p>
          <Button onClick={createNewDocument}>
            <Plus className="w-4 h-4 mr-2" />
            {t('new_document')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && !isFullscreen && (
          <Sidebar
            documents={documents}
            activeDocumentId={activeDocumentId}
            onDocumentSelect={setActiveDocumentId}
            onCreateNew={createNewDocument}
            onClose={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Document Tabs */}
        <div className="bg-background border-b border-border">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center space-x-2 overflow-x-auto">
              {!sidebarOpen && !isFullscreen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              )}
              
              {documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  layout
                  className={`flex items-center space-x-2 px-3 py-1 rounded-t-lg cursor-pointer transition-colors ${
                    activeDocumentId === doc.id
                      ? 'bg-primary/10 text-primary border-b-2 border-primary'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setActiveDocumentId(doc.id)}
                >
                  <span className="text-sm font-medium truncate max-w-32">
                    {doc.title}
                  </span>
                  {documents.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 opacity-50 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeDocument(doc.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </motion.div>
              ))}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={createNewDocument}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* View Mode Controls */}
            <div className="flex items-center space-x-2">
              <div className="flex bg-muted rounded-lg p-1">
                {viewModeButtons.map((button) => (
                  <Button
                    key={button.mode}
                    variant={viewMode === button.mode ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode(button.mode)}
                    className="h-8 px-3"
                  >
                    <button.icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <Toolbar 
          content={activeDocument.content}
          onContentChange={updateDocumentContent}
          documentId={activeDocument.id}
          documentTitle={activeDocument.title}
          onShowHistory={() => setShowHistory(true)}
          onShowCollaborators={() => setShowCollaborators(true)}
        />

        {/* Editor Content */}
        <div className="flex-1 flex">
          <motion.div 
            className="flex-1 flex"
            layout
          >
            {/* Editor Pane */}
            {(viewMode === 'editor' || viewMode === 'split') && (
              <motion.div
                className={`${
                  viewMode === 'split' ? 'w-1/2' : 'w-full'
                } border-r border-border`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Editor
                  content={activeDocument.content}
                  onChange={updateDocumentContent}
                />
              </motion.div>
            )}

            {/* Preview Pane */}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <motion.div
                className={`${
                  viewMode === 'split' ? 'w-1/2' : 'w-full'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Preview content={activeDocument.content} />
              </motion.div>
            )}
          </motion.div>

          {/* Table of Contents */}
          {viewMode !== 'editor' && (
            <TableOfContents content={activeDocument.content} />
          )}
        </div>

        {/* Version History Panel */}
        <VersionHistory
          documentId={activeDocument.id}
          currentContent={activeDocument.content}
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          onRestore={(content) => {
            updateDocumentContent(content);
            setShowHistory(false);
          }}
        />

        {/* Collaborator Panel */}
        <CollaboratorPanel
          documentId={activeDocument.id}
          isOpen={showCollaborators}
          onClose={() => setShowCollaborators(false)}
        />
      </div>
    </div>
  );
}