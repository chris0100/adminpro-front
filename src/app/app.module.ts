import { BrowserModule } from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import {AppRoutingModule} from './app-routing.module';
import {PagesModule} from './pages/pages.module';
import {AuthModule} from './auth/auth.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './interceptor/auth.interceptor';
import {TokenInterceptor} from './guards/token.interceptor';
import {registerLocaleData} from '@angular/common';
import localeES from '@angular/common/locales/es';

registerLocaleData(localeES, 'es');


@NgModule({
  declarations: [
    AppComponent,
    NopagefoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    AuthModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'es'},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
