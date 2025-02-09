import * as L from 'leaflet';
import { Tool } from './tool.model';

export type DrawnFeature = {
  featureId: number;
  featureTool: string;
  featureLatlang: L.LatLng;
};
