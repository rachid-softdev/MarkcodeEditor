'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  FileText, 
  Plus, 
  Search, 
  Folder, 
  Clock,
  X
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Document {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
}

interface SidebarProps {
  documents: Document[];
  activeDocumentId: string;
  onDocumentSelect: (id: string) => void;
  onCreateNew: () => void;
  onClose: () => void;
}

export function Sidebar({ 
  documents, 
  activeDocumentId, 
  onDocumentSelect, 
  onCreateNew,
  onClose 
}: SidebarProps) {
  const { t } = useTranslation();

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      className="w-80 bg-muted/30 border-r border-border flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Documents</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={onCreateNew} className="flex-1 gap-2">
            <Plus className="h-4 w-4" />
            {t('new_document')}
          </Button>
        </div>
        
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher..." 
            className="pl-10"
          />
        </div>
      </div>

      {/* Documents List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun document</p>
              <Button 
                variant="outline" 
                onClick={onCreateNew}
                className="mt-4"
              >
                Créer le premier
              </Button>
            </div>
          ) : (
            documents.map((doc) => (
              <motion.div
                key={doc.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onDocumentSelect(doc.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                  activeDocumentId === doc.id
                    ? 'bg-primary/10 border-primary/20 border'
                    : 'hover:bg-muted border border-transparent'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {doc.content.replace(/[#*`>-]/g, '').substring(0, 100)}...
                    </p>
                    <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(doc.lastModified)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          {documents.length} document{documents.length > 1 ? 's' : ''}
        </div>
      </div>
    </motion.div>
  );
}