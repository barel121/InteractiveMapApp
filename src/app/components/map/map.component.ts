import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { toolSet } from '../../utils/tools';
import { DrawnFeature } from '../../models/feature.model';
import { Tool } from '../../models/tool.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent {
  private _map!: L.Map;
  selectedTool: Tool | null = null;
  availableTools: Tool[] = toolSet;
  features: DrawnFeature[] = [];
  private drawnItems: L.FeatureGroup = L.featureGroup();
  private tempPoints: L.LatLngExpression[] = [];

  ngAfterViewInit() {
    this._map = L.map('map').setView(
      [31.264883386785765, 34.81456527201976],
      13
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this._map);
    this._map.on('click', (e: L.LeafletMouseEvent) => {
      this.handleMapClick(e.latlng);
    });
  }

  selectTool(toolName: string) {
    this.selectedTool =
      this.availableTools.find((tool) => tool.toolName === toolName) || null;
    this.tempPoints = [];
  }

  deleteFeature(selectedFeature: DrawnFeature): void {
    this._map.removeLayer(selectedFeature.featureLayer);
    console.log('deleteFeature', selectedFeature);
    this.features = this.features.filter(
      (feature) => feature.featureId != selectedFeature.featureId
    );
  }

  private handleMapClick(latlng: L.LatLng) {
    if (this.selectedTool) {
      try {
        const featureLayer = this.selectedTool.action(
          this._map,
          this.drawnItems,
          this.tempPoints,
          latlng
        );
        this.features.push({
          featureId: Date.now(),
          featureTool: this.selectedTool,
          featureLatlang: latlng,
          featureLayer: featureLayer,
        });
        console.log(this.features);
      } catch (e) {
        console.error(e);
      }
    }
  }
}
