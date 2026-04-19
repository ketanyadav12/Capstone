import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModuleRecord, SummaryStat } from '../../models';
import { ModuleDataService } from '../../services/module-data.service';
import { AuthService } from '../../services/auth.service';
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
  moduleTitle = 'Module';
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
    area: '',
    status: 'Average',
    score: 0,
    updatedOn: this.getToday()
  };

  allData: ModuleRecord[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly moduleDataService: ModuleDataService,
    private readonly authService: AuthService
  ) {}

  get canEdit(): boolean {
    return this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.moduleTitle = this.route.snapshot.data['moduleType'] ?? 'Module';
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
    return this.allData.filter((row) => {
      const matchedSearch = row.area.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchedFilter = this.selectedFilter === 'All' || row.status === this.selectedFilter;
      return matchedSearch && matchedFilter;
    });
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
  }

  addRecord(): void {
    if (!this.canEdit) {
      return;
    }

    const area = this.newRecord.area.trim();
    if (!area) {
      return;
    }

    this.moduleDataService.addRecord(this.moduleTitle, {
      area,
      status: this.newRecord.status,
      score: this.clampScore(this.newRecord.score),
      updatedOn: this.newRecord.updatedOn || this.getToday()
    });

    this.newRecord = {
      area: '',
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
    const total = this.allData.length;
    const goodCount = this.allData.filter((record) => record.status === 'Good').length;
    const avgScore = Math.round(this.allData.reduce((sum, record) => sum + record.score, 0) / (total || 1));

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

  private getToday(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
