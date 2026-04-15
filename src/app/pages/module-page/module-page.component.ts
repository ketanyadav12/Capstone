import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
} from 'chart.js';
import { ModuleRecord, SummaryStat } from '../../models';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

@Component({
  selector: 'app-module-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './module-page.component.html',
  styleUrl: './module-page.component.scss'
})
export class ModulePageComponent implements OnInit, AfterViewInit {
  moduleTitle = 'Module';
  searchTerm = '';
  selectedFilter = 'All';
  currentPage = 1;
  readonly pageSize = 5;

  summaryCards: SummaryStat[] = [];

  allData: ModuleRecord[] = [
    { area: 'North Cluster', status: 'Good', score: 84, updatedOn: '2026-03-11' },
    { area: 'South Cluster', status: 'Average', score: 67, updatedOn: '2026-03-10' },
    { area: 'East Cluster', status: 'Good', score: 79, updatedOn: '2026-03-09' },
    { area: 'West Cluster', status: 'Poor', score: 52, updatedOn: '2026-03-09' },
    { area: 'Central Cluster', status: 'Average', score: 63, updatedOn: '2026-03-08' },
    { area: 'Hill Zone', status: 'Good', score: 81, updatedOn: '2026-03-07' },
    { area: 'River Belt', status: 'Average', score: 69, updatedOn: '2026-03-06' }
  ];

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.moduleTitle = this.route.snapshot.data['moduleType'] ?? 'Module';
    this.summaryCards = this.getSummaryCards(this.moduleTitle);
  }

  ngAfterViewInit(): void {
    this.renderModuleChart();
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

  private getSummaryCards(moduleTitle: string): SummaryStat[] {
    if (moduleTitle === 'Health') {
      return [
        { title: 'Vaccination Rate', value: '88%', icon: 'fa-solid fa-syringe', colorClass: 'bg-success-subtle' },
        { title: 'Disease Cases', value: '142', icon: 'fa-solid fa-virus', colorClass: 'bg-danger-subtle' },
        { title: 'Hospital Access', value: '64%', icon: 'fa-solid fa-hospital', colorClass: 'bg-primary-subtle' }
      ];
    }

    if (moduleTitle === 'Education') {
      return [
        { title: 'School Enrollment', value: '91%', icon: 'fa-solid fa-school', colorClass: 'bg-primary-subtle' },
        { title: 'Dropout Cases', value: '37', icon: 'fa-solid fa-user-minus', colorClass: 'bg-warning-subtle' },
        { title: 'Teacher Availability', value: '72%', icon: 'fa-solid fa-chalkboard-user', colorClass: 'bg-success-subtle' }
      ];
    }

    if (moduleTitle === 'Agriculture') {
      return [
        { title: 'Crop Yield', value: '74%', icon: 'fa-solid fa-wheat-awn', colorClass: 'bg-success-subtle' },
        { title: 'Irrigation Coverage', value: '69%', icon: 'fa-solid fa-tractor', colorClass: 'bg-primary-subtle' },
        { title: 'Farmer Training', value: '58%', icon: 'fa-solid fa-people-group', colorClass: 'bg-info-subtle' }
      ];
    }

    return [
      { title: 'Water Purity', value: '81%', icon: 'fa-solid fa-filter', colorClass: 'bg-success-subtle' },
      { title: 'Supply Interruptions', value: '22', icon: 'fa-solid fa-ban', colorClass: 'bg-danger-subtle' },
      { title: 'Storage Capacity', value: '67%', icon: 'fa-solid fa-database', colorClass: 'bg-primary-subtle' }
    ];
  }

  private renderModuleChart(): void {
    new Chart('moduleChart', {
      type: 'bar',
      data: {
        labels: this.allData.map((item) => item.area),
        datasets: [
          {
            label: `${this.moduleTitle} Score`,
            data: this.allData.map((item) => item.score),
            backgroundColor: '#2563EB'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}
