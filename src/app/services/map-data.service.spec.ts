import { TestBed } from '@angular/core/testing';
import { MapDataService } from './map-data.service';
import { DrawnFeature } from '../models/feature.model';
import { Layer, layerGroup } from 'leaflet';

describe('MapDataService', () => {
  let service: MapDataService;

  beforeEach(() => {
    localStorage.clear();
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');

    TestBed.configureTestingModule({});
    service = TestBed.inject(MapDataService);
  });

  it('Should add new feature', () => {
    const fakeFeature: DrawnFeature = {
      featureId: 1,
      featureTool: 'marker',
      featureLatlang: [{ lat: 31.264, lng: 34.814 }],
    };

    service.addFeature(fakeFeature, {} as any);
    expect(service.features().length).toBe(1);
    expect(service.features()[0]).toEqual(fakeFeature);
  });

  it('Should remove a new feture', () => {
    const mockFeature: DrawnFeature = {
      featureId: 2,
      featureTool: 'marker',
      featureLatlang: [{ lat: 31.264, lng: 34.814 }],
    };

    service.addFeature(mockFeature, {} as any);
    expect(service.features().length).toBe(1);

    service.deleteFeature(mockFeature);
    expect(service.features().length).toBe(0);
  });

  it('Should change to selected tool', () => {
    service.selectTool('line');
    expect(service.selectedTool()).toBe('line');

    service.selectTool('polygon');
    expect(service.selectedTool()).toBe('polygon');
  });
});
