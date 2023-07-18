import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { HomeComponent } from './components/home/home.component';
import { HotelViewComponent } from './components/hotel-view/hotel-view.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { RoomReservationComponent } from './components/room-reservation/room-reservation.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search-result', component: SearchResultComponent },
  { path: 'hotel-view', component: HotelViewComponent },
  { path: 'reservation', component: RoomReservationComponent },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] }, // Add AuthGuard here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
}
