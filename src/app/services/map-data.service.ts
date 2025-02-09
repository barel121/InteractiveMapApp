import { Injectable } from '@angular/core';
import { DrawnFeature } from '../models/feature.model';

@Injectable({
  providedIn: 'root',
})
export class MapDataService {
  constructor() {
    this.loadFeatures();
  }
  private features: DrawnFeature[] = [];
  private featureLayers = new Map<number, L.Layer>();
  initLocalStorageDb(): void {
    if (!localStorage.getItem('savedFeatures')) {
      this.saveFeatures();
    }
  }
  private loadFeatures(): DrawnFeature[] {
    try {
      const savedFeatures = localStorage.getItem('savedFeatures');
      this.features = savedFeatures ? JSON.parse(savedFeatures) : [];
    } catch (error) {
      console.error('Error parsing saved features:', error);
      this.features = [];
    }
    return this.features;
  }
  private saveFeatures(): void {
    try {
      localStorage.setItem('savedFeatures', JSON.stringify(this.features));
    } catch (error) {
      console.error('Error while saving features:', error);
    }
  }
  addFeature(feature: DrawnFeature, layer: L.Layer): void {
    this.features.push(feature);
    this.featureLayers.set(feature.featureId, layer);
    this.saveFeatures();
  }
  getFeatures(): DrawnFeature[] {
    return this.features;
  }
  deleteFeature(feature: DrawnFeature): void {
    this.features = this.features.filter(
      (f) => f.featureId !== feature.featureId
    );
    const layer = this.featureLayers.get(feature.featureId);
    if (layer) {
      layer.remove();
      this.featureLayers.delete(feature.featureId);
    }
    this.saveFeatures();
  }

  getFeatureLayers(): Map<number, L.Layer> {
    return this.featureLayers;
  }
  clearAllFeatures(): void {
    this.features = [];
    this.saveFeatures();
  }
}
