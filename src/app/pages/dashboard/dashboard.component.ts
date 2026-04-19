import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SummaryStat } from '../../models';
import { VillageDataService, VillageData } from '../../services/village-data.service';
import { AiInsightService } from '../../services/ai-insight.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  insights: string[] = [];
  villages: VillageData[] = [];
  private sub = new Subscription();
  newVillageData = {
    name: '',
    employment: 0,
    water: 0,
    literacy: 0
  };

  stats: SummaryStat[] = [
    {
      title: 'Total Villages',
      value: '0',
      icon: 'fa-solid fa-house-flag',
      colorClass: 'stat-blue'
    },
    {
      title: 'Avg Employment',
      value: '0%',
      icon: 'fa-solid fa-briefcase',
      colorClass: 'stat-green'
    },
    {
      title: 'Avg Water',
      value: '0%',
      icon: 'fa-solid fa-faucet-drip',
      colorClass: 'stat-cyan'
    },
    {
      title: 'Avg Literacy',
      value: '0%',
      icon: 'fa-solid fa-book-open-reader',
      colorClass: 'stat-indigo'
    }
  ];

  constructor(
    private readonly villageDataService: VillageDataService,
    private readonly aiInsightService: AiInsightService,
    private readonly authService: AuthService
  ) {}

  get canEdit(): boolean {
    return this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.sub.add(
      this.villageDataService.getVillages().subscribe(data => {
        this.villages = data;
        this.updateStats();
      })
    );

    this.sub.add(
      this.aiInsightService.getInsights().subscribe(data => {
        this.insights = data;
      })
    );
  }

  addVillageMetrics(): void {
    if (!this.canEdit) {
      return;
    }

    const trimmedName = this.newVillageData.name.trim();
    if (!trimmedName) {
      return;
    }

    this.villageDataService.addVillage({
      name: trimmedName,
      lat: 22.5,
      lng: 78.5,
      employment: this.clampPercent(this.newVillageData.employment),
      water: this.clampPercent(this.newVillageData.water),
      literacy: this.clampPercent(this.newVillageData.literacy)
    });

    this.newVillageData = {
      name: '',
      employment: 0,
      water: 0,
      literacy: 0
    };
  }

  deleteVillage(villageId: string): void {
    if (!this.canEdit) {
      return;
    }

    this.villageDataService.deleteVillage(villageId);
  }

  private updateStats(): void {
    const totalVillages = this.villages.length;
    const avgEmp = Math.round(this.villages.reduce((a, b) => a + b.employment, 0) / (totalVillages || 1));
    const avgWat = Math.round(this.villages.reduce((a, b) => a + b.water, 0) / (totalVillages || 1));
    const avgLit = Math.round(this.villages.reduce((a, b) => a + b.literacy, 0) / (totalVillages || 1));

    this.stats = [
      { title: 'Total Villages', value: totalVillages.toString(), icon: 'fa-solid fa-house-flag', colorClass: 'stat-blue' },
      { title: 'Avg Employment', value: `${avgEmp}%`, icon: 'fa-solid fa-briefcase', colorClass: 'stat-green' },
      { title: 'Avg Water', value: `${avgWat}%`, icon: 'fa-solid fa-faucet-drip', colorClass: 'stat-cyan' },
      { title: 'Avg Literacy', value: `${avgLit}%`, icon: 'fa-solid fa-book-open-reader', colorClass: 'stat-indigo' }
    ];
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private clampPercent(value: number): number {
    if (Number.isNaN(value)) {
      return 0;
    }
    return Math.max(0, Math.min(100, value));
  }
}
