'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function Editor({ content, onChange }: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    noClick: true,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDrop: (acceptedFiles) => {
      setIsDragging(false);
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          const imageMarkdown = `\n![${file.name}](${imageUrl})\n`;
          
          if (textareaRef.current) {
            const textarea = textareaRef.current;
            const cursorPos = textarea.selectionStart;
            const textBefore = content.substring(0, cursorPos);
            const textAfter = content.substring(cursorPos);
            const newContent = textBefore + imageMarkdown + textAfter;
            
            onChange(newContent);
            
            // Move cursor after inserted image
            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(
                cursorPos + imageMarkdown.length,
                cursorPos + imageMarkdown.length
              );
            }, 0);
          }
        };
        reader.readAsDataURL(file);
      });
    },
  });

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          insertFormatting('**', '**');
          break;
        case 'i':
          e.preventDefault();
          insertFormatting('*', '*');
          break;
        case 'k':
          e.preventDefault();
          insertFormatting('[', '](url)');
          break;
        case '`':
          e.preventDefault();
          insertFormatting('`', '`');
          break;
      }
    }

    // Handle Tab for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      insertText('  ');
    }

    // Auto-completion for common patterns
    if (e.key === 'Enter') {
      const textarea = textareaRef.current!;
      const cursorPos = textarea.selectionStart;
      const lines = content.substring(0, cursorPos).split('\n');
      const currentLine = lines[lines.length - 1];

      // Continue lists
      const listMatch = currentLine.match(/^(\s*)([-*+]|\d+\.)\s/);
      if (listMatch) {
        e.preventDefault();
        const indent = listMatch[1];
        const marker = listMatch[2].match(/\d+/) ? '1.' : listMatch[2];
        insertText(`\n${indent}${marker} `);
      }
    }
  };

  const insertText = (text: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + text + content.substring(end);
      
      onChange(newContent);
      
      // Move cursor after inserted text
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + text.length, start + text.length);
      }, 0);
    }
  };

  const insertFormatting = (prefix: string, suffix: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const newText = prefix + selectedText + suffix;
      const newContent = content.substring(0, start) + newText + content.substring(end);
      
      onChange(newContent);
      
      // Select the content between the formatting
      setTimeout(() => {
        textarea.focus();
        if (selectedText) {
          textarea.setSelectionRange(start + prefix.length, end + prefix.length);
        } else {
          textarea.setSelectionRange(start + prefix.length, start + prefix.length);
        }
      }, 0);
    }
  };

  return (
    <div className="relative h-full" {...getRootProps()}>
      <input {...getInputProps()} />
      
      {/* Drag & Drop Overlay */}
      {isDragActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary flex items-center justify-center z-10 rounded-lg"
        >
          <div className="text-center">
            <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-lg font-medium text-primary">
              Déposez vos images ici
            </p>
            <p className="text-sm text-muted-foreground">
              Les images seront automatiquement insérées en Markdown
            </p>
          </div>
        </motion.div>
      )}

      {/* Editor */}
      <motion.textarea
        ref={textareaRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="# Commencez à écrire votre Markdown ici...

Vous pouvez utiliser:
- **Gras** et *italique*
- [Liens](https://example.com)
- `Code en ligne`
- > Citations
- - Listes à puces

Glissez-déposez des images pour les insérer automatiquement!"
        className="w-full h-full p-6 bg-transparent text-foreground placeholder:text-muted-foreground resize-none outline-none font-mono text-sm leading-6 min-h-[500px]"
        spellCheck={false}
      />

      {/* Line numbers (optional) */}
      <div className="absolute left-0 top-6 select-none pointer-events-none text-muted-foreground/30 font-mono text-sm leading-6 px-2">
        {content.split('\n').map((_, index) => (
          <div key={index} className="text-right w-8">
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
}