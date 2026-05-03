import { Component } from '@angular/core';
import {
  LucideSun,
  LucideMoon,
  LucideRefreshCw,
  LucideLightbulb,
  LucidePalette,
  LucideRuler,
  LucideCheck,
} from '@lucide/angular';

@Component({
  selector: 'app-styling-guide',
  imports: [LucideSun, LucideMoon, LucideRefreshCw, LucideLightbulb, LucidePalette, LucideRuler, LucideCheck],
  templateUrl: './styling-guide.component.html',
  styleUrl: './styling-guide.component.css',
})
export class StylingGuideComponent {}
