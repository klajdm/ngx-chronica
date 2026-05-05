import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  forwardRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewContainerRef,
  ElementRef,
  ViewChild,
  TemplateRef,
  output,
  DestroyRef,
  inject,
} from '@angular/core';

import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ChronicaTimeConfig,
  ChronicaTimeValue,
  DEFAULT_TIME_CONFIG,
  ChronicaLocale,
  CHRONICA_LOCALES,
} from '../../models/index';
import { ChronicaTimeUtils } from '../../utils/time.utils';

export interface TimePickerConfig extends Partial<ChronicaTimeConfig> {
  format24Hour?: boolean;
  showSeconds?: boolean;
  minuteStep?: number;
  secondStep?: number;
  minTime?: ChronicaTimeValue;
  maxTime?: ChronicaTimeValue;
}

@Component({
  selector: 'chronica-time-picker',
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChronicaTimePickerComponent),
      multi: true,
    },
  ],
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChronicaTimePickerComponent
  implements OnInit, OnChanges, ControlValueAccessor
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
  @Input() minTime: ChronicaTimeValue | null = null;
  @Input() maxTime: ChronicaTimeValue | null = null;

  readonly timeChange = output<ChronicaTimeValue | null>();

  // ControlValueAccessor properties
  private onChange = (value: ChronicaTimeValue | null) => {};
  private onTouched = () => {};

  // Time picker state
  private _timeValue: ChronicaTimeValue | null = null;
  isPopupOpen = false;
  private overlayRef: OverlayRef | null = null;
  private readonly destroyRef = inject(DestroyRef);

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
      this.cdr.markForCheck();
    }
  }

  private initializeTimeLists(): void {
    // Initialize hours
    this.hours = [];
    const maxHour = this.isFormat24Hour ? 23 : 12;
    const minHour = this.isFormat24Hour ? 0 : 1;

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
  writeValue(value: ChronicaTimeValue | null): void {
    if (value) {
      this._timeValue = { ...value };
      this.updateSelectedTime(value);
    } else {
      this._timeValue = null;
      this.resetToCurrentTime();
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: ChronicaTimeValue | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  private updateSelectedTime(time: ChronicaTimeValue): void {
    if (this.isFormat24Hour) {
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
    let currentTime: ChronicaTimeValue = {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
    };
    if (this.minTime && !this.isTimeValid(currentTime)) {
      currentTime = { ...this.minTime };
    } else if (this.maxTime && !this.isTimeValid(currentTime)) {
      currentTime = { ...this.maxTime };
    }
    this.updateSelectedTime(currentTime);
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

    if (!this.isFormat24Hour) {
      // Convert 12-hour to 24-hour format
      if (this.selectedPeriod === 'AM' && hours === 12) {
        hours = 0;
      } else if (this.selectedPeriod === 'PM' && hours !== 12) {
        hours += 12;
      }
    }

    const newTimeValue: ChronicaTimeValue = {
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

  private isTimeValid(time: ChronicaTimeValue): boolean {
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
    const currentTime: ChronicaTimeValue = {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: this.config.showSeconds ? now.getSeconds() : undefined,
    };

    this.writeValue(currentTime);
    this.onChange(currentTime);
    this.timeChange.emit(currentTime);
  }

  //#region Getters
  get timeValue(): ChronicaTimeValue | null {
    return this._timeValue;
  }

  get isFormat24Hour(): boolean {
    if (this.config.format24Hour !== undefined) return this.config.format24Hour;
    return this.config.timeFormat !== '12h';
  }

  get formattedTime(): string {
    if (!this._timeValue) return '';
    return ChronicaTimeUtils.formatTime(this._timeValue, this.isFormat24Hour ? '24h' : '12h');
  }

  get colorThemeClass(): string {
    return `chronica-${this.config.colorTheme || 'blue'}`;
  }

  get themeClass(): string {
    return `chronica-${this.config.theme || 'light'}`;
  }

  getCurrentLocale(): ChronicaLocale {
    if (typeof this.locale === 'string') {
      return CHRONICA_LOCALES[this.locale] || CHRONICA_LOCALES['en-US'];
    }
    return this.locale;
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
    });

    this.overlayRef = this.overlay.create(overlayConfig);
    const portal = new TemplatePortal(this.timePickerTemplate, this.viewContainerRef);
    this.overlayRef.attach(portal);

    this.overlayRef
      .backdropClick()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.closePopup());

    this.isPopupOpen = true;
    this.cdr.markForCheck();
  }

  closePopup(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.isPopupOpen = false;
    this.onTouched();
    this.cdr.markForCheck();
  }
}
