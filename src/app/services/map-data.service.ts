import { Injectable } from '@angular/core';
import { DrawnFeature } from '../models/feature.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapDataService {
  private featuresSubject = new BehaviorSubject<DrawnFeature[]>([]);
  features$ = this.featuresSubject.asObservable();

  private selectedFeatureSubject = new BehaviorSubject<DrawnFeature | null>(
    null
  );
  selectedFeature$ = this.selectedFeatureSubject.asObservable();

  private featureLayers = new Map<number, L.Layer>();

  constructor() {
    this.loadFeatures();
  }

  private loadFeatures() {
    try {
      const savedFeatures = localStorage.getItem('savedFeatures');
      const features: DrawnFeature[] = savedFeatures
        ? JSON.parse(savedFeatures)
        : [];
      this.featuresSubject.next(features);
    } catch (error) {
      console.error('Error parsing saved features:', error);
      this.featuresSubject.next([]);
    }
  }

  private saveFeatures(): void {
    const currentFeatures = this.featuresSubject.getValue();
    try {
      localStorage.setItem('savedFeatures', JSON.stringify(currentFeatures));
    } catch (error) {
      console.error('Error while saving features:', error);
    }
  }

  selectFeature(feature: DrawnFeature): void {
    this.selectedFeatureSubject.next(feature);
  }
  addFeature(feature: DrawnFeature, layer: L.Layer): void {
    if (!feature || !feature.featureId) {
      console.error('Invalid feature:', feature);
      return;
    }

    const currentFeatures = this.featuresSubject.getValue();
    const updatedFeatures = [...currentFeatures, feature];

    this.featuresSubject.next(updatedFeatures);
    this.featureLayers.set(feature.featureId, layer);
    this.saveFeatures();
  }

  getFeatures(): DrawnFeature[] {
    return this.featuresSubject.getValue();
  }
  deleteFeature(feature: DrawnFeature): void {
    if (!feature || !feature.featureId) {
      console.error('Invalid feature to delete:', feature);
      return;
    }

    const currentFeatures = this.featuresSubject.getValue();
    const updatedFeatures = currentFeatures.filter(
      (f) => f.featureId !== feature.featureId
    );

    const layer = this.featureLayers.get(feature.featureId);
    if (layer) {
      layer.remove();
      this.featureLayers.delete(feature.featureId);
    }

    this.featuresSubject.next(updatedFeatures);
    this.saveFeatures();
  }
  getFeatureLayers(): Map<number, L.Layer> {
    return this.featureLayers;
  }

  clearAllFeatures(): void {
    this.featuresSubject.next([]);
    this.featureLayers.clear();
    this.saveFeatures();
  }
}
