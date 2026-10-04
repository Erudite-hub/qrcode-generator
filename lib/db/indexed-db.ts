import Dexie, { Table } from 'dexie';
import { QRProject } from '../types/qr';

export interface AnalyticsEvent {
  id?: number;
  type: 'generate' | 'scan' | 'bulk_generate' | 'download';
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export class SmartQRDatabase extends Dexie {
  projects!: Table<QRProject, string>;
  analytics!: Table<AnalyticsEvent, number>;

  constructor() {
    super('SmartQRStudio');
    
    this.version(1).stores({
      projects: 'id, name, createdAt, updatedAt, contentType'
    });

    this.version(2).stores({
      projects: 'id, name, createdAt, updatedAt, contentType',
      analytics: '++id, type, timestamp'
    });
  }
}

export const db = new SmartQRDatabase();
