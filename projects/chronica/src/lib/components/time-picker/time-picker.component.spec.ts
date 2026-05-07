import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { ChronicaTimePickerComponent, TimePickerConfig } from './time-picker.component';
import { CHRONICA_LOCALES, ChronicaTimeValue } from '../../models';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const tv = (hours: number, minutes: number, seconds = 0): ChronicaTimeValue => ({
  hours,
  minutes,
  seconds,
});

@Component({
  standalone: true,
  imports: [ChronicaTimePickerComponent, ReactiveFormsModule],
  template: `<chronica-time-picker [formControl]="ctrl"></chronica-time-picker>`,
})
class TestHostComponent {
  ctrl = new FormControl<ChronicaTimeValue | null>(null);
}

// ─── Specs ────────────────────────────────────────────────────────────────────
describe('ChronicaTimePickerComponent', () => {
  let fixture: ComponentFixture<ChronicaTimePickerComponent>;
  let component: ChronicaTimePickerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChronicaTimePickerComponent, OverlayModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ChronicaTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Creation ─────────────────────────────────────────────────────────────────
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initialises with no selected time', () => {
    expect(component.timeValue).toBeNull();
  });

  it('hours array is populated on init', () => {
    expect(component.hours.length).toBeGreaterThan(0);
  });

  it('minutes array is populated on init', () => {
    expect(component.minutes.length).toBeGreaterThan(0);
  });

  it('defaults to 24-hour format', () => {
    expect(component.isFormat24Hour).toBeTrue();
  });

  // ── ControlValueAccessor ──────────────────────────────────────────────────────
  describe('ControlValueAccessor', () => {
    it('writeValue sets the time', () => {
      component.writeValue(tv(14, 30));
      expect(component.timeValue?.hours).toBe(14);
      expect(component.timeValue?.minutes).toBe(30);
    });

    it('writeValue null clears the time', () => {
      component.writeValue(tv(14, 30));
      component.writeValue(null);
      expect(component.timeValue).toBeNull();
    });

    it('setDisabledState enables and disables', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBeTrue();
      component.setDisabledState(false);
      expect(component.disabled).toBeFalse();
    });

    it('registerOnChange callback fires on hour change', () => {
      const cb = jasmine.createSpy('onChange');
      component.registerOnChange(cb);
      component.onHourChange(9);
      expect(cb).toHaveBeenCalled();
    });
  });

  // ── Locale ────────────────────────────────────────────────────────────────────
  describe('getCurrentLocale', () => {
    it('returns en-US locale by default', () => {
      expect(component.getCurrentLocale().monthNames[0]).toBe('January');
    });

    it('resolves a locale string', () => {
      component.locale = 'es-ES';
      expect(component.getCurrentLocale().monthNames[0]).toBe('Enero');
    });

    it('accepts a locale object directly', () => {
      component.locale = CHRONICA_LOCALES['de-DE'];
      expect(component.getCurrentLocale().monthNames[0]).toBe('Januar');
    });

    it('falls back to en-US for an unknown locale code', () => {
      component.locale = 'xx-XX';
      expect(component.getCurrentLocale().monthNames[0]).toBe('January');
    });
  });

  // ── Time updates ──────────────────────────────────────────────────────────────
  describe('time selection', () => {
    it('onHourChange updates selectedHour', () => {
      component.onHourChange(9);
      expect(component.selectedHour).toBe(9);
    });

    it('onMinuteChange updates selectedMinute', () => {
      component.onMinuteChange(45);
      expect(component.selectedMinute).toBe(45);
    });

    it('setCurrentTime sets hour and minute to the current time', () => {
      component.setCurrentTime();
      const now = new Date();
      expect(component.selectedHour).toBe(now.getHours());
      expect(component.selectedMinute).toBe(now.getMinutes());
    });

    it('clearTime resets timeValue to null', () => {
      component.onHourChange(10);
      component.clearTime();
      expect(component.timeValue).toBeNull();
    });
  });

  // ── 24h vs 12h ───────────────────────────────────────────────────────────────
  describe('24h / 12h mode', () => {
    it('24h mode: hours array contains 0 through 23', () => {
      expect(component.hours).toContain(0);
      expect(component.hours).toContain(23);
      expect(component.hours.length).toBe(24);
    });

    it('12h mode: hours array contains 1 through 12', () => {
      const cfg: TimePickerConfig = { ...component.config, format24Hour: false };
      component.config = cfg;
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.hours).toContain(1);
      expect(component.hours).toContain(12);
      expect(component.hours.length).toBe(12);
    });

    it('12h mode: onPeriodChange sets selectedPeriod', () => {
      const cfg: TimePickerConfig = { ...component.config, format24Hour: false };
      component.config = cfg;
      component.ngOnInit();
      fixture.detectChanges();
      component.onPeriodChange('PM');
      expect(component.selectedPeriod).toBe('PM');
      component.onPeriodChange('AM');
      expect(component.selectedPeriod).toBe('AM');
    });
  });

  // ── formattedTime getter ──────────────────────────────────────────────────────
  describe('formattedTime', () => {
    it('returns empty string when no time is selected', () => {
      expect(component.formattedTime).toBe('');
    });

    it('returns a non-empty string after selecting a time', () => {
      component.onHourChange(14);
      expect(component.formattedTime).toBeTruthy();
    });
  });

  // ── Output ────────────────────────────────────────────────────────────────────
  describe('timeChange output', () => {
    it('emits a ChronicaTimeValue when the hour changes', () => {
      const emitted: (ChronicaTimeValue | null)[] = [];
      outputToObservable(component.timeChange).subscribe((v) => emitted.push(v));
      component.onHourChange(10);
      expect(emitted.length).toBe(1);
      expect(emitted[0]?.hours).toBe(10);
    });

    it('emits null after clearTime', () => {
      const emitted: (ChronicaTimeValue | null)[] = [];
      outputToObservable(component.timeChange).subscribe((v) => emitted.push(v));
      component.onHourChange(10);
      component.clearTime();
      expect(emitted[emitted.length - 1]).toBeNull();
    });
  });
});

// ─── FormControl integration ──────────────────────────────────────────────────
describe('ChronicaTimePickerComponent (reactive form)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, OverlayModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('patches the form control value', () => {
    const time = tv(10, 0);
    host.ctrl.setValue(time);
    fixture.detectChanges();
    expect(host.ctrl.value).toEqual(time);
  });

  it('disabling the form control disables the component', () => {
    host.ctrl.disable();
    fixture.detectChanges();
    const picker = fixture.debugElement.query(
      (el) => el.componentInstance instanceof ChronicaTimePickerComponent
    )?.componentInstance as ChronicaTimePickerComponent;
    expect(picker?.disabled).toBeTrue();
  });
});
