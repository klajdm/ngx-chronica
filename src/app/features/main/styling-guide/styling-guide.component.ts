import { Component } from '@angular/core';
import {
  LucideSun,
  LucideMoon,
  LucideRefreshCw,
  LucideLightbulb,
  LucidePalette,
} from '@lucide/angular';

@Component({
  selector: 'app-styling-guide',
  imports: [LucideSun, LucideMoon, LucideRefreshCw],
  templateUrl: './styling-guide.component.html',
  styleUrl: './styling-guide.component.css',
})
export class StylingGuideComponent {}
