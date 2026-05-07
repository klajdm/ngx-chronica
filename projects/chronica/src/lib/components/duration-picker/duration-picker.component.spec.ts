import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { ChronicaDurationPickerComponent, DurationPickerConfig } from './duration-picker.component';
import { CHRONICA_LOCALES, ChronicaDurationValue } from '../../models';

@Component({
  standalone: true,
  imports: [ChronicaDurationPickerComponent, ReactiveFormsModule],
  template: `<chronica-duration-picker [formControl]="ctrl"></chronica-duration-picker>`,
})
class TestHostComponent {
  ctrl = new FormControl<ChronicaDurationValue | null>(null);
}

// ─── Specs ────────────────────────────────────────────────────────────────────
describe('ChronicaDurationPickerComponent', () => {
  let fixture: ComponentFixture<ChronicaDurationPickerComponent>;
  let component: ChronicaDurationPickerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChronicaDurationPickerComponent, OverlayModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ChronicaDurationPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Creation ─────────────────────────────────────────────────────────────────
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initialises with no selected duration', () => {
    expect(component.durationValue).toBeNull();
  });

  it('hours array is populated on init', () => {
    expect(component.hours.length).toBeGreaterThan(0);
  });

  it('minutes array is populated on init', () => {
    expect(component.minutes.length).toBeGreaterThan(0);
  });

  // ── ControlValueAccessor ──────────────────────────────────────────────────────
  describe('ControlValueAccessor', () => {
    it('writeValue sets the duration', () => {
      const duration: ChronicaDurationValue = { hours: 2, minutes: 30 };
      component.writeValue(duration);
      expect(component.durationValue?.hours).toBe(2);
      expect(component.durationValue?.minutes).toBe(30);
    });

    it('writeValue null clears the duration', () => {
      component.writeValue({ hours: 2, minutes: 30 });
      component.writeValue(null);
      expect(component.durationValue).toBeNull();
    });

    it('setDisabledState enables and disables', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBeTrue();
      component.setDisabledState(false);
      expect(component.disabled).toBeFalse();
    });

    it('registerOnChange callback fires on hours change', () => {
      const cb = jasmine.createSpy('onChange');
      component.registerOnChange(cb);
      component.onHoursChange(3);
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

  // ── Duration updates ──────────────────────────────────────────────────────────
  describe('duration selection', () => {
    it('onHoursChange updates selectedHours', () => {
      component.onHoursChange(3);
      expect(component.selectedHours).toBe(3);
    });

    it('onMinutesChange updates selectedMinutes', () => {
      component.onMinutesChange(45);
      expect(component.selectedMinutes).toBe(45);
    });

    it('clearDuration resets durationValue to null', () => {
      component.onHoursChange(2);
      component.clearDuration();
      expect(component.durationValue).toBeNull();
    });

    it('setPresetDuration applies the given preset', () => {
      component.setPresetDuration({ hours: 1, minutes: 0 });
      expect(component.durationValue?.hours).toBe(1);
      expect(component.durationValue?.minutes).toBe(0);
    });
  });

  // ── formattedDuration getter ──────────────────────────────────────────────────
  describe('formattedDuration', () => {
    it('returns empty string when no duration is selected', () => {
      expect(component.formattedDuration).toBe('');
    });

    it('returns a non-empty string after selecting a duration', () => {
      component.onHoursChange(2);
      expect(component.formattedDuration).toBeTruthy();
    });
  });

  // ── Output ────────────────────────────────────────────────────────────────────
  describe('durationChange output', () => {
    it('emits a ChronicaDurationValue when hours change', () => {
      const emitted: (ChronicaDurationValue | null)[] = [];
      outputToObservable(component.durationChange).subscribe((v) => emitted.push(v));
      component.onHoursChange(3);
      expect(emitted.length).toBe(1);
    });

    it('emits null after clearDuration', () => {
      const emitted: (ChronicaDurationValue | null)[] = [];
      outputToObservable(component.durationChange).subscribe((v) => emitted.push(v));
      component.onHoursChange(2);
      component.clearDuration();
      expect(emitted[emitted.length - 1]).toBeNull();
    });
  });
});

// ─── FormControl integration ──────────────────────────────────────────────────
describe('ChronicaDurationPickerComponent (reactive form)', () => {
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
    const duration: ChronicaDurationValue = { hours: 1, minutes: 30 };
    host.ctrl.setValue(duration);
    fixture.detectChanges();
    expect(host.ctrl.value).toEqual(duration);
  });

  it('disabling the form control disables the component', () => {
    host.ctrl.disable();
    fixture.detectChanges();
    const picker = fixture.debugElement.query(
      (el) => el.componentInstance instanceof ChronicaDurationPickerComponent
    )?.componentInstance as ChronicaDurationPickerComponent;
    expect(picker?.disabled).toBeTrue();
  });
});
