import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { VillageData, VillageDataService } from '../../services/village-data.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-map-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './map-dashboard.component.html',
  styleUrl: './map-dashboard.component.scss'
})
export class MapDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  villages: VillageData[] = [];
  selectedVillageId = '';
  locationForm = {
    villageName: '',
    lat: 22.5,
    lng: 78.5
  };

  private map: L.Map | undefined;
  private markersLayer = L.layerGroup();
  private sub: Subscription | undefined;

  constructor(
    private readonly villageDataService: VillageDataService,
    private readonly authService: AuthService
  ) {}

  get canEdit(): boolean {
    return this.authService.isAdmin();
  }

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
      if (!Number.isFinite(village.lat) || !Number.isFinite(village.lng)) {
        return;
      }

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

  saveLocationData(): void {
    if (!this.canEdit) {
      return;
    }

    const lat = Number(this.locationForm.lat);
    const lng = Number(this.locationForm.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return;
    }

    if (this.selectedVillageId) {
      this.villageDataService.updateVillage(this.selectedVillageId, { lat, lng });
      this.resetForm();
      return;
    }

    const trimmedName = this.locationForm.villageName.trim();
    if (!trimmedName) {
      return;
    }

    this.villageDataService.addVillage({
      name: trimmedName,
      lat,
      lng,
      employment: 0,
      water: 0,
      literacy: 0
    });
    this.resetForm();
  }

  deleteVillage(villageId: string): void {
    if (!this.canEdit) {
      return;
    }

    this.villageDataService.deleteVillage(villageId);
  }

  onSelectedVillageChange(): void {
    if (!this.selectedVillageId) {
      return;
    }

    const selectedVillage = this.villages.find((village) => village.id === this.selectedVillageId);
    if (!selectedVillage) {
      return;
    }

    this.locationForm = {
      villageName: '',
      lat: selectedVillage.lat,
      lng: selectedVillage.lng
    };
  }

  focusVillage(village: VillageData): void {
    if (this.map) {
      this.map.flyTo([village.lat, village.lng], 9);
    }
  }

  private resetForm(): void {
    this.selectedVillageId = '';
    this.locationForm = {
      villageName: '',
      lat: 22.5,
      lng: 78.5
    };
  }
}
