import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterModule } from '@angular/router';
import { ApiModule } from '../libs/api/v2';
import { FlagLabelComponent } from '../libs/components/flag-label/flag-label.component';
import { AppComponent } from './app.component';
import { apiConfigFactory } from './app.config';
import { RatesStore } from './store/rates.store';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    ApiModule.forRoot(apiConfigFactory),
    RouterModule.forRoot([]),
    FlagLabelComponent,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  providers: [provideAnimationsAsync(), RatesStore],
  bootstrap: [AppComponent],
})
export class AppModule {}
