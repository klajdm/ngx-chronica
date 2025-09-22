import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';

import { ChronicaDateTimePickerComponent } from './datetime-picker.component';

describe('ChronicaDateTimePickerComponent', () => {
  let component: ChronicaDateTimePickerComponent;
  let fixture: ComponentFixture<ChronicaDateTimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChronicaDateTimePickerComponent, NoopAnimationsModule, OverlayModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ChronicaDateTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default config', () => {
    expect(component.config.format24Hour).toBe(true);
    expect(component.config.showSeconds).toBe(false);
  });

  it('should format date and time correctly', () => {
    const dateTime = {
      date: new Date(2024, 0, 15), // January 15, 2024
      time: { hours: 14, minutes: 30, seconds: 0 },
    };

    component.writeValue(dateTime);
    fixture.detectChanges();

    expect(component.formattedDateTime).toContain('1/15/2024');
    expect(component.formattedDateTime).toContain('14:30');
  });

  it('should handle 12-hour format', () => {
    component.config = {
      ...component.config,
      format24Hour: false,
    };

    const dateTime = {
      date: new Date(2024, 0, 15),
      time: { hours: 14, minutes: 30, seconds: 0 },
    };

    component.writeValue(dateTime);
    fixture.detectChanges();

    expect(component.formattedDateTime).toContain('2:30 PM');
  });

  it('should emit dateTimeChange when value changes', () => {
    spyOn(component.dateTimeChange, 'emit');

    const dateTime = {
      date: new Date(2024, 0, 15),
      time: { hours: 14, minutes: 30 },
    };

    component.writeValue(dateTime);
    component['updateValue']();

    expect(component.dateTimeChange.emit).toHaveBeenCalledWith(dateTime);
  });

  it('should toggle popup', () => {
    expect(component.isPopupOpen).toBe(false);

    component.openPopup();
    expect(component.isPopupOpen).toBe(true);

    component.closePopup();
    expect(component.isPopupOpen).toBe(false);
  });

  it('should select date correctly', () => {
    spyOn(component.dateSelected, 'emit');

    component.selectDate(15);

    expect(component.dateTimeValue.date?.getDate()).toBe(15);
    expect(component.dateSelected.emit).toHaveBeenCalled();
  });

  it('should update time selection', () => {
    spyOn(component.timeSelected, 'emit');

    component.onHourChange(14);
    component.onMinuteChange(30);

    expect(component.dateTimeValue.time?.hours).toBe(14);
    expect(component.dateTimeValue.time?.minutes).toBe(30);
    expect(component.timeSelected.emit).toHaveBeenCalled();
  });

  it('should clear datetime', () => {
    // Set initial value
    const dateTime = {
      date: new Date(2024, 0, 15),
      time: { hours: 14, minutes: 30 },
    };
    component.writeValue(dateTime);

    // Clear it
    component.clearDateTime();

    expect(component.dateTimeValue.date).toBeNull();
    expect(component.dateTimeValue.time).toBeNull();
  });

  it('should set current time', () => {
    const beforeTime = new Date();

    component.setCurrentTime();

    const afterTime = new Date();
    const selectedTime = component.dateTimeValue.time;

    expect(selectedTime?.hours).toBeGreaterThanOrEqual(beforeTime.getHours());
    expect(selectedTime?.hours).toBeLessThanOrEqual(afterTime.getHours());
  });

  it('should be disabled when disabled prop is true', () => {
    component.disabled = true;
    fixture.detectChanges();

    const inputContainer = fixture.nativeElement.querySelector('.datetime-input-container');
    expect(inputContainer?.classList.contains('chronica-disabled')).toBe(true);
  });

  it('should apply theme classes correctly', () => {
    component.config = {
      ...component.config,
      theme: 'dark',
      colorTheme: 'green',
    };

    expect(component.themeClass).toBe('chronica-dark');
    expect(component.colorThemeClass).toBe('chronica-green');
  });
});
