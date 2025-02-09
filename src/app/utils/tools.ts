import * as L from 'leaflet';
import { Tool } from '../models/tool.model';

export const toolSet: Tool[] = [
  {
    toolName: 'marker',
    displayName: 'Marker (Point of Location)',
    action: (map, drawnItems, tempPoints, latlng) => {
      const marker = L.marker(latlng).addTo(map);
      return marker;
    },
  },
];
