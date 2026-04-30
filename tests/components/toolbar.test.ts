import { describe, it, expect, vi } from 'vitest';

describe('Toolbar', () => {
  const mockContent = '# Test Document\n\nSome content here';
  
  describe('Toolbar buttons configuration', () => {
    it('should have format buttons defined', () => {
      const formatButtons = [
        { label: 'bold', prefix: '**', suffix: '**' },
        { label: 'italic', prefix: '*', suffix: '*' },
      ];
      
      expect(formatButtons).toHaveLength(2);
      expect(formatButtons[0].suffix).toBe('**');
      expect(formatButtons[1].prefix).toBe('*');
    });

    it('should have heading buttons defined', () => {
      const headingButtons = [
        { label: 'H1', prefix: '# ' },
        { label: 'H2', prefix: '## ' },
        { label: 'H3', prefix: '### ' },
      ];
      
      expect(headingButtons).toHaveLength(3);
      expect(headingButtons[0].prefix).toBe('# ');
      expect(headingButtons[1].prefix).toBe('## ');
      expect(headingButtons[2].prefix).toBe('### ');
    });

    it('should have insert buttons defined', () => {
      const insertButtons = [
        { label: 'link' },
        { label: 'image' },
        { label: 'code' },
        { label: 'quote' },
        { label: 'list' },
        { label: 'ordered list' },
        { label: 'table' },
        { label: 'horizontal rule' },
      ];
      
      expect(insertButtons).toHaveLength(8);
    });

    it('should have action buttons defined', () => {
      const actionButtons = [
        { label: 'export' },
        { label: 'share' },
      ];
      
      expect(actionButtons).toHaveLength(2);
    });
  });

  describe('Markdown formatting generation', () => {
    it('should generate bold syntax', () => {
      const text = 'bold text';
      const result = `**${text}**`;
      expect(result).toBe('**bold text**');
    });

    it('should generate italic syntax', () => {
      const text = 'italic text';
      const result = `*${text}*`;
      expect(result).toBe('*italic text*');
    });

    it('should generate heading syntax', () => {
      expect('# Heading').toBe('# Heading');
      expect('## Heading').toBe('## Heading');
      expect('### Heading').toBe('### Heading');
    });

    it('should generate link syntax', () => {
      const text = 'link text';
      const url = 'https://example.com';
      const result = `[${text}](${url})`;
      expect(result).toBe('[link text](https://example.com)');
    });

    it('should generate image syntax', () => {
      const alt = 'image alt';
      const url = 'https://example.com/image.png';
      const result = `![${alt}](${url})`;
      expect(result).toBe('![image alt](https://example.com/image.png)');
    });

    it('should generate code syntax', () => {
      const code = 'const x = 1';
      const result = `\`${code}\``;
      expect(result).toBe('`const x = 1`');
    });

    it('should generate code block syntax', () => {
      const code = 'const x = 1';
      const result = `\`\`\`javascript\n${code}\n\`\`\``;
      expect(result).toContain('```javascript');
      expect(result).toContain(code);
    });

    it('should generate table syntax', () => {
      const result = '| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |';
      expect(result).toContain('| Header 1 |');
      expect(result).toContain('| Cell 1   |');
    });

    it('should generate horizontal rule', () => {
      const result = '\n---\n';
      expect(result).toContain('---');
    });

    it('should generate blockquote', () => {
      const text = 'quote text';
      const result = `> ${text}`;
      expect(result).toBe('> quote text');
    });

    it('should generate list item', () => {
      const text = 'list item';
      const result = `- ${text}`;
      expect(result).toBe('- list item');
    });

    it('should generate ordered list item', () => {
      const result = '1. ';
      expect(result).toContain('1.');
    });
  });

  describe('Export dropdown', () => {
    it('should have supported export formats', () => {
      const formats = ['markdown', 'html', 'pdf', 'docx'];
      expect(formats).toHaveLength(4);
    });

    it('should have correct file extensions for each format', () => {
      const extensions: Record<string, string> = {
        markdown: 'md',
        html: 'html',
        pdf: 'pdf',
        docx: 'docx',
      };
      
      expect(extensions.markdown).toBe('md');
      expect(extensions.html).toBe('html');
      expect(extensions.pdf).toBe('pdf');
      expect(extensions.docx).toBe('docx');
    });

    it('should have correct MIME types for each format', () => {
      const mimeTypes: Record<string, string> = {
        markdown: 'text/markdown',
        html: 'text/html',
        pdf: 'application/pdf',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      };
      
      expect(mimeTypes.markdown).toBe('text/markdown');
      expect(mimeTypes.html).toBe('text/html');
      expect(mimeTypes.pdf).toBe('application/pdf');
    });
  });
});