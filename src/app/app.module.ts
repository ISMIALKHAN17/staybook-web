import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ReactiveFormsModule ,FormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { InnerBannerComponent } from './components/inner-banner/inner-banner.component';
import { HotelViewComponent } from './components/hotel-view/hotel-view.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { RoomReservationComponent } from './components/room-reservation/room-reservation.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    SearchResultComponent,
    InnerBannerComponent,
    HotelViewComponent,
    LoginComponent,
    RoomReservationComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule ,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
