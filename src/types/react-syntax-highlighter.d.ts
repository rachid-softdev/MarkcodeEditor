declare module 'react-syntax-highlighter' {
  import * as React from 'react';
  
  export interface SyntaxHighlighterProps {
    children: string;
    style?: { [key: string]: React.CSSProperties };
    language?: string;
    PreTag?: string;
    className?: string;
    customStyle?: React.CSSProperties;
  }
  
  export class Prism extends React.Component<SyntaxHighlighterProps> {}
}

declare module 'react-syntax-highlighter/dist/cjs/styles/prism' {
  import { CSSProperties } from 'react';
  export const oneDark: { [key: string]: CSSProperties };
}