'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useTheme } from 'next-themes';

interface PreviewProps {
  content: string;
}

export function Preview({ content }: PreviewProps) {
  const { theme } = useTheme();

  const codeComponent = ({ className, children, ...rest }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const isInline = !match;
    return !isInline && match ? (
      <SyntaxHighlighter
        style={theme === 'dark' ? oneDark : {}}
        language={match[1]}
        PreTag="div"
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...rest}>
        {children}
      </code>
    );
  };

  const tableComponent = ({ children }: any) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        {children}
      </table>
    </div>
  );

  const thComponent = ({ children }: any) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted">
      {children}
    </th>
  );

  const tdComponent = ({ children }: any) => (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
      {children}
    </td>
  );

  const blockquoteComponent = ({ children }: any) => (
    <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 italic bg-muted/30 rounded-r-lg">
      {children}
    </blockquote>
  );

  const h1Component = ({ children }: any) => (
    <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground border-b border-border pb-2">
      {children}
    </h1>
  );

  const h2Component = ({ children }: any) => (
    <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">
      {children}
    </h2>
  );

  const h3Component = ({ children }: any) => (
    <h3 className="text-xl font-medium mt-4 mb-2 text-foreground">
      {children}
    </h3>
  );

  const imgComponent = ({ src, alt }: any) => (
    <motion.img
      whileHover={{ scale: 1.02 }}
      src={src}
      alt={alt}
      className="rounded-lg shadow-md max-w-full h-auto my-4"
    />
  );

  const linkComponent = ({ href, children }: any) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  );

  const ulComponent = ({ children }: any) => (
    <ul className="list-disc list-inside space-y-1 my-4">
      {children}
    </ul>
  );

  const olComponent = ({ children }: any) => (
    <ol className="list-decimal list-inside space-y-1 my-4">
      {children}
    </ol>
  );

  const liComponent = ({ children }: any) => (
    <li className="text-foreground">{children}</li>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full overflow-y-auto p-6 bg-background"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: codeComponent,
          table: tableComponent,
          th: thComponent,
          td: tdComponent,
          blockquote: blockquoteComponent,
          h1: h1Component,
          h2: h2Component,
          h3: h3Component,
          img: imgComponent,
          a: linkComponent,
          ul: ulComponent,
          ol: olComponent,
          li: liComponent,
        }}
      >
        {content || '*Aucun contenu à afficher*'}
      </ReactMarkdown>
    </motion.div>
  );
}