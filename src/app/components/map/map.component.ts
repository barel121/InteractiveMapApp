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
  private drawnItems: L.FeatureGroup = L.featureGroup();
  private tempPoints: L.LatLngExpression[] = [];
  private toolMap = new Map<string, Tool>();
  selectedTool: Tool | null = null;
  availableTools: Tool[] = toolSet;
  features: DrawnFeature[] = [];

  constructor(private mapDataService: MapDataService) {}
  ngOnInit() {
    this.toolMap = new Map(
      this.availableTools.map((tool) => [tool.toolName, tool])
    );
    this.mapDataService.features$.subscribe((features) => {
      this.features = features;
    });
    this.mapDataService.selectedFeature$.subscribe((feature) => {
      if (feature) this.focusOnFeature(feature);
    });
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

  selectTool(toolName: string) {
    this.selectedTool = this.toolMap.get(toolName) || null;
    this.tempPoints = [];
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
}
