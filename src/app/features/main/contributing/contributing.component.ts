import { Component } from '@angular/core';
import {
  LucideBug,
  LucideLightbulb,
  LucideFileText,
  LucideWrench,
  LucideTrophy,
  LucideStar,
  LucideMessageCircle,
  LucideBookOpen,
  LucideCheck,
} from '@lucide/angular';

@Component({
  selector: 'app-contributing',
  imports: [
    LucideBug,
    LucideLightbulb,
    LucideFileText,
    LucideWrench,
    LucideTrophy,
    LucideStar,
    LucideMessageCircle,
    LucideBookOpen,
    LucideCheck,
  ],
  templateUrl: './contributing.component.html',
  styleUrl: './contributing.component.css',
})
export class ContributingComponent {}
