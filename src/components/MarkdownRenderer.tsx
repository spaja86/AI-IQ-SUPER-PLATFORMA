'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — Markdown Renderer
// Kompanija SPAJA — Digitalna Industrija
// Renderuje Markdown sadržaj sa syntax highlighting-om, tabelama, KaTeX matematikom

import React, { memo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback za starije browsere
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="rounded px-2 py-1 text-xs text-gray-400 transition hover:bg-gray-600 hover:text-white"
      title="Kopiraj kod"
    >
      {copied ? '✓ Kopirano' : '📋 Kopiraj'}
    </button>
  );
}

const components: Components = {
  // Code blocks with syntax highlighting and copy button
  pre({ children }) {
    // Extract text content from code element for copy functionality
    const codeElement = React.Children.toArray(children).find(
      (child): child is React.ReactElement<{ children?: React.ReactNode; className?: string }> =>
        React.isValidElement(child) && (child as React.ReactElement<{ className?: string }>).props?.className?.startsWith?.('hljs') !== undefined,
    );

    let codeText = '';
    let language = '';

    if (React.isValidElement(codeElement)) {
      const props = codeElement.props as { children?: React.ReactNode; className?: string };
      codeText = extractTextFromChildren(props.children);
      const className = props.className ?? '';
      const match = /language-(\w+)/.exec(className);
      language = match?.[1] ?? '';
    }

    return (
      <div className="group relative my-3 overflow-hidden rounded-lg border border-gray-700 bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800/60 px-4 py-2">
          <span className="text-xs font-medium text-gray-400">
            {language || 'code'}
          </span>
          <CopyButton text={codeText} />
        </div>
        <div className="overflow-x-auto p-4">
          <pre className="!m-0 !bg-transparent !p-0 text-sm">{children}</pre>
        </div>
      </div>
    );
  },

  // Inline code
  code({ children, className }) {
    const isBlock = className?.includes('hljs') || className?.includes('language-');
    if (isBlock) {
      return <code className={className}>{children}</code>;
    }
    return (
      <code className="rounded bg-gray-700/50 px-1.5 py-0.5 text-sm font-mono text-blue-300">
        {children}
      </code>
    );
  },

  // Tables
  table({ children }) {
    return (
      <div className="my-3 overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700 text-sm">
          {children}
        </table>
      </div>
    );
  },
  thead({ children }) {
    return <thead className="bg-gray-800/60">{children}</thead>;
  },
  th({ children }) {
    return (
      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
        {children}
      </th>
    );
  },
  td({ children }) {
    return <td className="px-4 py-2 text-gray-300">{children}</td>;
  },
  tr({ children }) {
    return <tr className="border-b border-gray-700/50">{children}</tr>;
  },

  // Links
  a({ children, href }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 underline decoration-blue-400/30 transition hover:text-blue-300 hover:decoration-blue-300"
      >
        {children}
      </a>
    );
  },

  // Blockquotes
  blockquote({ children }) {
    return (
      <blockquote className="my-3 border-l-4 border-blue-500/50 bg-blue-500/5 pl-4 py-2 text-gray-300 italic">
        {children}
      </blockquote>
    );
  },

  // Lists
  ul({ children }) {
    return <ul className="my-2 list-disc space-y-1 pl-6 text-gray-300">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="my-2 list-decimal space-y-1 pl-6 text-gray-300">{children}</ol>;
  },
  li({ children }) {
    return <li className="leading-relaxed">{children}</li>;
  },

  // Headings
  h1({ children }) {
    return <h1 className="mb-3 mt-4 text-xl font-bold text-white">{children}</h1>;
  },
  h2({ children }) {
    return <h2 className="mb-2 mt-3 text-lg font-bold text-white">{children}</h2>;
  },
  h3({ children }) {
    return <h3 className="mb-2 mt-3 text-base font-semibold text-white">{children}</h3>;
  },

  // Paragraphs
  p({ children }) {
    return <p className="my-1.5 leading-relaxed text-gray-200">{children}</p>;
  },

  // Horizontal rule
  hr() {
    return <hr className="my-4 border-gray-700" />;
  },

  // Strong and em
  strong({ children }) {
    return <strong className="font-semibold text-white">{children}</strong>;
  },
  em({ children }) {
    return <em className="italic text-gray-300">{children}</em>;
  },
};

function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (!children) return '';
  if (Array.isArray(children)) return children.map(extractTextFromChildren).join('');
  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode };
    return extractTextFromChildren(props.children);
  }
  return '';
}

function MarkdownRendererInner({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`markdown-body prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeHighlight, rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

const MarkdownRenderer = memo(MarkdownRendererInner);
MarkdownRenderer.displayName = 'MarkdownRenderer';

export default MarkdownRenderer;
