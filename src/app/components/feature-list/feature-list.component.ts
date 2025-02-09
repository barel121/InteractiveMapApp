import { Component } from '@angular/core';
import { MapDataService } from '../../services/map-data.service';
import { DrawnFeature } from '../../models/feature.model';

@Component({
  selector: 'app-feature-list',
  standalone: true,
  imports: [],
  templateUrl: './feature-list.component.html',
  styleUrl: './feature-list.component.css',
})
export class FeatureListComponent {
  constructor(private mapDataService: MapDataService) {}
  features: DrawnFeature[] = [];
  selectedFeature: DrawnFeature | null = null;
  ngOnInit() {
    this.mapDataService.features$.subscribe(
      (features) => (this.features = features)
    );
    this.mapDataService.selectedFeature$.subscribe((feature) => {
      console.log(feature);
      this.selectedFeature = feature;
    });
  }
  deleteFeature(selectedFeature: DrawnFeature): void {
    this.mapDataService.deleteFeature(selectedFeature);
  }
  selectFeature(selectedFeature: DrawnFeature): void {
    this.mapDataService.selectFeature(selectedFeature);
  }
}
