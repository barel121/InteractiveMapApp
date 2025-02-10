import { Component, effect } from '@angular/core';
import { MapDataService } from '../../services/map-data.service';
import { DrawnFeature } from '../../models/feature.model';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
@Component({
  selector: 'app-feature-list',
  standalone: true,
  imports: [MatIconModule, MatRippleModule],
  templateUrl: './feature-list.component.html',
  styleUrl: './feature-list.component.css',
})
export class FeatureListComponent {
  constructor(private mapDataService: MapDataService) {
    effect(() => {
      this.features = this.mapDataService.features();
      this.selectedFeature = this.mapDataService.selectedFeature();
    });
  }
  features: DrawnFeature[] = [];
  selectedFeature: DrawnFeature | null = null;
  deleteFeature(selectedFeature: DrawnFeature): void {
    this.mapDataService.deleteFeature(selectedFeature);
  }
  selectFeature(selectedFeature: DrawnFeature): void {
    this.mapDataService.selectFeature(selectedFeature);
  }
}
