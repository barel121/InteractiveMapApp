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
  addFeature(feature: DrawnFeature): void {
    this.features.push(feature);
    this.saveFeatures();
  }
  getFeatures(): DrawnFeature[] {
    return this.features;
  }
  deleteFeature(feature: DrawnFeature): void {
    this.features = this.features.filter(
      (f) => f.featureId !== feature.featureId
    );
    this.saveFeatures();
  }
  clearAllFeatures(): void {
    this.features = [];
    this.saveFeatures();
  }
}
