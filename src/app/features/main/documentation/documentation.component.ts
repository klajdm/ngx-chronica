import { Component } from '@angular/core';
import { LucidePin, LucideCalendarDays, LucideBarChart2, LucideClock, LucideFileText, LucideHospital, LucideGraduationCap } from '@lucide/angular';

@Component({
  selector: 'app-documentation',
  imports: [LucidePin, LucideCalendarDays, LucideBarChart2, LucideClock, LucideFileText, LucideHospital, LucideGraduationCap],
  templateUrl: './documentation.component.html',
  styleUrl: './documentation.component.css',
})
export class DocumentationComponent {}
