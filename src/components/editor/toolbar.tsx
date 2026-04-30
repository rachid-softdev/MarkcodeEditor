'use client';

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Bold, 
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Link,
  Image,
  Code,
  Quote,
  List,
  ListOrdered,
  Table,
  Minus,
  Download,
  Share2,
  History,
  Users
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { ExportDropdown } from './export-dropdown';

interface ToolbarProps {
  content: string;
  onContentChange: (newContent: string) => void;
  documentId?: string;
  documentTitle?: string;
  onShowHistory?: () => void;
  onShowCollaborators?: () => void;
}

export function Toolbar({ content, onContentChange, documentId, documentTitle, onShowHistory, onShowCollaborators }: ToolbarProps) {
  const { t } = useTranslation();
  const [showExport, setShowExport] = useState(false);

  const insertText = useCallback((text: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + text + content.substring(end);
    
    onContentChange(newContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  }, [content, onContentChange]);

  const insertFormatting = useCallback((prefix: string, suffix: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = prefix + selectedText + suffix;
    const newContent = content.substring(0, start) + newText + content.substring(end);
    
    onContentChange(newContent);
    
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + prefix.length, end + prefix.length);
      } else {
        textarea.setSelectionRange(start + prefix.length, start + prefix.length);
      }
    }, 0);
  }, [content, onContentChange]);

  const insertAtLineStart = useCallback((prefix: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;
    
    const cursorPos = textarea.selectionStart;
    const lineStart = content.lastIndexOf('\n', cursorPos - 1) + 1;
    const newContent = content.substring(0, lineStart) + prefix + content.substring(lineStart);
    
    onContentChange(newContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length);
    }, 0);
  }, [content, onContentChange]);

  const handleBold = () => insertFormatting('**', '**');
  const handleItalic = () => insertFormatting('*', '*');
  const handleHeading1 = () => insertAtLineStart('# ');
  const handleHeading2 = () => insertAtLineStart('## ');
  const handleHeading3 = () => insertAtLineStart('### ');
  const handleLink = () => insertFormatting('[', '](url)');
  const handleImage = () => insertText('![alt text](image-url)\n');
  const handleCode = () => insertFormatting('`', '`');
  const handleQuote = () => insertAtLineStart('> ');
  const handleList = () => insertAtLineStart('- ');
  const handleListOrdered = () => insertAtLineStart('1. ');
  const handleTable = () => insertText('\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n');
  const handleHr = () => insertText('\n---\n');

  const formatButtons = [
    { icon: Bold, label: t('bold'), action: handleBold, shortcut: 'Ctrl+B' },
    { icon: Italic, label: t('italic'), action: handleItalic, shortcut: 'Ctrl+I' },
  ];

  const headingButtons = [
    { icon: Heading1, label: 'H1', action: handleHeading1, shortcut: 'Ctrl+1' },
    { icon: Heading2, label: 'H2', action: handleHeading2, shortcut: 'Ctrl+2' },
    { icon: Heading3, label: 'H3', action: handleHeading3, shortcut: 'Ctrl+3' },
  ];

  const insertButtons = [
    { icon: Link, label: t('link'), action: handleLink, shortcut: 'Ctrl+K' },
    { icon: Image, label: t('image'), action: handleImage, shortcut: 'Ctrl+Shift+I' },
    { icon: Code, label: t('code'), action: handleCode, shortcut: 'Ctrl+`' },
    { icon: Quote, label: t('quote'), action: handleQuote, shortcut: 'Ctrl+Shift+>' },
    { icon: List, label: t('list'), action: handleList, shortcut: 'Ctrl+Shift+8' },
    { icon: ListOrdered, label: 'Liste numérotée', action: handleListOrdered, shortcut: 'Ctrl+Shift+7' },
    { icon: Table, label: t('table'), action: handleTable, shortcut: 'Ctrl+Shift+T' },
    { icon: Minus, label: 'Ligne horizontale', action: handleHr, shortcut: 'Ctrl+Shift+-' },
  ];

  const actionButtons = [
    { icon: Download, label: t('export'), action: () => setShowExport(!showExport), shortcut: 'Ctrl+E' },
    { icon: Share2, label: t('share'), action: () => {}, shortcut: 'Ctrl+Shift+S' },
    { icon: History, label: t('collaboration.history') || 'Historique', action: onShowHistory || (() => {}), shortcut: 'Ctrl+H' },
    { icon: Users, label: t('share.collaborators'), action: onShowCollaborators || (() => {}), shortcut: 'Ctrl+Shift+C' },
  ];

  return (
    <div className="bg-background border-b border-border p-2">
      <TooltipProvider>
        <div className="flex items-center space-x-1 overflow-x-auto">
          <div className="flex items-center space-x-1">
            {formatButtons.map((button, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={button.action} className="h-8 w-8 p-0">
                    <button.icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <div>{button.label}</div>
                    <div className="text-xs text-muted-foreground">{button.shortcut}</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center space-x-1">
            {headingButtons.map((button, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={button.action} className="h-8 w-8 p-0">
                    <button.icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <div>{button.label}</div>
                    <div className="text-xs text-muted-foreground">{button.shortcut}</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center space-x-1">
            {insertButtons.map((button, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={button.action} className="h-8 w-8 p-0">
                    <button.icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <div>{button.label}</div>
                    <div className="text-xs text-muted-foreground">{button.shortcut}</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          <div className="flex-1" />

          <div className="flex items-center space-x-1">
            {actionButtons.map((button, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={button.action} className="gap-2">
                    <button.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{button.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <div>{button.label}</div>
                    <div className="text-xs text-muted-foreground">{button.shortcut}</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {showExport && documentId && (
            <ExportDropdown 
              documentId={documentId} 
              documentTitle={documentTitle || 'document'} 
              onClose={() => setShowExport(false)} 
            />
          )}
        </div>
      </TooltipProvider>
    </div>
  );
}