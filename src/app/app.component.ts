import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime, filter, take, takeUntil } from 'rxjs';
import { currencyCodes } from '../libs/constants/currency-codes';
import { RatesStore } from './store/rates.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy {
  public readonly currencies: string[] = currencyCodes;
  public exchangeForm = new FormGroup({
    amount: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.max(Number.MAX_SAFE_INTEGER),
    ]),
    from: new FormControl('', [Validators.required]),
    to: new FormControl('', [Validators.required]),
  });

  private destroy$: Subject<void> = new Subject();

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    public readonly ratesStore: RatesStore,
  ) {
    this.exchangeForm.valueChanges
      .pipe(debounceTime(250), takeUntil(this.destroy$))
      .subscribe((value) => {
        const { amount, from, to } = value;

        // add the form values to query params
        this.router.navigate([''], {
          queryParams: {
            amount,
            from,
            to,
          },
        });
      });

    // first visit (take(1)) pre-populate the form
    this.activatedRoute.queryParams
      .pipe(
        filter(({ amount, from, to }) => !!amount || !!from || !!to),
        take(1),
      )
      .subscribe(({ amount, from, to }) =>
        this.exchangeForm.patchValue({ amount, from, to }),
      );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  public getErrorMessage(formControlName: string): string {
    if (this.exchangeForm.get(formControlName)?.hasError('required'))
      return 'You must provide a value';

    if (this.exchangeForm.get(formControlName)?.hasError('min'))
      return 'Please provide an amount greater than 0';

    if (this.exchangeForm.get(formControlName)?.hasError('max'))
      return `Please provide an amount less than ${Number.MAX_SAFE_INTEGER}`;

    return '';
  }
}
