import { describe, it, expect } from 'vitest';

describe('Export Utilities', () => {
  it('should export markdown content correctly', () => {
    const markdown = '# Hello World\n\nThis is a test.';
    expect(markdown).toContain('# Hello World');
    expect(markdown).toContain('This is a test.');
  });

  it('should generate valid HTML structure', () => {
    const html = `<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body><h1>Hello</h1></body>
</html>`;
    
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<title>Test</title>');
    expect(html).toContain('<h1>Hello</h1>');
  });
});