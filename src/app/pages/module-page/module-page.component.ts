import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModuleRecord, SummaryStat } from '../../models';
import { ModuleDataService } from '../../services/module-data.service';
import { AuthService } from '../../services/auth.service';
import { VillageData, VillageDataService } from '../../services/village-data.service';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-module-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './module-page.component.html',
  styleUrl: './module-page.component.scss'
})
export class ModulePageComponent implements OnInit, OnDestroy {
  private static readonly MODULE_FIELDS: Record<string, { primaryLabel: string; metricLabel: string; metricMin: number; metricMax: number }> = {
    Agriculture: { primaryLabel: 'Agriculture Area', metricLabel: 'Crop Yield (tonnes)', metricMin: 0, metricMax: 1000 },
    'Water Resources': { primaryLabel: 'Water Source Area', metricLabel: 'Supply Hours / Day', metricMin: 0, metricMax: 24 },
    Education: { primaryLabel: 'School / Institution', metricLabel: 'Students Enrolled', metricMin: 0, metricMax: 50000 },
    Health: { primaryLabel: 'Health Facility', metricLabel: 'Patients Served / Month', metricMin: 0, metricMax: 100000 }
  };

  moduleTitle = 'Module';
  villages: VillageData[] = [];
  selectedVillageId = '';
  searchTerm = '';
  selectedFilter = 'All';
  currentPage = 1;
  readonly pageSize = 5;
  private readonly sub = new Subscription();

  summaryCards: SummaryStat[] = [
    { title: 'Total Records', value: '0', icon: 'fa-solid fa-table-list', colorClass: 'bg-primary-subtle' },
    { title: 'Good Status', value: '0', icon: 'fa-solid fa-circle-check', colorClass: 'bg-success-subtle' },
    { title: 'Average Score', value: '0', icon: 'fa-solid fa-gauge-high', colorClass: 'bg-info-subtle' }
  ];

  newRecord = {
    primaryValue: '',
    metricValue: 0,
    status: 'Average',
    score: 0,
    updatedOn: this.getToday()
  };

  allData: ModuleRecord[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly moduleDataService: ModuleDataService,
    private readonly authService: AuthService,
    private readonly villageDataService: VillageDataService
  ) {}

  get canEdit(): boolean {
    return this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.moduleTitle = this.route.snapshot.data['moduleType'] ?? 'Module';

    this.sub.add(
      this.villageDataService.getVillages().subscribe((villages) => {
        this.villages = villages;
        if (this.selectedVillageId && !villages.some((village) => village.id === this.selectedVillageId)) {
          this.selectedVillageId = '';
        }
        if (!this.selectedVillageId && villages.length > 0) {
          this.selectedVillageId = villages[0].id;
        }
        this.onFilterChanged();
      })
    );

    this.sub.add(
      this.moduleDataService.getRecords(this.moduleTitle).subscribe((records) => {
        this.allData = records;
        this.currentPage = Math.min(this.currentPage, this.totalPages);
        this.refreshSummaryCards();
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get filteredData(): ModuleRecord[] {
    return this.villageScopedData.filter((row) => {
      const matchedSearch = this.getPrimaryValue(row).toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchedFilter = this.selectedFilter === 'All' || row.status === this.selectedFilter;
      return matchedSearch && matchedFilter;
    });
  }

  get primaryFieldLabel(): string {
    return this.getModuleFieldConfig().primaryLabel;
  }

  get metricFieldLabel(): string {
    return this.getModuleFieldConfig().metricLabel;
  }

  get metricMin(): number {
    return this.getModuleFieldConfig().metricMin;
  }

  get metricMax(): number {
    return this.getModuleFieldConfig().metricMax;
  }

  get selectedVillageName(): string {
    return this.villages.find((village) => village.id === this.selectedVillageId)?.name ?? '';
  }

  get selectedVillageState(): string {
    return this.villages.find((village) => village.id === this.selectedVillageId)?.state ?? '';
  }

  private get villageScopedData(): ModuleRecord[] {
    if (!this.selectedVillageId) {
      return [];
    }
    return this.allData.filter((record) => record.villageId === this.selectedVillageId);
  }

  get paginatedData(): ModuleRecord[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredData.length / this.pageSize));
  }

  previousPage(): void {
    this.currentPage = Math.max(1, this.currentPage - 1);
  }

  nextPage(): void {
    this.currentPage = Math.min(this.totalPages, this.currentPage + 1);
  }

  onFilterChanged(): void {
    this.currentPage = 1;
    this.refreshSummaryCards();
  }

  addRecord(): void {
    if (!this.canEdit) {
      return;
    }

    if (!this.selectedVillageId) {
      return;
    }

    const primaryValue = this.newRecord.primaryValue.trim();
    if (!primaryValue) {
      return;
    }

    const isAreaBasedModule = this.moduleTitle === 'Agriculture' || this.moduleTitle === 'Water Resources';

    this.moduleDataService.addRecord(this.moduleTitle, {
      villageId: this.selectedVillageId,
      villageName: this.selectedVillageName,
      villageState: this.selectedVillageState,
      area: isAreaBasedModule ? primaryValue : undefined,
      primaryValue,
      metricValue: this.clampMetric(this.newRecord.metricValue),
      status: this.newRecord.status,
      score: this.clampScore(this.newRecord.score),
      updatedOn: this.newRecord.updatedOn || this.getToday()
    });

    this.newRecord = {
      primaryValue: '',
      metricValue: 0,
      status: 'Average',
      score: 0,
      updatedOn: this.getToday()
    };
    this.onFilterChanged();
  }

  deleteRecord(recordId: string): void {
    if (!this.canEdit) {
      return;
    }

    this.moduleDataService.deleteRecord(this.moduleTitle, recordId);
  }

  private refreshSummaryCards(): void {
    const scopedData = this.villageScopedData;
    const total = scopedData.length;
    const goodCount = scopedData.filter((record) => record.status === 'Good').length;
    const avgScore = Math.round(scopedData.reduce((sum, record) => sum + record.score, 0) / (total || 1));

    this.summaryCards = [
      { title: 'Total Records', value: `${total}`, icon: 'fa-solid fa-table-list', colorClass: 'bg-primary-subtle' },
      { title: 'Good Status', value: `${goodCount}`, icon: 'fa-solid fa-circle-check', colorClass: 'bg-success-subtle' },
      { title: 'Average Score', value: `${avgScore}`, icon: 'fa-solid fa-gauge-high', colorClass: 'bg-info-subtle' }
    ];
  }

  private clampScore(score: number): number {
    if (Number.isNaN(score)) {
      return 0;
    }
    return Math.max(0, Math.min(100, score));
  }

  private clampMetric(metricValue: number): number {
    if (Number.isNaN(metricValue)) {
      return this.metricMin;
    }
    return Math.max(this.metricMin, Math.min(this.metricMax, metricValue));
  }

  getPrimaryValue(record: ModuleRecord): string {
    return record.primaryValue?.trim() || record.area?.trim() || '';
  }

  private getModuleFieldConfig(): { primaryLabel: string; metricLabel: string; metricMin: number; metricMax: number } {
    return ModulePageComponent.MODULE_FIELDS[this.moduleTitle] ?? {
      primaryLabel: 'Entry',
      metricLabel: 'Metric Value',
      metricMin: 0,
      metricMax: 100000
    };
  }

  private getToday(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
