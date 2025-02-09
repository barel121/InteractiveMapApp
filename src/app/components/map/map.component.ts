import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { toolSet } from '../../utils/tools';
import { DrawnFeature } from '../../models/feature.model';
import { Tool } from '../../models/tool.model';
import { MapDataService } from '../../services/map-data.service';
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
  private toolMap = new Map<string, Tool>();

  constructor(private mapDataService: MapDataService) {}
  ngOnInit() {
    this.toolMap = new Map(
      this.availableTools.map((tool) => [tool.toolName, tool])
    );
  }
  ngAfterViewInit() {
    this._map = L.map('map').setView(
      [31.264883386785765, 34.81456527201976],
      13
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this._map);

    this.features = this.mapDataService.getFeatures();
    this.loadFeaturesOnMap();

    this._map.on('click', (e: L.LeafletMouseEvent) => {
      this.handleMapClick(e.latlng);
    });
  }

  selectTool(toolName: string) {
    this.selectedTool = this.toolMap.get(toolName) || null;
    this.tempPoints = [];
  }

  deleteFeature(selectedFeature: DrawnFeature): void {
    this.mapDataService.deleteFeature(selectedFeature);
    this.features = this.mapDataService.getFeatures();
  }
  selectFeature(selectedFeature: number): void {
    console.log(selectedFeature);
  }
  private loadFeaturesOnMap() {
    this.features.forEach((f) => {
      const tool = this.toolMap.get(f.featureTool);
      if (tool) {
        const featureLayer = tool.action(
          this._map,
          this.drawnItems,
          this.tempPoints,
          f.featureLatlang
        );
        console.log(featureLayer);
        this.mapDataService.getFeatureLayers().set(f.featureId, featureLayer);
      }
    });
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
        const newFeature = {
          featureId: Date.now(),
          featureTool: this.selectedTool.toolName,
          featureLatlang: latlng,
        };
        this.mapDataService.addFeature(newFeature, featureLayer);
        this.features = this.mapDataService.getFeatures();
      } catch (e) {
        console.error(e);
      }
    }
  }
}
