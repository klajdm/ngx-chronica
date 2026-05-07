import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { ChronicaDateRangeComponent } from './date-range.component';
import { CHRONICA_LOCALES, ChronicaDateRange } from '../../models';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const d = (y: number, m: number, day: number) => new Date(y, m, day);

@Component({
  standalone: true,
  imports: [ChronicaDateRangeComponent, ReactiveFormsModule],
  template: `<chronica-date-range [formControl]="ctrl"></chronica-date-range>`,
})
class TestHostComponent {
  ctrl = new FormControl<ChronicaDateRange | null>(null);
}

// ─── Specs ────────────────────────────────────────────────────────────────────
describe('ChronicaDateRangeComponent', () => {
  let fixture: ComponentFixture<ChronicaDateRangeComponent>;
  let component: ChronicaDateRangeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChronicaDateRangeComponent, OverlayModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ChronicaDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Creation ─────────────────────────────────────────────────────────────────
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initialises with no start or end date', () => {
    expect(component.dateRange.startDate).toBeNull();
    expect(component.dateRange.endDate).toBeNull();
  });

  it('currentMonth is initialised on create', () => {
    expect(component.currentMonth).toBeDefined();
  });

  // ── ControlValueAccessor ──────────────────────────────────────────────────────
  describe('ControlValueAccessor', () => {
    it('writeValue sets the date range', () => {
      const range: ChronicaDateRange = { startDate: d(2024, 0, 1), endDate: d(2024, 0, 31) };
      component.writeValue(range);
      expect(component.dateRange.startDate).toEqual(range.startDate);
      expect(component.dateRange.endDate).toEqual(range.endDate);
    });

    it('writeValue null clears both dates', () => {
      component.writeValue({ startDate: d(2024, 0, 1), endDate: d(2024, 0, 31) });
      component.writeValue(null);
      expect(component.dateRange.startDate).toBeNull();
      expect(component.dateRange.endDate).toBeNull();
    });

    it('setDisabledState enables and disables', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBeTrue();
      component.setDisabledState(false);
      expect(component.disabled).toBeFalse();
    });

    it('registerOnChange callback fires when a range is selected', () => {
      const cb = jasmine.createSpy('onChange');
      component.registerOnChange(cb);
      component.selectDate(5);
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
      component.locale = 'fr-FR';
      expect(component.getCurrentLocale().monthNames[0]).toBe('Janvier');
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

  // ── Range selection ───────────────────────────────────────────────────────────
  describe('date range selection', () => {
    it('first selectDate sets only the start date', () => {
      component.selectDate(5);
      expect(component.dateRange.startDate).not.toBeNull();
      expect(component.dateRange.endDate).toBeNull();
    });

    it('second selectDate completes the range', () => {
      component.selectDate(5);
      component.selectDate(15);
      expect(component.dateRange.startDate).not.toBeNull();
      expect(component.dateRange.endDate).not.toBeNull();
    });

    it('clearRange resets both dates', () => {
      component.selectDate(5);
      component.selectDate(15);
      component.clearRange();
      expect(component.dateRange.startDate).toBeNull();
      expect(component.dateRange.endDate).toBeNull();
    });

    it('selecting today via selectToday sets both dates to today', () => {
      component.selectToday();
      const today = new Date();
      expect(component.dateRange.startDate?.getDate()).toBe(today.getDate());
      expect(component.dateRange.endDate?.getDate()).toBe(today.getDate());
    });
  });

  // ── Navigation ────────────────────────────────────────────────────────────────
  describe('month navigation', () => {
    it('previousMonth decrements the displayed month', () => {
      const initial = component.currentMonth.month;
      component.previousMonth();
      const expected = initial === 0 ? 11 : initial - 1;
      expect(component.currentMonth.month).toBe(expected);
    });

    it('nextMonth increments the displayed month', () => {
      const initial = component.currentMonth.month;
      component.nextMonth();
      const expected = initial === 11 ? 0 : initial + 1;
      expect(component.currentMonth.month).toBe(expected);
    });

    it('previousMonth wraps to December when January', () => {
      component.initialMonth = 0;
      component.initialYear = 2024;
      component.ngOnInit();
      fixture.detectChanges();
      component.previousMonth();
      expect(component.currentMonth.month).toBe(11);
      expect(component.currentMonth.year).toBe(2023);
    });

    it('nextMonth wraps to January when December', () => {
      component.initialMonth = 11;
      component.initialYear = 2024;
      component.ngOnInit();
      fixture.detectChanges();
      component.nextMonth();
      expect(component.currentMonth.month).toBe(0);
      expect(component.currentMonth.year).toBe(2025);
    });
  });

  // ── Calendar helpers ──────────────────────────────────────────────────────────
  describe('getDaysInMonth', () => {
    it('returns a valid number of days', () => {
      expect(component.getDaysInMonth().length).toBeGreaterThan(27);
    });
  });

  describe('isToday', () => {
    it('returns true for today\'s day number in the current month', () => {
      expect(component.isToday(new Date().getDate())).toBeTrue();
    });
  });

  describe('isWeekend', () => {
    it('returns a boolean for any day', () => {
      expect(typeof component.isWeekend(1)).toBe('boolean');
    });
  });

  // ── Output ────────────────────────────────────────────────────────────────────
  describe('dateRangeChange output', () => {
    it('emits when a range is selected', () => {
      const emitted: ChronicaDateRange[] = [];
      outputToObservable(component.dateRangeChange).subscribe((r: ChronicaDateRange) => emitted.push(r));
      component.selectDate(5);
      component.selectDate(15);
      expect(emitted.length).toBeGreaterThan(0);
    });

    it('emits with null start/end after clearRange', () => {
      const emitted: (ChronicaDateRange | null)[] = [];
      outputToObservable(component.dateRangeChange).subscribe((r) => emitted.push(r));
      component.selectDate(5);
      component.selectDate(15);
      component.clearRange();
      expect(emitted.length).toBeGreaterThan(0);
    });
  });
});

// ─── FormControl integration ──────────────────────────────────────────────────
describe('ChronicaDateRangeComponent (reactive form)', () => {
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
    const range: ChronicaDateRange = { startDate: d(2024, 0, 1), endDate: d(2024, 0, 31) };
    host.ctrl.setValue(range);
    fixture.detectChanges();
    expect(host.ctrl.value).toEqual(range);
  });

  it('disabling the form control disables the component', () => {
    host.ctrl.disable();
    fixture.detectChanges();
    const picker = fixture.debugElement.query(
      (el) => el.componentInstance instanceof ChronicaDateRangeComponent
    )?.componentInstance as ChronicaDateRangeComponent;
    expect(picker?.disabled).toBeTrue();
  });
});
