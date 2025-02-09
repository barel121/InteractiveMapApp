import * as L from 'leaflet';
import { Tool } from '../models/tool.model';

export const toolSet: Tool[] = [
  {
    toolName: 'marker',
    displayName: 'Marker (Point of Location)',
    action: (map, drawnItems, tempPoints, latlng) => {
      const marker = L.marker(latlng[0]).addTo(map);
      drawnItems.addLayer(marker);
      return marker;
    },
    focus: (map, layer) => {
      if (layer instanceof L.Marker)
        map.setView(layer.getLatLng(), map.getZoom());
    },
  },
  {
    toolName: 'line',
    displayName: 'Draw Line',
    action: (map, drawnItems, tempPoints, latlngs) => {
      if (latlngs.length > 0) {
        tempPoints.push(...latlngs);
      }
      if (tempPoints.length < 2) {
        return L.layerGroup();
      }
      const polyline = L.polyline([...tempPoints], { color: 'blue' }).addTo(
        map
      );
      drawnItems.addLayer(polyline);
      tempPoints.length = 0;
      return polyline;
    },
    focus: (map, layer) => {
      if (layer instanceof L.Polyline) map.fitBounds(layer.getBounds());
    },
  },
  {
    toolName: 'polygon',
    displayName: 'Draw Polygon',
    action: (map, drawnItems, tempPoints, latlngs) => {
      if (Array.isArray(latlngs) && latlngs.length > 0) {
        tempPoints.push(...latlngs);
      }
      if (tempPoints.length < 3) {
        return L.layerGroup();
      }
      if (tempPoints.length >= 4) {
        const polygonPoints = [...tempPoints, tempPoints[0]];
        const polygon = L.polygon(polygonPoints, { color: 'green' }).addTo(map);
        drawnItems.addLayer(polygon);
        tempPoints.length = 0;
        return polygon;
      }
      return L.layerGroup();
    },
    focus: (map, layer) => {
      if (layer instanceof L.Polygon) map.fitBounds(layer.getBounds());
    },
  },
];
