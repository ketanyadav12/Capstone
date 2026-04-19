import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModuleRecord } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ModuleDataService {
  private readonly STORAGE_PREFIX = 'smart_village_module_data_';
  private readonly moduleSubjects = new Map<string, BehaviorSubject<ModuleRecord[]>>();

  getRecords(moduleType: string): Observable<ModuleRecord[]> {
    return this.getSubject(moduleType).asObservable();
  }

  addRecord(moduleType: string, record: Omit<ModuleRecord, 'id'>): void {
    const subject = this.getSubject(moduleType);
    const newRecord: ModuleRecord = {
      ...record,
      id: this.createId()
    };
    this.save(moduleType, [...subject.getValue(), newRecord]);
  }

  deleteRecord(moduleType: string, recordId: string): void {
    const subject = this.getSubject(moduleType);
    const filtered = subject.getValue().filter((record) => record.id !== recordId);
    this.save(moduleType, filtered);
  }

  private getSubject(moduleType: string): BehaviorSubject<ModuleRecord[]> {
    const key = this.normalizeKey(moduleType);
    const existing = this.moduleSubjects.get(key);
    if (existing) {
      return existing;
    }

    const initialData = this.readFromStorage(key);
    const subject = new BehaviorSubject<ModuleRecord[]>(initialData);
    this.moduleSubjects.set(key, subject);
    return subject;
  }

  private save(moduleType: string, records: ModuleRecord[]): void {
    const key = this.normalizeKey(moduleType);
    localStorage.setItem(`${this.STORAGE_PREFIX}${key}`, JSON.stringify(records));
    this.getSubject(moduleType).next(records);
  }

  private readFromStorage(key: string): ModuleRecord[] {
    const raw = localStorage.getItem(`${this.STORAGE_PREFIX}${key}`);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as ModuleRecord[];
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed;
    } catch {
      return [];
    }
  }

  private normalizeKey(moduleType: string): string {
    return moduleType.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  }

  private createId(): string {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}