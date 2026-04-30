import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

function convertMarkdownToHtml(content: string): string {
  let html = content;
  
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'markdown';

    const session = await getServerSession(authOptions);

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const isOwner = session?.user?.id === document.userId;

    if (!document.isPublic && !isOwner) {
      const collaborator = await prisma.collaborator.findFirst({
        where: { documentId: id, userId: session?.user?.id },
      });

      if (!collaborator) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const filename = `${document.title.replace(/[^a-z0-9]/gi, '_')}`;

    if (format === 'markdown') {
      return new NextResponse(document.content, {
        headers: {
          'Content-Type': 'text/markdown',
          'Content-Disposition': `attachment; filename="${filename}.md"`,
        },
      });
    }

    if (format === 'html') {
      const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>${document.title}</title></head>
<body>${convertMarkdownToHtml(document.content)}</body>
</html>`;

      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `attachment; filename="${filename}.html"`,
        },
      });
    }

    if (format === 'pdf') {
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(document.content, 180);
      let y = 20;
      
      doc.setFontSize(16);
      doc.text(document.title, 15, y);
      y += 10;
      
      doc.setFontSize(11);
      for (const line of lines) {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += 6;
      }

      const pdfBuffer = doc.output('arraybuffer');
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}.pdf"`,
        },
      });
    }

    if (format === 'docx') {
      const lines = document.content.split('\n');
      const docChildren: Paragraph[] = [];

      for (const line of lines) {
        if (line.startsWith('# ')) {
          docChildren.push(
            new Paragraph({
              text: line.replace('# ', ''),
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 200 },
            })
          );
        } else if (line.startsWith('## ')) {
          docChildren.push(
            new Paragraph({
              text: line.replace('## ', ''),
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 150 },
            })
          );
        } else if (line.startsWith('### ')) {
          docChildren.push(
            new Paragraph({
              text: line.replace('### ', ''),
              heading: HeadingLevel.HEADING_3,
              spacing: { after: 100 },
            })
          );
        } else if (line.trim()) {
          docChildren.push(
            new Paragraph({
              children: [new TextRun(line)],
              spacing: { after: 100 },
            })
          );
        }
      }

      const doc = new Document({
        sections: [{
          properties: {},
          children: docChildren,
        }],
      });

      const buffer = await Packer.toBuffer(doc);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename="${filename}.docx"`,
        },
      });
    }

    return NextResponse.json({ content: document.content, title: document.title });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}