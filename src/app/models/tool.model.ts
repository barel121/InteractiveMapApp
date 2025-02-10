import * as L from 'leaflet';

export type Tool = {
  toolName: string;
  displayName: string;
  toolDescription: string;
  action: (
    map: L.Map,
    drawnItems: L.FeatureGroup,
    tempPoints: L.LatLngExpression[],
    latlng: L.LatLngExpression[]
  ) => L.Layer; // For seperating the action from the map component for future use without chaning the component
  focus: (map: L.Map, layer: L.Layer) => void;
};
