import * as L from 'leaflet';

export type Tool = {
  toolName: string;
  displayName: string;
  action: (
    map: L.Map,
    drawnItems: L.FeatureGroup,
    tempPoints: L.LatLngExpression[],
    latlng: L.LatLng
  ) => L.Layer; // For seperating the action from the map component for future use without chaning the component
};
