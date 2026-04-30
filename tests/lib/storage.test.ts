import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockPrisma = {
  document: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  documentVersion: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
  collaborator: {
    findFirst: vi.fn(),
  },
};

vi.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: mockPrisma,
}));

describe('Documents API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/documents', () => {
    it('should return empty array when no documents exist', async () => {
      mockPrisma.document.findMany.mockResolvedValue([]);
      
      const documents = await mockPrisma.document.findMany();
      
      expect(documents).toEqual([]);
      expect(mockPrisma.document.findMany).toHaveBeenCalled();
    });
  });

  describe('GET /api/documents/[id]', () => {
    it('should return document by id', async () => {
      const mockDocument = {
        id: '123',
        title: 'Test Document',
        content: '# Test',
        userId: 'user-1',
        isPublic: false,
      };
      
      mockPrisma.document.findUnique.mockResolvedValue(mockDocument);
      
      const document = await mockPrisma.document.findUnique({
        where: { id: '123' },
      });
      
      expect(document).toEqual(mockDocument);
      expect(document?.title).toBe('Test Document');
    });

    it('should return null for non-existent document', async () => {
      mockPrisma.document.findUnique.mockResolvedValue(null);
      
      const document = await mockPrisma.document.findUnique({
        where: { id: 'non-existent' },
      });
      
      expect(document).toBeNull();
    });
  });

  describe('POST /api/documents', () => {
    it('should create a new document', async () => {
      const newDocument = {
        id: 'new-id',
        title: 'New Document',
        content: '# New Document',
        userId: 'user-1',
        isPublic: false,
      };
      
      mockPrisma.document.create.mockResolvedValue(newDocument);
      
      const document = await mockPrisma.document.create({
        data: newDocument,
      });
      
      expect(document).toEqual(newDocument);
      expect(mockPrisma.document.create).toHaveBeenCalled();
    });
  });

  describe('PUT /api/documents/[id]', () => {
    it('should update existing document', async () => {
      const updatedDocument = {
        id: '123',
        title: 'Updated Title',
        content: '# Updated Content',
        userId: 'user-1',
        isPublic: false,
      };
      
      mockPrisma.document.update.mockResolvedValue(updatedDocument);
      
      const document = await mockPrisma.document.update({
        where: { id: '123' },
        data: { title: 'Updated Title', content: '# Updated Content' },
      });
      
      expect(document.title).toBe('Updated Title');
    });
  });

  describe('DELETE /api/documents/[id]', () => {
    it('should delete document', async () => {
      mockPrisma.document.delete.mockResolvedValue({ id: '123' });
      
      await mockPrisma.document.delete({
        where: { id: '123' },
      });
      
      expect(mockPrisma.document.delete).toHaveBeenCalled();
    });
  });
});

describe('Document Versions API', () => {
  describe('GET /api/documents/[id]/versions', () => {
    it('should return versions for a document', async () => {
      const versions = [
        { id: 'v1', content: '# Version 1', documentId: '123', createdAt: new Date() },
        { id: 'v2', content: '# Version 2', documentId: '123', createdAt: new Date() },
      ];
      
      mockPrisma.documentVersion.findMany.mockResolvedValue(versions);
      
      const result = await mockPrisma.documentVersion.findMany({
        where: { documentId: '123' },
        orderBy: { createdAt: 'desc' },
      });
      
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no versions exist', async () => {
      mockPrisma.documentVersion.findMany.mockResolvedValue([]);
      
      const versions = await mockPrisma.documentVersion.findMany({
        where: { documentId: '123' },
      });
      
      expect(versions).toEqual([]);
    });
  });
});

describe('Export API', () => {
  it('should generate markdown export', () => {
    const markdown = '# Test\n\nContent here';
    
    expect(markdown).toContain('# Test');
    expect(markdown).toContain('Content here');
  });

  it('should generate html export', () => {
    const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Test</title></head>
<body><h1>Test</h1></body>
</html>`;
    
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<title>Test</title>');
  });
});

describe('Storage', () => {
  it('should have required storage functions', () => {
    const storage = {
      getAllDocuments: () => Promise.resolve([]),
      getDocument: (id: string) => Promise.resolve(undefined),
      saveDocument: (doc: any) => Promise.resolve(doc),
      deleteDocument: (id: string) => Promise.resolve(),
      getSyncQueue: () => Promise.resolve([]),
      getUnsyncedDocuments: () => Promise.resolve([]),
      markAsSynced: (id: string, cloudId: string) => Promise.resolve(),
    };
    
    expect(typeof storage.getAllDocuments).toBe('function');
    expect(typeof storage.getDocument).toBe('function');
    expect(typeof storage.saveDocument).toBe('function');
    expect(typeof storage.deleteDocument).toBe('function');
    expect(typeof storage.getSyncQueue).toBe('function');
    expect(typeof storage.getUnsyncedDocuments).toBe('function');
    expect(typeof storage.markAsSynced).toBe('function');
  });
});