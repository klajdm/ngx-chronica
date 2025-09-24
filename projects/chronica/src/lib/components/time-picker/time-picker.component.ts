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
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChronicaTimeConfig,
  ChronicaTimeValue,
  DEFAULT_TIME_CONFIG,
  ChronicaLocale,
} from '../../models/index';

export type TimeValue = ChronicaTimeValue;

export interface TimePickerConfig extends Partial<ChronicaTimeConfig> {
  format24Hour?: boolean;
  showSeconds?: boolean;
  minuteStep?: number;
  secondStep?: number;
  minTime?: TimeValue;
  maxTime?: TimeValue;
}

@Component({
  selector: 'chronica-time-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChronicaTimePickerComponent),
      multi: true,
    },
  ],
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css'],
})
export class ChronicaTimePickerComponent
  implements OnInit, OnChanges, OnDestroy, ControlValueAccessor
{
  @Input() config: TimePickerConfig = {
    ...DEFAULT_TIME_CONFIG,
    format24Hour: true,
    showSeconds: false,
    minuteStep: 1,
    secondStep: 1,
  };
  @Input() locale: ChronicaLocale | string = 'en-US';
  @Input() placeholder = 'Select time';
  @Input() disabled = false;
  @Input() required = false;
  @Input() minTime: TimeValue | null = null;
  @Input() maxTime: TimeValue | null = null;

  @Output() timeChange = new EventEmitter<TimeValue | null>();

  // ControlValueAccessor properties
  private onChange = (value: TimeValue | null) => {};
  private onTouched = () => {};

  // Time picker state
  private _timeValue: TimeValue | null = null;
  isPopupOpen = false;
  private overlayRef: OverlayRef | null = null;

  // Time selection state
  selectedHour = 0;
  selectedMinute = 0;
  selectedSecond = 0;
  selectedPeriod: 'AM' | 'PM' = 'AM';

  // Time lists for scrollable selection
  hours: number[] = [];
  minutes: number[] = [];
  seconds: number[] = [];

  @ViewChild('timePickerTemplate', { static: true }) timePickerTemplate!: TemplateRef<any>;

  constructor(
    private cdr: ChangeDetectorRef,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.initializeTimeLists();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.initializeTimeLists();
    }
    if (changes['minTime'] || changes['maxTime']) {
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }

  private initializeTimeLists(): void {
    // Initialize hours
    this.hours = [];
    const maxHour = this.config.format24Hour ? 23 : 12;
    const minHour = this.config.format24Hour ? 0 : 1;

    for (let i = minHour; i <= maxHour; i++) {
      this.hours.push(i);
    }

    // Initialize minutes
    this.minutes = [];
    const minuteStep = this.config.minuteStep || 1;
    for (let i = 0; i < 60; i += minuteStep) {
      this.minutes.push(i);
    }

    // Initialize seconds (if enabled)
    if (this.config.showSeconds) {
      this.seconds = [];
      const secondStep = this.config.secondStep || 1;
      for (let i = 0; i < 60; i += secondStep) {
        this.seconds.push(i);
      }
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: TimeValue | null): void {
    if (value) {
      this._timeValue = { ...value };
      this.updateSelectedTime(value);
    } else {
      this._timeValue = null;
      this.resetToCurrentTime();
    }
    this.cdr.detectChanges();
  }

  registerOnChange(fn: (value: TimeValue | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.detectChanges();
  }

  private updateSelectedTime(time: TimeValue): void {
    if (this.config.format24Hour) {
      this.selectedHour = time.hours;
    } else {
      // Convert 24-hour to 12-hour format
      if (time.hours === 0) {
        this.selectedHour = 12;
        this.selectedPeriod = 'AM';
      } else if (time.hours < 12) {
        this.selectedHour = time.hours;
        this.selectedPeriod = 'AM';
      } else if (time.hours === 12) {
        this.selectedHour = 12;
        this.selectedPeriod = 'PM';
      } else {
        this.selectedHour = time.hours - 12;
        this.selectedPeriod = 'PM';
      }
    }

    this.selectedMinute = time.minutes;
    this.selectedSecond = time.seconds || 0;
  }

  private resetToCurrentTime(): void {
    const now = new Date();
    const currentTime: TimeValue = {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
    };
    this.updateSelectedTime(currentTime);
  }

  get timeValue(): TimeValue | null {
    return this._timeValue;
  }

  get formattedTime(): string {
    if (!this._timeValue) return '';

    const { hours, minutes, seconds } = this._timeValue;

    if (this.config.format24Hour) {
      const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      return this.config.showSeconds
        ? `${timeStr}:${(seconds || 0).toString().padStart(2, '0')}`
        : timeStr;
    } else {
      const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const period = hours < 12 ? 'AM' : 'PM';
      const timeStr = `${displayHour}:${minutes.toString().padStart(2, '0')}`;
      const fullTimeStr = this.config.showSeconds
        ? `${timeStr}:${(seconds || 0).toString().padStart(2, '0')}`
        : timeStr;
      return `${fullTimeStr} ${period}`;
    }
  }

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
    });

    this.overlayRef = this.overlay.create(overlayConfig);
    const portal = new TemplatePortal(this.timePickerTemplate, this.viewContainerRef);
    this.overlayRef.attach(portal);

    this.overlayRef.backdropClick().subscribe(() => {
      this.closePopup();
    });

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

  onHourChange(hour: number): void {
    this.selectedHour = hour;
    this.updateTimeValue();
  }

  onMinuteChange(minute: number): void {
    this.selectedMinute = minute;
    this.updateTimeValue();
  }

  onSecondChange(second: number): void {
    this.selectedSecond = second;
    this.updateTimeValue();
  }

  onPeriodChange(period: 'AM' | 'PM'): void {
    this.selectedPeriod = period;
    this.updateTimeValue();
  }

  private updateTimeValue(): void {
    let hours = this.selectedHour;

    if (!this.config.format24Hour) {
      // Convert 12-hour to 24-hour format
      if (this.selectedPeriod === 'AM' && hours === 12) {
        hours = 0;
      } else if (this.selectedPeriod === 'PM' && hours !== 12) {
        hours += 12;
      }
    }

    const newTimeValue: TimeValue = {
      hours,
      minutes: this.selectedMinute,
      seconds: this.config.showSeconds ? this.selectedSecond : undefined,
    };

    // Validate against min/max time
    if (this.isTimeValid(newTimeValue)) {
      this._timeValue = newTimeValue;
      this.onChange(this._timeValue);
      this.timeChange.emit(this._timeValue);
    }
  }

  private isTimeValid(time: TimeValue): boolean {
    if (this.minTime) {
      const minTotalMinutes = this.minTime.hours * 60 + this.minTime.minutes;
      const timeTotalMinutes = time.hours * 60 + time.minutes;
      if (timeTotalMinutes < minTotalMinutes) return false;
    }

    if (this.maxTime) {
      const maxTotalMinutes = this.maxTime.hours * 60 + this.maxTime.minutes;
      const timeTotalMinutes = time.hours * 60 + time.minutes;
      if (timeTotalMinutes > maxTotalMinutes) return false;
    }

    return true;
  }

  clearTime(): void {
    this._timeValue = null;
    this.onChange(null);
    this.timeChange.emit(null);
    this.closePopup();
  }

  setCurrentTime(): void {
    const now = new Date();
    const currentTime: TimeValue = {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: this.config.showSeconds ? now.getSeconds() : undefined,
    };

    this.writeValue(currentTime);
    this.onChange(currentTime);
    this.timeChange.emit(currentTime);
  }

  // Utility methods for template
  get colorThemeClass(): string {
    return `chronica-${this.config.colorTheme || 'blue'}`;
  }

  get themeClass(): string {
    return `chronica-${this.config.theme || 'light'}`;
  }
}
