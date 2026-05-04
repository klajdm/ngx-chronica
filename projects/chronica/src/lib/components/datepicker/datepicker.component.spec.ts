import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { ChronicaDatepickerComponent } from './datepicker.component';
import { CHRONICA_LOCALES } from '../../models';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const d = (y: number, m: number, day: number) => new Date(y, m, day);

@Component({
  standalone: true,
  imports: [ChronicaDatepickerComponent, ReactiveFormsModule],
  template: `<chronica-datepicker [formControl]="ctrl"></chronica-datepicker>`,
})
class TestHostComponent {
  ctrl = new FormControl<Date | null>(null);
}

// ─── Specs ────────────────────────────────────────────────────────────────────
describe('ChronicaDatepickerComponent', () => {
  let fixture: ComponentFixture<ChronicaDatepickerComponent>;
  let component: ChronicaDatepickerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChronicaDatepickerComponent, OverlayModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ChronicaDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Creation ────────────────────────────────────────────────────────────────
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initialises with no selected date', () => {
    expect(component.selectedDate).toBeNull();
  });

  // ── ControlValueAccessor ────────────────────────────────────────────────────
  describe('ControlValueAccessor', () => {
    it('writeValue sets the selected date', () => {
      const date = d(2024, 4, 15);
      component.writeValue(date);
      expect(component.selectedDate).toEqual(date);
    });

    it('writeValue with null clears the selection', () => {
      component.writeValue(d(2024, 4, 15));
      component.writeValue(null);
      expect(component.selectedDate).toBeNull();
    });

    it('setDisabledState disables the component', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBeTrue();
    });

    it('setDisabledState re-enables the component', () => {
      component.setDisabledState(true);
      component.setDisabledState(false);
      expect(component.disabled).toBeFalse();
    });

    it('registerOnChange stores the callback', () => {
      const cb = jasmine.createSpy('onChange');
      component.registerOnChange(cb);
      component.selectDate(15);
      expect(cb).toHaveBeenCalled();
    });
  });

  // ── Locale ──────────────────────────────────────────────────────────────────
  describe('getCurrentLocale', () => {
    it('returns en-US locale by default', () => {
      const locale = component.getCurrentLocale();
      expect(locale.monthNames[0]).toBe('January');
    });

    it('returns the locale object when passed directly', () => {
      component.locale = CHRONICA_LOCALES['de-DE'];
      expect(component.getCurrentLocale().monthNames[0]).toBe('Januar');
    });

    it('resolves a locale string to the correct config', () => {
      component.locale = 'fr-FR';
      expect(component.getCurrentLocale().monthNames[0]).toBe('Janvier');
    });

    it('falls back to en-US for unknown locale string', () => {
      component.locale = 'xx-XX';
      expect(component.getCurrentLocale().monthNames[0]).toBe('January');
    });
  });

  // ── Calendar helpers ────────────────────────────────────────────────────────
  describe('getDaysInMonth', () => {
    it('returns 31 days for May', () => {
      component.writeValue(d(2024, 4, 1));
      fixture.detectChanges();
      expect(component.getDaysInMonth().length).toBe(31);
    });

    it('returns 29 days for February 2024 (leap year)', () => {
      component.initialMonth = 1;
      component.initialYear = 2024;
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.getDaysInMonth().length).toBe(29);
    });
  });

  describe('isToday', () => {
    it('returns true for today\'s day number in the current month', () => {
      const today = new Date();
      component.writeValue(today);
      fixture.detectChanges();
      expect(component.isToday(today.getDate())).toBeTrue();
    });
  });

  describe('isSelectedDate', () => {
    it('returns true for the day of the selected date', () => {
      // Use today so currentMonth year/month match
      const today = new Date();
      component.writeValue(today);
      fixture.detectChanges();
      expect(component.isSelectedDate(today.getDate())).toBeTrue();
    });

    it('returns false for a different day', () => {
      const today = new Date();
      component.writeValue(today);
      fixture.detectChanges();
      // Pick a day that definitely differs (today ± 1, clamped to valid range)
      const other = today.getDate() === 1 ? 2 : today.getDate() - 1;
      expect(component.isSelectedDate(other)).toBeFalse();
    });
  });

  // ── Event output ────────────────────────────────────────────────────────────
  describe('dateSelected output', () => {
    it('emits the selected date when selectDate is called', () => {
      const emitted: Date[] = [];
      component.dateSelected.subscribe((d: Date) => emitted.push(d));
      component.writeValue(d(2024, 4, 1));
      fixture.detectChanges();
      component.selectDate(15);
      expect(emitted.length).toBe(1);
      expect(emitted[0].getDate()).toBe(15);
    });
  });
});

// ─── FormControl integration ──────────────────────────────────────────────────
describe('ChronicaDatepickerComponent (reactive form)', () => {
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
    const date = d(2024, 4, 15);
    host.ctrl.setValue(date);
    fixture.detectChanges();
    expect(host.ctrl.value).toEqual(date);
  });

  it('disabling the form control disables the component', () => {
    host.ctrl.disable();
    fixture.detectChanges();
    const picker = fixture.debugElement.query(
      (el) => el.componentInstance instanceof ChronicaDatepickerComponent
    )?.componentInstance as ChronicaDatepickerComponent;
    expect(picker?.disabled).toBeTrue();
  });
});
