import { Component } from '@angular/core';
import { Tool } from '../../models/tool.model';
import { toolSet } from '../../utils/tools';
import { MapDataService } from '../../services/map-data.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-tool-selector',
  standalone: true,
  imports: [MatTooltipModule, MatButtonModule, MatButtonToggleModule],
  templateUrl: './tool-selector.component.html',
  styleUrl: './tool-selector.component.css',
})
export class ToolSelectorComponent {
  availableTools: Tool[] = toolSet;
  selectedTool: string | null = null;

  constructor(private mapDataService: MapDataService) {}

  selectTool(toolName: string) {
    this.selectedTool = toolName;
    this.mapDataService.selectTool(toolName);
  }
}
