import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  PieController,
  ArcElement,
  Legend,
  Tooltip
} from 'chart.js';
import { SummaryStat } from '../../models';
import { VillageDataService, VillageData } from '../../services/village-data.service';
import { AiInsightService } from '../../services/ai-insight.service';
import { Subscription } from 'rxjs';
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  PieController,
  ArcElement,
  Legend,
  Tooltip
);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  insights: string[] = [];
  villages: VillageData[] = [];
  private sub = new Subscription();
  private charts: { [key: string]: Chart } = {};
  stats: SummaryStat[] = [
    {
      title: 'Total Villages',
      value: '128',
      icon: 'fa-solid fa-house-flag',
      colorClass: 'stat-blue'
    },
    {
      title: 'Employment Rate',
      value: '76%',
      icon: 'fa-solid fa-briefcase',
      colorClass: 'stat-green'
    },
    {
      title: 'Water Availability',
      value: '82%',
      icon: 'fa-solid fa-faucet-drip',
      colorClass: 'stat-cyan'
    },
    {
      title: 'Literacy Rate',
      value: '71%',
      icon: 'fa-solid fa-book-open-reader',
      colorClass: 'stat-indigo'
    }
  ];

  constructor(
    private readonly villageDataService: VillageDataService,
    private readonly aiInsightService: AiInsightService
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.villageDataService.getVillages().subscribe(data => {
        this.villages = data;
        this.updateStats();
        if (this.charts['barChart']) this.renderCharts(); // Re-render if already init
      })
    );

    this.sub.add(
      this.aiInsightService.getInsights().subscribe(data => {
        this.insights = data;
      })
    );
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
  ngAfterViewInit(): void {
    setTimeout(() => this.renderCharts(), 100);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    Object.values(this.charts).forEach(c => c.destroy());
  }

  private renderCharts(): void {
    Object.values(this.charts).forEach(c => c.destroy());

    const names = this.villages.map(v => v.name);
    const empData = this.villages.map(v => v.employment);
    
    this.charts['barChart'] = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: names,
        datasets: [
          {
            label: 'Employment %',
            data: empData,
            backgroundColor: '#2563EB'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event, elements) => {
          if (elements.length > 0) {
             const idx = elements[0].index;
             const village = this.villages[idx];
             alert(`Drill-down: Showing detailed view for ${village.name} (Simulation)`);
          }
        }
      }
    });

    this.charts['lineChart'] = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: ['2022', '2023', '2024', '2025', '2026'],
        datasets: [
          {
            label: 'Growth Trend',
            data: [45, 52, 60, 66, 74],
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            fill: true,
            tension: 0.35
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

    this.charts['pieChart'] = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: ['Agriculture', 'Education', 'Health', 'Water'],
        datasets: [
          {
            data: [38, 22, 20, 20],
            backgroundColor: ['#2563EB', '#10B981', '#60A5FA', '#34D399']
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
