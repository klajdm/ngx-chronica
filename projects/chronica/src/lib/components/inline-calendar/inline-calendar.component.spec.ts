import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { ChronicaInlineCalendarComponent } from './inline-calendar.component';
import { CHRONICA_LOCALES } from '../../models';

const d = (y: number, m: number, day: number) => new Date(y, m, day);

@Component({
  standalone: true,
  imports: [ChronicaInlineCalendarComponent, ReactiveFormsModule],
  template: `<chronica-inline-calendar [formControl]="ctrl"></chronica-inline-calendar>`,
})
class TestHostComponent {
  ctrl = new FormControl<Date | null>(null);
}

describe('ChronicaInlineCalendarComponent', () => {
  let fixture: ComponentFixture<ChronicaInlineCalendarComponent>;
  let component: ChronicaInlineCalendarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChronicaInlineCalendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChronicaInlineCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Creation ────────────────────────────────────────────────────────────────
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts in the month view', () => {
    expect(component.currentView).toBe('month');
  });

  it('initialises with no selected date', () => {
    expect(component.selectedDate).toBeNull();
  });

  // ── Calendar state ──────────────────────────────────────────────────────────
  it('currentMonth is set on init', () => {
    expect(component.currentMonth).toBeDefined();
    expect(component.currentMonth.weeks.length).toBeGreaterThan(0);
  });

  it('dayNames has 7 entries', () => {
    expect(component.dayNames.length).toBe(7);
  });

  // ── ControlValueAccessor ────────────────────────────────────────────────────
  describe('ControlValueAccessor', () => {
    it('writeValue sets selectedDate', () => {
      const date = d(2024, 4, 15);
      component.writeValue(date);
      expect(component.selectedDate).toEqual(date);
    });

    it('writeValue null clears the selection', () => {
      component.writeValue(d(2024, 4, 15));
      component.writeValue(null);
      expect(component.selectedDate).toBeNull();
    });

    it('setDisabledState updates disabled flag', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBeTrue();
      component.setDisabledState(false);
      expect(component.disabled).toBeFalse();
    });

    it('registerOnChange callback is called on date selection', () => {
      const cb = jasmine.createSpy('onChange');
      component.registerOnChange(cb);
      const dateCell = component.currentMonth.dates.find(
        (c) => c.inCurrentMonth && !c.disabled
      );
      if (dateCell) {
        component.selectDate(dateCell);
        expect(cb).toHaveBeenCalledWith(dateCell.date);
      }
    });
  });

  // ── Locale ──────────────────────────────────────────────────────────────────
  describe('getCurrentLocale', () => {
    it('returns en-US locale by default', () => {
      expect(component.getCurrentLocale().monthNames[0]).toBe('January');
    });

    it('resolves a locale string', () => {
      component.locale = 'es-ES';
      expect(component.getCurrentLocale().monthNames[0]).toBe('Enero');
    });

    it('accepts a locale object directly', () => {
      component.locale = CHRONICA_LOCALES['ja-JP'];
      expect(component.getCurrentLocale().monthNames[0]).toBe('1月');
    });

    it('falls back to en-US for an unknown code', () => {
      component.locale = 'zz-ZZ';
      expect(component.getCurrentLocale().monthNames[0]).toBe('January');
    });
  });

  // ── Navigation ──────────────────────────────────────────────────────────────
  describe('previousMonth / nextMonth', () => {
    it('previousMonth decrements the displayed month', () => {
      const initial = component.currentMonth.month;
      component.previousMonth();
      fixture.detectChanges();
      const expected = initial === 0 ? 11 : initial - 1;
      expect(component.currentMonth.month).toBe(expected);
    });

    it('nextMonth increments the displayed month', () => {
      const initial = component.currentMonth.month;
      component.nextMonth();
      fixture.detectChanges();
      const expected = initial === 11 ? 0 : initial + 1;
      expect(component.currentMonth.month).toBe(expected);
    });

    it('previousMonth wraps year correctly from January', () => {
      component.initialMonth = 0;
      component.initialYear = 2024;
      component.ngOnInit();
      fixture.detectChanges();
      component.previousMonth();
      fixture.detectChanges();
      expect(component.currentMonth.month).toBe(11);
      expect(component.currentMonth.year).toBe(2023);
    });

    it('nextMonth wraps year correctly from December', () => {
      component.initialMonth = 11;
      component.initialYear = 2024;
      component.ngOnInit();
      fixture.detectChanges();
      component.nextMonth();
      fixture.detectChanges();
      expect(component.currentMonth.month).toBe(0);
      expect(component.currentMonth.year).toBe(2025);
    });
  });

  // ── View switching ───────────────────────────────────────────────────────────
  describe('cycleView', () => {
    it('cycles month → months → year → month', () => {
      expect(component.currentView).toBe('month');
      component.cycleView();
      expect(component.currentView).toBe('months');
      component.cycleView();
      expect(component.currentView).toBe('year');
      component.cycleView();
      expect(component.currentView).toBe('month');
    });
  });

  // ── Date selection output ───────────────────────────────────────────────────
  describe('dateSelected output', () => {
    it('emits a Date when a cell is selected', () => {
      const emitted: Date[] = [];
      outputToObservable(component.dateSelected).subscribe((d: Date) => emitted.push(d));
      const cell = component.currentMonth.dates.find((c) => c.inCurrentMonth && !c.disabled);
      if (cell) {
        component.selectDate(cell);
        expect(emitted.length).toBe(1);
        expect(emitted[0]).toEqual(cell.date);
      }
    });

    it('does not emit for a disabled cell', () => {
      const emitted: Date[] = [];
      outputToObservable(component.dateSelected).subscribe((d: Date) => emitted.push(d));
      const disabledCell = { ...component.currentMonth.dates[0], disabled: true };
      component.selectDate(disabledCell);
      expect(emitted.length).toBe(0);
    });
  });
});

// ─── FormControl integration ──────────────────────────────────────────────────
describe('ChronicaInlineCalendarComponent (reactive form)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('sets an initial value via the form control', () => {
    const date = d(2024, 4, 15);
    host.ctrl.setValue(date);
    fixture.detectChanges();
    expect(host.ctrl.value).toEqual(date);
  });

  it('disabling the form control disables the calendar', () => {
    host.ctrl.disable();
    fixture.detectChanges();
    const cal = fixture.debugElement.query(
      (el) => el.componentInstance instanceof ChronicaInlineCalendarComponent
    )?.componentInstance as ChronicaInlineCalendarComponent;
    expect(cal?.disabled).toBeTrue();
  });
});
