'use client';

import { useState } from 'react';
import { FileDown, FileText, FileCode, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ExportDropdownProps {
  documentId: string;
  documentTitle: string;
  onClose?: () => void;
}

export function ExportDropdown({ documentId, documentTitle, onClose }: ExportDropdownProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleExport = async (format: 'markdown' | 'html' | 'pdf' | 'docx') => {
    setLoading(format);
    try {
      const response = await fetch(`/api/export/${documentId}?format=${format}`);
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const ext = format === 'markdown' ? 'md' : format;
      const filename = `${documentTitle.replace(/[^a-z0-9]/gi, '_')}.${ext}`;
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      onClose?.();
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <DropdownMenu open onOpenChange={(open) => !open && onClose?.()}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <FileDown className="h-4 w-4" />
          <span className="hidden sm:inline">Exporter</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleExport('markdown')}>
          <FileText className="mr-2 h-4 w-4" />
          Markdown (.md)
          {loading === 'markdown' && <span className="ml-auto">...</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('html')}>
          <FileCode className="mr-2 h-4 w-4" />
          HTML (.html)
          {loading === 'html' && <span className="ml-auto">...</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <File className="mr-2 h-4 w-4" />
          PDF (.pdf)
          {loading === 'pdf' && <span className="ml-auto">...</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('docx')}>
          <FileText className="mr-2 h-4 w-4" />
          Word (.docx)
          {loading === 'docx' && <span className="ml-auto">...</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}