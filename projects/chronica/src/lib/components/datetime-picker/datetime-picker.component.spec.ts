import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { ChronicaDateTimePickerComponent } from './datetime-picker.component';
import { CHRONICA_LOCALES, ChronicaDateTimeValue } from '../../models';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const d = (y: number, m: number, day: number) => new Date(y, m, day);
const dtv = (date: Date | null, hours = 0, minutes = 0): ChronicaDateTimeValue => ({
  date,
  time: date ? { hours, minutes, seconds: 0 } : null,
});

@Component({
  standalone: true,
  imports: [ChronicaDateTimePickerComponent, ReactiveFormsModule],
  template: `<chronica-datetime-picker [formControl]="ctrl"></chronica-datetime-picker>`,
})
class TestHostComponent {
  ctrl = new FormControl<ChronicaDateTimeValue | null>(null);
}

// ─── Specs ────────────────────────────────────────────────────────────────────
describe('ChronicaDateTimePickerComponent', () => {
  let fixture: ComponentFixture<ChronicaDateTimePickerComponent>;
  let component: ChronicaDateTimePickerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChronicaDateTimePickerComponent, OverlayModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ChronicaDateTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Creation ─────────────────────────────────────────────────────────────────
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('currentMonth is initialised on create', () => {
    expect(component.currentMonth).toBeDefined();
    expect(component.currentMonth.year).toBeGreaterThan(0);
  });

  it('hours array is populated on init', () => {
    expect(component.hours.length).toBeGreaterThan(0);
  });

  it('minutes array is populated on init', () => {
    expect(component.minutes.length).toBeGreaterThan(0);
  });

  it('starts on the date tab', () => {
    expect(component.activeTab).toBe('date');
  });

  // ── ControlValueAccessor ──────────────────────────────────────────────────────
  describe('ControlValueAccessor', () => {
    it('writeValue sets the date and time', () => {
      const value = dtv(d(2024, 4, 15), 10, 30);
      component.writeValue(value);
      expect(component.selectedHour).toBe(10);
      expect(component.selectedMinute).toBe(30);
    });

    it('writeValue null clears the value', () => {
      component.writeValue(dtv(d(2024, 4, 15), 10, 30));
      component.writeValue(null);
      expect(component.dateTimeValue.date).toBeNull();
      expect(component.dateTimeValue.time).toBeNull();
    });

    it('setDisabledState enables and disables', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBeTrue();
      component.setDisabledState(false);
      expect(component.disabled).toBeFalse();
    });

    it('registerOnChange callback fires on date selection', () => {
      const cb = jasmine.createSpy('onChange');
      component.registerOnChange(cb);
      component.selectDate(15);
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

  // ── Calendar helpers ──────────────────────────────────────────────────────────
  describe('calendar helpers', () => {
    it('getDaysInMonth returns a valid count', () => {
      expect(component.getDaysInMonth().length).toBeGreaterThan(27);
    });

    it('isToday returns true for today', () => {
      expect(component.isToday(new Date().getDate())).toBeTrue();
    });

    it('isSelectedDate returns true after selecting a day', () => {
      const today = new Date();
      component.selectDate(today.getDate());
      expect(component.isSelectedDate(today.getDate())).toBeTrue();
    });
  });

  // ── Time updates ──────────────────────────────────────────────────────────────
  describe('time updates', () => {
    it('onHourChange updates selectedHour', () => {
      component.onHourChange(10);
      expect(component.selectedHour).toBe(10);
    });

    it('onMinuteChange updates selectedMinute', () => {
      component.onMinuteChange(30);
      expect(component.selectedMinute).toBe(30);
    });

    it('onPeriodChange updates selectedPeriod in 12h mode', () => {
      component.config = { ...component.config, timeConfig: { timeFormat: '12h' } };
      component.ngOnInit();
      fixture.detectChanges();
      component.onPeriodChange('PM');
      expect(component.selectedPeriod).toBe('PM');
    });
  });

  // ── Tab switching ─────────────────────────────────────────────────────────────
  describe('switchTab', () => {
    it('switches to the time tab', () => {
      component.switchTab('time');
      expect(component.activeTab).toBe('time');
    });

    it('switches back to the date tab', () => {
      component.switchTab('time');
      component.switchTab('date');
      expect(component.activeTab).toBe('date');
    });
  });

  // ── clearDateTime ─────────────────────────────────────────────────────────────
  describe('clearDateTime', () => {
    it('clears both date and time', () => {
      component.selectDate(15);
      component.clearDateTime();
      expect(component.dateTimeValue.date).toBeNull();
      expect(component.dateTimeValue.time).toBeNull();
    });
  });

  // ── Outputs ───────────────────────────────────────────────────────────────────
  describe('dateSelected output', () => {
    it('emits a Date after selectDate', () => {
      const emitted: Date[] = [];
      outputToObservable(component.dateSelected).subscribe((d: Date) => emitted.push(d));
      component.selectDate(15);
      expect(emitted.length).toBe(1);
      expect(emitted[0].getDate()).toBe(15);
    });
  });

  describe('dateTimeChange output', () => {
    it('emits after selectDate', () => {
      const emitted: ChronicaDateTimeValue[] = [];
      outputToObservable(component.dateTimeChange).subscribe((v) => emitted.push(v));
      component.selectDate(15);
      expect(emitted.length).toBeGreaterThan(0);
    });
  });
});

// ─── FormControl integration ──────────────────────────────────────────────────
describe('ChronicaDateTimePickerComponent (reactive form)', () => {
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
    const value = dtv(d(2024, 4, 15), 10, 30);
    host.ctrl.setValue(value);
    fixture.detectChanges();
    expect(host.ctrl.value).toEqual(value);
  });

  it('disabling the form control disables the component', () => {
    host.ctrl.disable();
    fixture.detectChanges();
    const picker = fixture.debugElement.query(
      (el) => el.componentInstance instanceof ChronicaDateTimePickerComponent
    )?.componentInstance as ChronicaDateTimePickerComponent;
    expect(picker?.disabled).toBeTrue();
  });
});
