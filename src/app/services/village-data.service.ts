import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface VillageData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  employment: number;
  water: number;
  literacy: number;
}

@Injectable({
  providedIn: 'root'
})
export class VillageDataService {
  private readonly STORAGE_KEY = 'smart_village_data_store_v2';
  private readonly villagesSubject: BehaviorSubject<VillageData[]>;

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    let initialData: VillageData[] = [];
    if (saved) {
      try {
        initialData = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse village data from storage', e);
      }
    }
    this.villagesSubject = new BehaviorSubject<VillageData[]>(initialData);
  }

  getVillages(): Observable<VillageData[]> {
    return this.villagesSubject.asObservable();
  }

  getVillagesSync(): VillageData[] {
    return this.villagesSubject.getValue();
  }

  private save(data: VillageData[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    this.villagesSubject.next(data);
  }

  addVillage(village: Omit<VillageData, 'id'>): void {
    const newVillage: VillageData = {
      ...village,
      id: Math.random().toString(36).substr(2, 9)
    };
    const current = this.villagesSubject.getValue();
    this.save([...current, newVillage]);
  }

  updateVillage(id: string, data: Partial<VillageData>): void {
    const current = this.villagesSubject.getValue();
    const updated = current.map(v => v.id === id ? { ...v, ...data } : v);
    this.save(updated);
  }

  deleteVillage(id: string): void {
    const current = this.villagesSubject.getValue();
    this.save(current.filter(v => v.id !== id));
  }
}
