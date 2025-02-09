import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { tools, Tool } from '../../utils/tools';
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
  tools: Tool[] = tools;
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
      this.tools.find((tool) => tool.toolName === toolName) || null;
    this.tempPoints = [];
  }

  private handleMapClick(latlng: L.LatLng) {
    if (this.selectedTool) {
      this.selectedTool.action(
        this._map,
        this.drawnItems,
        this.tempPoints,
        latlng
      );
    }
  }
}
