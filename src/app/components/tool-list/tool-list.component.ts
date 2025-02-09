import { Component } from '@angular/core';
import { Tool } from '../../models/tool.model';
import { toolSet } from '../../utils/tools';
import { MapDataService } from '../../services/map-data.service';

@Component({
  selector: 'app-tool-list',
  standalone: true,
  imports: [],
  templateUrl: './tool-list.component.html',
  styleUrl: './tool-list.component.css',
})
export class ToolListComponent {
  availableTools: Tool[] = toolSet;
  selectedTool: string | null = null;

  constructor(private mapDataService: MapDataService) {}

  selectTool(toolName: string) {
    this.selectedTool = toolName;
    this.mapDataService.selectTool(toolName); // ✅ מעדכן את הכלי הנבחר ב-`MapDataService`
  }
}
