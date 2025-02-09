import * as L from 'leaflet';

export type Tool = {
  toolName: string;
  displayName: string;
  action: (
    map: L.Map,
    drawnItems: L.FeatureGroup,
    tempPoints: L.LatLngExpression[],
    latlng: L.LatLng
  ) => void; // For seperating the action from the map component for future use without chaning the component
};

export const tools: Tool[] = [
  {
    toolName: 'marker',
    displayName: 'Marker (Point of Location)',
    action: (map, drawnItems, tempPoints, latlng) => {
      L.marker(latlng).addTo(map);
    },
  },
];
