import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MockComponents, MockDirectives } from 'ng-mocks';
import { BehaviorSubject } from 'rxjs';
import { FlagLabelComponent } from '../libs/components/flag-label/flag-label.component';
import { AppComponent } from './app.component';
import { RatesStore } from './store/rates.store';

describe('AppComponent', () => {
  let component: AppComponent,
    router: Router,
    queryParams: BehaviorSubject<Params> = new BehaviorSubject({});

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockComponents(MatFormField, MatSelect, FlagLabelComponent),
        MockDirectives(MatLabel, MatInput, MatSelectTrigger),
      ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: () => {} },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: queryParams.asObservable(),
          },
        },
        {
          provide: RatesStore,
          useValue: {},
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  describe('constructor', () => {
    it('should subscribe to exchangeForm valueChanges and update url', fakeAsync(() => {
      spyOn(router, 'navigate');

      component.exchangeForm.patchValue({
        amount: '10',
        from: 'USD',
        to: 'EUR',
      });

      tick(251);

      expect(router.navigate).toHaveBeenCalledWith([''], {
        queryParams: { amount: '10', from: 'USD', to: 'EUR' },
      });
    }));

    it('should pre-populate the form on first visit from url', () => {
      spyOn(component.exchangeForm, 'patchValue');

      queryParams.next({
        amount: '100',
        from: 'GBP',
        to: 'DKK',
      });

      expect(component.exchangeForm.patchValue).toHaveBeenCalledWith({
        amount: '100',
        from: 'GBP',
        to: 'DKK',
      });
    });
  });

  describe('getErrorMessage', () => {
    it('should return "You must provide a value" when form control is required and empty', () => {
      const formControlName = 'amount';

      component.exchangeForm
        .get(formControlName)
        ?.setErrors({ required: true });

      const errorMessage = component.getErrorMessage(formControlName);
      expect(errorMessage).toBe('You must provide a value');
    });

    it('should return "Please provide an amount greater than 0" when form control has min validation error', () => {
      const formControlName = 'amount';

      component.exchangeForm.get(formControlName)?.setErrors({ min: true });

      const errorMessage = component.getErrorMessage(formControlName);
      expect(errorMessage).toBe('Please provide an amount greater than 0');
    });

    it('should return "Please provide an amount less than Number.MAX_SAFE_INTEGER" when form control has max validation error', () => {
      const formControlName = 'amount';

      component.exchangeForm.get(formControlName)?.setErrors({ max: true });

      const errorMessage = component.getErrorMessage(formControlName);
      expect(errorMessage).toBe(
        `Please provide an amount less than ${Number.MAX_SAFE_INTEGER}`,
      );
    });

    it('should return an empty string when form control has no errors', () => {
      const formControlName = 'amount';
      component.exchangeForm.get(formControlName)?.setValue('1');

      const errorMessage = component.getErrorMessage(formControlName);

      expect(errorMessage).toBe('');
    });
  });
});
