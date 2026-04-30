'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, X, Loader2, Trash2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Collaborator {
  id: string;
  role: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
  };
}

interface CollaboratorPanelProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CollaboratorPanel({ documentId, isOpen, onClose }: CollaboratorPanelProps) {
  const { t } = useTranslation();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [owner, setOwner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'EDITOR' | 'VIEWER'>('EDITOR');

  useEffect(() => {
    if (isOpen && documentId) {
      setLoading(true);
      fetch(`/api/documents/${documentId}/collaborators`)
        .then((res) => res.json())
        .then((data) => {
          setCollaborators(data.collaborators || []);
          setOwner(data.owner);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen, documentId]);

  const handleAdd = async () => {
    if (!email) return;
    setAdding(true);
    try {
      const res = await fetch(`/api/documents/${documentId}/collaborators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      if (data.collaborator) {
        setCollaborators([...collaborators, data.collaborator]);
        setEmail('');
      }
    } catch (error) {
      console.error('Failed to add collaborator:', error);
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (collaboratorId: string) => {
    try {
      await fetch(`/api/documents/${documentId}/collaborators?collaboratorId=${collaboratorId}`, {
        method: 'DELETE',
      });
      setCollaborators(collaborators.filter((c) => c.id !== collaboratorId));
    } catch (error) {
      console.error('Failed to remove collaborator:', error);
    }
  };

  const getRoleLabel = (r: string) => {
    switch (r) {
      case 'OWNER': return t('collaboration.owner');
      case 'EDITOR': return t('collaboration.editor');
      case 'VIEWER': return t('collaboration.viewer');
      default: return r;
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
                <Users className="w-5 h-5" />
                {t('share.collaborators')}
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
              ) : (
                <div className="space-y-4">
                  {owner && (
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {owner.name?.[0] || owner.email[0].toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{owner.name || owner.email}</p>
                            <p className="text-xs text-muted-foreground">
                              {t('collaboration.owner')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {collaborators.map((collab) => (
                    <Card key={collab.id}>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {collab.user.name?.[0] || collab.user.email[0].toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{collab.user.name || collab.user.email}</p>
                            <p className="text-xs text-muted-foreground">
                              {getRoleLabel(collab.role)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(collab.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-3">{t('share.add_collaborator')}</p>
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder={t('share.enter_email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Button
                        className="w-full"
                        onClick={handleAdd}
                        disabled={adding || !email}
                      >
                        {adding ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <UserPlus className="w-4 h-4 mr-2" />
                        )}
                        {t('share.add_collaborator')}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}