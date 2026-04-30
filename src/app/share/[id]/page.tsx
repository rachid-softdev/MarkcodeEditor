'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const EditorLayout = dynamic(
  () => import('@/components/editor/editor-layout').then((mod) => mod.EditorLayout),
  { ssr: false, loading: () => <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div> }
);

export default function SharePage() {
  const params = useParams();
  const { t } = useTranslation();
  const [document, setDocument] = useState<{ id: string; title: string; content: string; isPublic: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetch(`/api/documents/${params.id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Document not found');
          return res.json();
        })
        .then((data) => {
          if (data.document) {
            setDocument(data.document);
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || t('common.error'));
          setLoading(false);
        });
    }
  }, [params.id, t]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{t('common.error')}</h1>
          <p className="text-muted-foreground">{error || 'Document not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="p-4 border-b bg-background/80 backdrop-blur">
        <h1 className="text-xl font-bold">{document.title}</h1>
        <p className="text-sm text-muted-foreground">{t('share.viewer')}</p>
      </div>
      <div className="p-4">
        <div className="prose dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap">{document.content}</pre>
        </div>
      </div>
    </div>
  );
}