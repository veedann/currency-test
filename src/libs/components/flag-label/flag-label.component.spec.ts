import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlagLabelComponent } from './flag-label.component';

describe('FlagLabelComponent', () => {
  let component: FlagLabelComponent;
  let fixture: ComponentFixture<FlagLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlagLabelComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagLabelComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the flag element with correct classes', () => {
    component.code = 'US';

    fixture.detectChanges();

    const flagElement = fixture.nativeElement.querySelector(
      '[data-testid="iti-flag"]',
    );
    expect(flagElement).toBeTruthy();
    expect(flagElement.classList).toContain('iti__flag');
    expect(flagElement.classList).toContain('iti__us');
  });
});
