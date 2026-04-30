import { v4 as uuidv4 } from 'uuid';

export interface LocalDocument {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  synced: boolean;
  cloudId?: string;
}

export interface SyncQueueItem {
  id: string;
  documentId: string;
  action: 'create' | 'update' | 'delete';
  data?: Partial<LocalDocument>;
  timestamp: string;
  retries: number;
}

const DB_NAME = 'markflow-db';
const DB_VERSION = 1;
const DOCUMENTS_STORE = 'documents';
const SYNC_QUEUE_STORE = 'sync-queue';

let db: IDBDatabase | null = null;

async function openDatabase(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      if (!database.objectStoreNames.contains(DOCUMENTS_STORE)) {
        const docStore = database.createObjectStore(DOCUMENTS_STORE, { keyPath: 'id' });
        docStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        docStore.createIndex('synced', 'synced', { unique: false });
      }

      if (!database.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
        const syncStore = database.createObjectStore(SYNC_QUEUE_STORE, { keyPath: 'id' });
        syncStore.createIndex('documentId', 'documentId', { unique: false });
        syncStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

export const storage = {
  async getAllDocuments(): Promise<LocalDocument[]> {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([DOCUMENTS_STORE], 'readonly');
      const store = transaction.objectStore(DOCUMENTS_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async getDocument(id: string): Promise<LocalDocument | undefined> {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([DOCUMENTS_STORE], 'readonly');
      const store = transaction.objectStore(DOCUMENTS_STORE);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async saveDocument(doc: Omit<LocalDocument, 'createdAt' | 'updatedAt'> & { createdAt?: string }): Promise<LocalDocument> {
    const database = await openDatabase();
    const now = new Date().toISOString();
    const document: LocalDocument = {
      id: doc.id || uuidv4(),
      title: doc.title,
      content: doc.content,
      createdAt: doc.createdAt || now,
      updatedAt: now,
      synced: false,
      cloudId: doc.cloudId,
    };

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([DOCUMENTS_STORE, SYNC_QUEUE_STORE], 'readwrite');
      const store = transaction.objectStore(DOCUMENTS_STORE);
      const putRequest = store.put(document);

      putRequest.onsuccess = async () => {
        await this.addToSyncQueue(document.id, 'update', { ...document });
        resolve(document);
      };
      putRequest.onerror = () => reject(putRequest.error);
    });
  },

  async deleteDocument(id: string): Promise<void> {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([DOCUMENTS_STORE, SYNC_QUEUE_STORE], 'readwrite');
      const store = transaction.objectStore(DOCUMENTS_STORE);
      const deleteRequest = store.delete(id);

      deleteRequest.onsuccess = async () => {
        await this.addToSyncQueue(id, 'delete');
        resolve();
      };
      deleteRequest.onerror = () => reject(deleteRequest.error);
    });
  },

  async addToSyncQueue(documentId: string, action: SyncQueueItem['action'], data?: Partial<LocalDocument>): Promise<void> {
    const database = await openDatabase();
    const item: SyncQueueItem = {
      id: uuidv4(),
      documentId,
      action,
      data,
      timestamp: new Date().toISOString(),
      retries: 0,
    };

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([SYNC_QUEUE_STORE], 'readwrite');
      const store = transaction.objectStore(SYNC_QUEUE_STORE);
      const request = store.put(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([SYNC_QUEUE_STORE], 'readonly');
      const store = transaction.objectStore(SYNC_QUEUE_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async removeSyncQueueItem(id: string): Promise<void> {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([SYNC_QUEUE_STORE], 'readwrite');
      const store = transaction.objectStore(SYNC_QUEUE_STORE);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async getUnsyncedDocuments(): Promise<LocalDocument[]> {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([DOCUMENTS_STORE], 'readonly');
      const store = transaction.objectStore(DOCUMENTS_STORE);
      const index = store.index('synced');
      const range = IDBKeyRange.only(0);
      const request = index.getAll(range);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async markAsSynced(id: string, cloudId: string): Promise<void> {
    const database = await openDatabase();
    const doc = await this.getDocument(id);
    if (doc) {
      doc.synced = true;
      doc.cloudId = cloudId;

      return new Promise((resolve, reject) => {
        const transaction = database.transaction([DOCUMENTS_STORE], 'readwrite');
        const store = transaction.objectStore(DOCUMENTS_STORE);
        const request = store.put(doc);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  },
};

export async function syncWithCloud(): Promise<{ success: boolean; synced: number; failed: number }> {
  const queue = await storage.getSyncQueue();
  let synced = 0;
  let failed = 0;

  for (const item of queue) {
    try {
      let endpoint = '/api/documents';
      let method = 'POST';

      if (item.action === 'delete') {
        endpoint = `/api/documents/${item.documentId}`;
        method = 'DELETE';
      } else if (item.action === 'update') {
        endpoint = `/api/documents/${item.documentId}`;
        method = 'PUT';
      }

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: item.data ? JSON.stringify(item.data) : undefined,
      });

      if (response.ok) {
        const result = await response.json();
        if (item.data?.id) {
          await storage.markAsSynced(item.data.id, result.document?.id || item.data.id);
        }
        await storage.removeSyncQueueItem(item.id);
        synced++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error('Sync error:', error);
      failed++;
    }
  }

  return { success: failed === 0, synced, failed };
}