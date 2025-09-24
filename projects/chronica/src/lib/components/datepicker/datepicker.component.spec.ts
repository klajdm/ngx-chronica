import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChronicaDatepickerComponent } from './datepicker.component';

describe('InlineCalendarComponent', () => {
  let component: ChronicaDatepickerComponent;
  let fixture: ComponentFixture<ChronicaDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChronicaDatepickerComponent],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(ChronicaDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current month', () => {
    const now = new Date();
    expect(component.currentMonth.month).toBe(now.getMonth());
    expect(component.currentMonth.year).toBe(now.getFullYear());
  });

  it('should emit dateSelected when a date is clicked', () => {
    spyOn(component.dateSelected, 'emit');
    const testDay = 15; // Use a day number instead of CalendarDate

    if (!component.isDateDisabled(testDay)) {
      component.selectDate(testDay);
      expect(component.dateSelected.emit).toHaveBeenCalled();
    }
  });

  it('should navigate to previous month', () => {
    const initialMonth = component.currentMonth.month;
    const initialYear = component.currentMonth.year;

    component.previousMonth();

    if (initialMonth === 0) {
      expect(component.currentMonth.month).toBe(11);
      expect(component.currentMonth.year).toBe(initialYear - 1);
    } else {
      expect(component.currentMonth.month).toBe(initialMonth - 1);
      expect(component.currentMonth.year).toBe(initialYear);
    }
  });

  it('should navigate to next month', () => {
    const initialMonth = component.currentMonth.month;
    const initialYear = component.currentMonth.year;

    component.nextMonth();

    if (initialMonth === 11) {
      expect(component.currentMonth.month).toBe(0);
      expect(component.currentMonth.year).toBe(initialYear + 1);
    } else {
      expect(component.currentMonth.month).toBe(initialMonth + 1);
      expect(component.currentMonth.year).toBe(initialYear);
    }
  });
});
