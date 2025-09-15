import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChronicaInlineCalendarComponent } from "./inline-calendar.component";

describe("InlineCalendarComponent", () => {
  let component: ChronicaInlineCalendarComponent;
  let fixture: ComponentFixture<ChronicaInlineCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChronicaInlineCalendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChronicaInlineCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
