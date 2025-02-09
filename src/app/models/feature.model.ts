import * as L from 'leaflet';

export type DrawnFeature = {
  featureId: number;
  featureTool: string;
  featureLatlang: L.LatLngExpression[];
};
