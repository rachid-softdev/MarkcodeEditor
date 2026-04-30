'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, Download, Save, Loader2 } from 'lucide-react';

const EditorLayout = dynamic(
  () => import('@/components/editor/editor-layout').then((mod) => mod.EditorLayout),
  { ssr: false, loading: () => <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div> }
);

export default function DocumentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();
  const [document, setDocument] = useState<{ id: string; title: string; content: string; isPublic: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [localContent, setLocalContent] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (params.id && session?.user) {
      fetch(`/api/documents/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.document) {
            setDocument(data.document);
            setLocalContent(data.document.content);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params.id, session]);

  const saveDocument = useCallback(async () => {
    if (!document) return;
    setSaving(true);
    await fetch(`/api/documents/${document.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: document.title, content: localContent }),
    });
    setSaving(false);
  }, [document, localContent]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (localContent !== document?.content) {
        saveDocument();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [localContent, document?.content, saveDocument]);

  const handleExport = async (format: string) => {
    const res = await fetch(`/api/export/${params.id}?format=${format}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document?.title || 'document'}.${format === 'markdown' ? 'md' : format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const togglePublic = async () => {
    if (!document) return;
    const res = await fetch('/api/share', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId: document.id, isPublic: !document.isPublic }),
    });
    const data = await res.json();
    if (data.document) {
      setDocument({ ...document, isPublic: data.document.isPublic });
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t('common.error')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <Input
          value={document.title}
          onChange={(e) => setDocument({ ...document, title: e.target.value })}
          className="max-w-md text-lg font-bold"
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={togglePublic}>
            <Share2 className="w-4 h-4 mr-2" />
            {document.isPublic ? t('share.private') : t('share.public')}
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('markdown')}>
            <Download className="w-4 h-4 mr-2" />
            {t('navigation.export')}
          </Button>
          <Button size="sm" onClick={saveDocument} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {t('common.save')}
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <EditorLayout />
      </div>
    </div>
  );
}