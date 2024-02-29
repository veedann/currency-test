import { ActivatedRoute } from '@angular/router';
import { of, take } from 'rxjs';
import { RatesService } from '../../libs/api/v2';
import { ratesMock } from './rates.mock';
import { RatesStore } from './rates.store';

describe('RatesStore', () => {
  let activatedRoute: ActivatedRoute = {
      queryParams: of({ from: 'USD', to: 'GBP', amount: '100' }),
    } as any as ActivatedRoute,
    ratesService: RatesService = {
      getLatest: () => of(ratesMock),
    } as any as RatesService;

  describe('error$ selector', () => {
    it('should return an empty string as a default state', (done) => {
      const ratesStore = new RatesStore(ratesService, activatedRoute);

      ratesStore.error$.subscribe((error) => {
        expect(error).toBeUndefined();
        done();
      });
    });
  });

  describe('loading$ selector', () => {
    it('should return an false as a default state', (done) => {
      const ratesStore = new RatesStore(ratesService, activatedRoute);

      ratesStore.loading$.subscribe((loading) => {
        expect(loading).toBeFalse();
        done();
      });
    });
  });

  describe('date$ selector', () => {
    it('should return string as a default state', (done) => {
      const ratesStore = new RatesStore(ratesService, activatedRoute);

      ratesStore.date$.subscribe((date) => {
        expect(date).toEqual(ratesMock.date);
        done();
      });
    });
  });

  describe('convert$ selector', () => {
    it('should return undefined if from, to, or amount is missing', (done) => {
      const ratesStore = new RatesStore(ratesService, {
        queryParams: of({}),
      } as any as ActivatedRoute);

      ratesStore.convert$.subscribe((result) => {
        expect(result).toBeUndefined();
        done();
      });
    });

    it('should return amount if from and to are the same', (done) => {
      const ratesStore = new RatesStore(ratesService, {
        queryParams: of({ amount: '100', from: 'USD', to: 'USD' }),
      } as any as ActivatedRoute);

      ratesStore.convert$.subscribe((result) => {
        expect(result).toEqual('100');
        done();
      });
    });

    it('should return the converted amount if all required rates are available', (done) => {
      const ratesStore = new RatesStore(ratesService, activatedRoute);

      ratesStore.convert$.subscribe((result) => {
        expect(result).toEqual(
          // @ts-ignore
          100 * (1 / ratesMock.rates['USD']) * ratesMock.rates['GBP'],
        );
        done();
      });
    });

    it('should set error state if any required rate is missing', (done) => {
      const ratesStore = new RatesStore(ratesService, {
        queryParams: of({ amount: '100', from: 'US', to: 'GBP' }),
      } as any as ActivatedRoute);

      ratesStore.convert$.pipe(take(1)).subscribe(() => {
        expect(ratesStore.state().error).toEqual(
          'Exchange rates not found for the provided currencies',
        );
        done();
      });
    });
  });
});
