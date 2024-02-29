import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, combineLatest, exhaustMap, map, tap } from 'rxjs';
import { Rates, RatesService } from '../../libs/api/v2';

export interface RatesState {
  rates: Rates;
  loading: boolean;
  error: string | undefined;
}

@Injectable()
export class RatesStore extends ComponentStore<RatesState> {
  constructor(
    private readonly ratesService: RatesService,
    private readonly activatedRoute: ActivatedRoute,
  ) {
    const rehydratedRates: Rates = JSON.parse(
      `${localStorage.getItem(new Date().toISOString().split('T')[0])}`,
    );

    super({ rates: rehydratedRates, loading: false, error: undefined });

    if (!rehydratedRates) this.getRates();
  }

  public readonly convert$: Observable<any> = combineLatest([
    this.activatedRoute.queryParams,
    this.select((state) => state.rates),
  ]).pipe(
    map(([params, rates]: [Params, Rates]) => {
      const { from, to, amount } = params;

      if (!from || !to || !amount) {
        return;
      }
      if (from === to) return amount;

      const eurRate = rates?.rates ? rates.rates['EUR'] : undefined;
      const fromRate = rates?.rates ? rates.rates[from] : undefined;
      const toRate = rates?.rates ? rates.rates[to] : undefined;

      if (
        typeof eurRate === 'undefined' ||
        typeof fromRate === 'undefined' ||
        typeof toRate === 'undefined'
      ) {
        this.patchState({
          error: 'Exchange rates not found for the provided currencies',
          rates: undefined,
        });
        return;
      }

      const amountInEUR = parseFloat(amount) / fromRate;

      return amountInEUR * toRate;
    }),
  );
  readonly error$ = this.select((state) => state.error);
  readonly loading$ = this.select((state) => state.loading);
  readonly date$ = this.select((state) => state.rates?.date);

  private readonly getRates = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.patchState({ loading: true })),
      exhaustMap(() =>
        this.ratesService.getLatest().pipe(
          tapResponse({
            next: (rates: Rates) => {
              // add to local storage so we can get later on to save API calls so don't exceed the cap (100)
              localStorage.setItem(`${rates.date}`, JSON.stringify(rates));

              this.patchState({ rates });
            },
            error: (error: HttpErrorResponse) =>
              this.patchState({ error: error.error, rates: undefined }),
            finalize: () => this.patchState({ loading: false }),
          }),
        ),
      ),
    ),
  );
}
