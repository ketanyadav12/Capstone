import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { VillageData, VillageDataService } from '../../services/village-data.service';
import { Subscription } from 'rxjs';

interface VillageLocation {
  name: string;
  lat: number;
  lng: number;
  employment: number;
  water: number;
  literacy: number;
}

@Component({
  selector: 'app-map-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-dashboard.component.html',
  styleUrl: './map-dashboard.component.scss'
})
export class MapDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  villages: VillageData[] = [];
  private map: L.Map | undefined;
  private markersLayer = L.layerGroup();
  private sub: Subscription | undefined;

  constructor(private readonly villageDataService: VillageDataService) {}

  ngOnInit(): void {
    this.sub = this.villageDataService.getVillages().subscribe(data => {
      this.villages = data;
      this.updateMapMarkers();
    });
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
    if (this.map) this.map.remove();
  }

  private initializeMap(): void {
    this.map = L.map('villageMap').setView([22.5, 78.5], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map!);

    this.markersLayer.addTo(this.map);
    this.updateMapMarkers();
  }

  private updateMapMarkers(): void {
    if (!this.map) return;
    this.markersLayer.clearLayers();

    this.villages.forEach((village) => {
      const score = (village.employment + village.water + village.literacy) / 3;
      const color = score >= 70 ? '#10B981' : score >= 55 ? '#F59E0B' : '#EF4444';

      const markerIcon = L.divIcon({
        html: `<span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 0 2px ${color};"></span>`,
        className: 'custom-marker',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      L.marker([village.lat, village.lng], { icon: markerIcon })
        .addTo(this.markersLayer)
        .bindPopup(`
          <strong>${village.name}</strong><br/>
          Employment Rate: ${village.employment}%<br/>
          Water Availability: ${village.water}%<br/>
          Literacy Rate: ${village.literacy}%
        `);
    });
  }

  focusVillage(village: VillageData): void {
    if (this.map) {
      this.map.flyTo([village.lat, village.lng], 9);
    }
  }
}
