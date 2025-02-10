import { Injectable, signal } from '@angular/core';
import { DrawnFeature } from '../models/feature.model';

@Injectable({
  providedIn: 'root',
})
export class MapDataService {
  private featureLayers = new Map<number, L.Layer>();
  features = signal<DrawnFeature[]>(this.loadFeatures());
  selectedTool = signal<string | null>(null);
  selectedFeature = signal<DrawnFeature | null>(null);

  private loadFeatures(): DrawnFeature[] {
    try {
      return JSON.parse(localStorage.getItem('savedFeatures') || '[]');
    } catch (error) {
      console.error('Error parsing saved features:', error);
      return [];
    }
  }

  private saveFeatures(): void {
    try {
      localStorage.setItem('savedFeatures', JSON.stringify(this.features()));
      console.log('Saved features:', JSON.stringify(this.features()));
    } catch (error) {
      console.error('Error while saving features:', error);
    }
  }

  // Featues handling
  selectFeature(feature: DrawnFeature): void {
    this.selectedFeature.set(feature);
  }

  addFeature(feature: DrawnFeature, layer: L.Layer): void {
    if (!feature || !feature.featureId) {
      console.error('Invalid feature:', feature);
      return;
    }
    this.features.set([...this.features(), feature]);
    this.featureLayers.set(feature.featureId, layer);
    this.saveFeatures();
  }

  deleteFeature(feature: DrawnFeature): void {
    if (!feature || !feature.featureId) {
      console.error('Invalid feature to delete:', feature);
      return;
    }
    this.features.set(
      this.features().filter((f) => f.featureId !== feature.featureId)
    );
    try {
      const layer = this.featureLayers.get(feature.featureId);
      if (layer) {
        layer.remove();
      }
      this.featureLayers.delete(feature.featureId);
    } catch (error) {
      console.warn('Ignored error in deleteFeature:', error);
    }
    this.saveFeatures();
  }

  getFeatureLayers(): Map<number, L.Layer> {
    return this.featureLayers;
  }

  // Tool handeling
  selectTool(toolName: string) {
    this.selectedTool.set(toolName);
  }
}
