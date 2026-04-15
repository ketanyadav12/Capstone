import { Injectable } from '@angular/core';
import { VillageDataService, VillageData } from './village-data.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiInsightService {
  constructor(private readonly villageDataService: VillageDataService) {}

  getInsights(): Observable<string[]> {
    return this.villageDataService.getVillages().pipe(
      map(villages => {
        const insights: string[] = [];
        villages.forEach(v => {
          if (v.water < 60) insights.push(`Critical: Water scarcity expected in ${v.name} based on current ${v.water}% level.`);
          if (v.employment < 50) insights.push(`Warning: Low employment detected in ${v.name} (${v.employment}%).`);
          if (v.literacy >= 70 && v.employment >= 70 && v.water >= 70) insights.push(`Success: ${v.name} is performing exceptionally well!`);
        });
        if (insights.length === 0) insights.push('All villages are operating within normal parameters.');
        return insights;
      })
    );
  }
}
