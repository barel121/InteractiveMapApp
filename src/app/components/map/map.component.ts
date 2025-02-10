import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
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
  private drawnItems: L.FeatureGroup = L.featureGroup();
  private tempPoints: L.LatLngExpression[] = [];
  private toolMap = new Map<string, Tool>();
  availableTools: Tool[] = toolSet;
  selectedTool: Tool | null = null;
  features: DrawnFeature[] = [];
  selectedFeature: DrawnFeature | null = null;

  constructor(private mapDataService: MapDataService) {
    effect(() => {
      const tool = this.mapDataService.selectedTool();
      this.selectedTool = this.toolMap.get(tool!) || null;
    });
    effect(() => {
      if (this.mapDataService.selectedFeature()) {
        this.focusOnFeature(this.mapDataService.selectedFeature()!);
      }
    });
  }

  ngOnInit() {
    this.toolMap = new Map(
      this.availableTools.map((tool) => [tool.toolName, tool])
    );
    this.features = this.mapDataService.features();
  }

  ngAfterViewInit() {
    this._map = L.map('map').setView(
      [31.264883386785765, 34.81456527201976],
      14
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this._map);

    this.loadFeaturesOnMap();

    this._map.on('click', (e: L.LeafletMouseEvent) => {
      this.handleMapClick(e.latlng);
    });
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
        this.mapDataService.getFeatureLayers().set(f.featureId, featureLayer);
      }
    });
  }

  private handleMapClick(latlng: L.LatLng) {
    if (this.selectedTool) {
      try {
        const latlngs = [...this.tempPoints, latlng];
        const featureLayer = this.selectedTool.action(
          this._map,
          this.drawnItems,
          this.tempPoints,
          latlngs
        );
        if (featureLayer && !(featureLayer instanceof L.LayerGroup)) {
          const newFeature = {
            featureId: Date.now(),
            featureTool: this.selectedTool.toolName,
            featureLatlang: latlngs,
          };
          this.mapDataService.addFeature(newFeature, featureLayer);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  focusOnFeature(feature: DrawnFeature) {
    const layer = this.mapDataService.getFeatureLayers().get(feature.featureId);
    if (layer) {
      const toolOfLayer = this.toolMap.get(feature.featureTool);
      if (toolOfLayer) {
        toolOfLayer.focus(this._map, layer);
      }
    }
  }
}
