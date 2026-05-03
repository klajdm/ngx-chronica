import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  forwardRef,
  ChangeDetectorRef,
  ViewContainerRef,
  ElementRef,
  OnDestroy,
  ViewChild,
  TemplateRef,
} from '@angular/core';

import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ChronicaBaseConfig,
  ChronicaDurationValue,
  ChronicaLocale,
  DEFAULT_CHRONICA_CONFIG,
} from '../../models/index';

export interface DurationPickerConfig extends Partial<ChronicaBaseConfig> {
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  maxDays?: number;
  maxHours?: number;
  maxMinutes?: number;
  maxSeconds?: number;
  stepDays?: number;
  stepHours?: number;
  stepMinutes?: number;
  stepSeconds?: number;
  allowZero?: boolean;
}

@Component({
  selector: 'chronica-duration-picker',
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChronicaDurationPickerComponent),
      multi: true,
    },
  ],
  templateUrl: './duration-picker.component.html',
  styleUrls: ['./duration-picker.component.css'],
})
export class ChronicaDurationPickerComponent
  implements OnInit, OnChanges, OnDestroy, ControlValueAccessor
{
  // Use DEFAULT_CHRONICA_CONFIG spread as base for the duration picker config
  @Input() config: DurationPickerConfig = {
    ...DEFAULT_CHRONICA_CONFIG,
    showDays: false,
    showHours: true,
    showMinutes: true,
    showSeconds: false,
    maxDays: 365,
    maxHours: 23,
    maxMinutes: 59,
    maxSeconds: 59,
    stepDays: 1,
    stepHours: 1,
    stepMinutes: 1,
    stepSeconds: 1,
    allowZero: true,
  };

  // Replace CalendarLocale -> ChronicaLocale
  @Input() locale: ChronicaLocale | string = 'en-US';
  @Input() placeholder = 'Select duration';
  @Input() disabled = false;
  @Input() required = false;
  @Input() minDuration: ChronicaDurationValue | null = null;
  @Input() maxDuration: ChronicaDurationValue | null = null;

  @Output() durationChange = new EventEmitter<ChronicaDurationValue | null>();

  // ControlValueAccessor properties
  private onChange = (value: ChronicaDurationValue | null) => {};
  private onTouched = () => {};

  // Duration picker state
  private _durationValue: ChronicaDurationValue | null = null;
  isPopupOpen = false;
  private overlayRef: OverlayRef | null = null;
  private destroy$ = new Subject<void>();

  // Duration selection state
  selectedDays = 0;
  selectedHours = 0;
  selectedMinutes = 0;
  selectedSeconds = 0;

  // Duration lists for scrollable selection
  days: number[] = [];
  hours: number[] = [];
  minutes: number[] = [];
  seconds: number[] = [];

  @ViewChild('durationPickerTemplate', { static: true }) durationPickerTemplate!: TemplateRef<any>;

  constructor(
    private cdr: ChangeDetectorRef,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.initializeDurationLists();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.initializeDurationLists();
    }
    if (changes['minDuration'] || changes['maxDuration']) {
      this.cdr.detectChanges();
    }
  }

  private initializeDurationLists(): void {
    // Initialize days
    if (this.config.showDays) {
      this.days = [];
      const maxDays = this.config.maxDays || 365;
      const stepDays = this.config.stepDays || 1;
      const startDays = this.config.allowZero ? 0 : stepDays;

      for (let i = startDays; i <= maxDays; i += stepDays) {
        this.days.push(i);
      }
    }

    // Initialize hours
    if (this.config.showHours) {
      this.hours = [];
      const maxHours = this.config.maxHours || 23;
      const stepHours = this.config.stepHours || 1;
      const startHours = this.config.allowZero ? 0 : stepHours;

      for (let i = startHours; i <= maxHours; i += stepHours) {
        this.hours.push(i);
      }
    }

    // Initialize minutes
    if (this.config.showMinutes) {
      this.minutes = [];
      const maxMinutes = this.config.maxMinutes || 59;
      const stepMinutes = this.config.stepMinutes || 1;
      const startMinutes = this.config.allowZero ? 0 : stepMinutes;

      for (let i = startMinutes; i <= maxMinutes; i += stepMinutes) {
        this.minutes.push(i);
      }
    }

    // Initialize seconds
    if (this.config.showSeconds) {
      this.seconds = [];
      const maxSeconds = this.config.maxSeconds || 59;
      const stepSeconds = this.config.stepSeconds || 1;
      const startSeconds = this.config.allowZero ? 0 : stepSeconds;

      for (let i = startSeconds; i <= maxSeconds; i += stepSeconds) {
        this.seconds.push(i);
      }
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: ChronicaDurationValue | null): void {
    if (value) {
      this._durationValue = { ...value };
      this.updateSelectedDuration(value);
    } else {
      this._durationValue = null;
      this.resetDuration();
    }
    this.cdr.detectChanges();
  }

  registerOnChange(fn: (value: ChronicaDurationValue | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.detectChanges();
  }

  private updateSelectedDuration(duration: ChronicaDurationValue): void {
    this.selectedDays = duration.days || 0;
    this.selectedHours = duration.hours || 0;
    this.selectedMinutes = duration.minutes || 0;
    this.selectedSeconds = duration.seconds || 0;
  }

  private resetDuration(): void {
    this.selectedDays = 0;
    this.selectedHours = 0;
    this.selectedMinutes = 0;
    this.selectedSeconds = 0;
  }

  onDaysChange(days: number): void {
    this.selectedDays = days;
    this.updateDurationValue();
  }

  onHoursChange(hours: number): void {
    this.selectedHours = hours;
    this.updateDurationValue();
  }

  onMinutesChange(minutes: number): void {
    this.selectedMinutes = minutes;
    this.updateDurationValue();
  }

  onSecondsChange(seconds: number): void {
    this.selectedSeconds = seconds;
    this.updateDurationValue();
  }

  private updateDurationValue(): void {
    const newDurationValue: ChronicaDurationValue = {};

    if (this.config.showDays) {
      newDurationValue.days = this.selectedDays;
    }

    if (this.config.showHours) {
      newDurationValue.hours = this.selectedHours;
    }

    if (this.config.showMinutes) {
      newDurationValue.minutes = this.selectedMinutes;
    }

    if (this.config.showSeconds) {
      newDurationValue.seconds = this.selectedSeconds;
    }

    // Validate against min/max duration
    if (this.isDurationValid(newDurationValue)) {
      this._durationValue = newDurationValue;
      this.onChange(this._durationValue);
      this.durationChange.emit(this._durationValue);
    }
  }

  private isDurationValid(duration: ChronicaDurationValue): boolean {
    const totalSeconds = this.calculateTotalSeconds(duration);

    if (this.minDuration) {
      const minTotalSeconds = this.calculateTotalSeconds(this.minDuration);
      if (totalSeconds < minTotalSeconds) return false;
    }

    if (this.maxDuration) {
      const maxTotalSeconds = this.calculateTotalSeconds(this.maxDuration);
      if (totalSeconds > maxTotalSeconds) return false;
    }

    // Check if duration is zero when not allowed
    if (!this.config.allowZero && totalSeconds === 0) {
      return false;
    }

    return true;
  }

  private calculateTotalSeconds(duration: ChronicaDurationValue): number {
    const { days = 0, hours = 0, minutes = 0, seconds = 0 } = duration;
    return days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;
  }

  clearDuration(): void {
    this._durationValue = null;
    this.onChange(null);
    this.durationChange.emit(null);
    this.closePopup();
  }

  setPresetDuration(preset: ChronicaDurationValue): void {
    this.writeValue(preset);
    this.onChange(preset);
    this.durationChange.emit(preset);
  }

  // Common preset durations
  setQuickDuration(type: 'minutes' | 'hours' | 'days', value: number): void {
    const preset: ChronicaDurationValue = {};

    switch (type) {
      case 'minutes':
        preset.minutes = value;
        break;
      case 'hours':
        preset.hours = value;
        break;
      case 'days':
        preset.days = value;
        break;
    }

    this.setPresetDuration(preset);
  }

  //#region Getters
  get durationValue(): ChronicaDurationValue | null {
    return this._durationValue;
  }

  get formattedDuration(): string {
    if (!this._durationValue) return '';

    const parts: string[] = [];
    const { days, hours, minutes, seconds } = this._durationValue;

    if (this.config.showDays && days && days > 0) {
      parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
    }

    if (this.config.showHours && hours !== undefined && hours >= 0) {
      parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
    }

    if (this.config.showMinutes && minutes !== undefined && minutes >= 0) {
      parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
    }

    if (this.config.showSeconds && seconds !== undefined && seconds >= 0) {
      parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
    }

    return parts.length > 0 ? parts.join(' ') : '0 minutes';
  }

  get totalMinutes(): number {
    if (!this._durationValue) return 0;

    const { days = 0, hours = 0, minutes = 0, seconds = 0 } = this._durationValue;
    return days * 24 * 60 + hours * 60 + minutes + Math.round(seconds / 60);
  }

  get totalSeconds(): number {
    if (!this._durationValue) return 0;

    const { days = 0, hours = 0, minutes = 0, seconds = 0 } = this._durationValue;
    return days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;
  }

  // Utility methods for template
  get colorThemeClass(): string {
    return `chronica-${this.config.colorTheme || 'blue'}`;
  }

  get themeClass(): string {
    return `chronica-${this.config.theme || 'light'}`;
  }

  //#region Popup management
  openPopup(): void {
    if (this.disabled || this.isPopupOpen) return;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 14,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: -14,
        },
      ]);

    const overlayConfig = new OverlayConfig({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: [this.colorThemeClass, this.themeClass],
    });

    this.overlayRef = this.overlay.create(overlayConfig);
    const portal = new TemplatePortal(this.durationPickerTemplate, this.viewContainerRef);
    this.overlayRef.attach(portal);

    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.closePopup());

    this.isPopupOpen = true;
    this.cdr.detectChanges();
  }

  closePopup(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.isPopupOpen = false;
    this.onTouched();
    this.cdr.detectChanges();
  }

  //#region Cleanup
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }
}
