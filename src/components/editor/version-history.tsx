'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, RotateCcw, Trash2, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Version {
  id: string;
  content: string;
  createdAt: string;
  userId: string | null;
}

interface VersionHistoryProps {
  documentId: string;
  currentContent: string;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (content: string) => void;
}

export function VersionHistory({
  documentId,
  currentContent,
  isOpen,
  onClose,
  onRestore,
}: VersionHistoryProps) {
  const { t } = useTranslation();
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && documentId) {
      setLoading(true);
      fetch(`/api/documents/${documentId}/versions`)
        .then((res) => res.json())
        .then((data) => {
          setVersions(data.versions || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen, documentId]);

  const handleRestore = async (version: Version) => {
    setRestoring(version.id);
    try {
      const res = await fetch(`/api/documents/${documentId}/versions/${version.id}`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (data.document) {
        onRestore(data.document.content);
      }
    } catch (error) {
      console.error('Failed to restore version:', error);
    } finally {
      setRestoring(null);
    }
  };

  const handleDelete = async (versionId: string) => {
    if (!confirm(t('editor.delete_confirm'))) return;
    
    try {
      await fetch(`/api/documents/${documentId}/versions/${versionId}`, {
        method: 'DELETE',
      });
      setVersions(versions.filter((v) => v.id !== versionId));
    } catch (error) {
      console.error('Failed to delete version:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed right-0 top-0 h-full w-80 bg-background border-l border-border shadow-lg z-50"
        >
          <div className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between py-4 border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5" />
                {t('collaboration.history') || 'Historique'}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>

            <ScrollArea className="flex-1 p-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : versions.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>{t('common.no_results') || 'Aucune version'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {versions.map((version, index) => (
                    <motion.div
                      key={version.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(version.createdAt).toLocaleString()}
                            </span>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRestore(version)}
                                disabled={restoring === version.id}
                                title={t('editor.restore') || 'Restaurer'}
                              >
                                {restoring === version.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <RotateCcw className="w-3 h-3" />
                                )}
                              </Button>
                              {index > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(version.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <p className="text-sm line-clamp-3 text-muted-foreground">
                            {version.content.substring(0, 100)}
                            {version.content.length > 100 ? '...' : ''}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}