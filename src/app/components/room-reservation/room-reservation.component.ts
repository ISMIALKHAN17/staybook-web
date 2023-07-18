import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { EncryptionService } from 'src/app/services/encryption.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-room-reservation',
  templateUrl: './room-reservation.component.html',
  styleUrls: ['./room-reservation.component.css'],
  providers : [DecimalPipe]
})
export class RoomReservationComponent {
  roomData:any
  reservationForm: any;
  discountCodeApplied = false;
  fromDate:any 
  toDate:any
  mainImageIndex: number = 0;

  constructor( public decimalPipe:DecimalPipe , private encryptionService:EncryptionService , private formBuilder: FormBuilder){
  }
ngOnInit(): void {
  const roomData:any = localStorage.getItem('room')
  const room = this.encryptionService.decryptData(roomData,'staybook1700')
  this.roomData = JSON.parse(room!)

  this.reservationForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    identification: ['', Validators.required],
    // discountCode: ['']
  });
}

changeMainImage(index: number): void {
  this.mainImageIndex = index;
}






reserveRoom(): void {
  if (this.reservationForm.valid) {
    const reservationData = this.reservationForm.value;
    // Here, you can handle the form submission logic, such as sending the reservation data to the server
    // and applying the discount code if valid.
    console.log('Reservation details:', reservationData);
    console.log('Discount code applied:', this.discountCodeApplied);
    // Add your logic here to handle the reservation and discount code
  } else {
    console.log('Invalid form data');
  }
}

applyDiscount(): void {
  const discountCode = this.reservationForm.get('discountCode')?.value;
  if (discountCode && discountCode.trim() === 'DISCOUNT123') {
    this.discountCodeApplied = true;
    console.log('Discount applied successfully!');
  } else {
    this.discountCodeApplied = false;
    console.log('Invalid discount code');
  }
}
calculateWeekdaysAndWeekends(fromDate: any, toDate: any): { weekdays: number, weekends: number } {
  const fromDateObj = new Date(fromDate.year, fromDate.month - 1, fromDate.day);
  const toDateObj = new Date(toDate.year, toDate.month - 1, toDate.day);

  let weekdays = 0;
  let weekends = 0;
  const currentDate = new Date(fromDateObj);

  while (currentDate <= toDateObj) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekends++;
    } else {
      weekdays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return { weekdays, weekends };
}
calculateRoomWeekDayPrice(room: any): any {
  const { weekdays , weekends } = this.calculateWeekdaysAndWeekends(this.fromDate, this.toDate);
  const weekdaystotalPrice = room.rate_plan.week_days_price * weekdays;
  const weekdendstotalPrice = room.rate_plan.week_days_price * weekends;
  const totalPrice = weekdaystotalPrice + weekdendstotalPrice
  return this.decimalPipe.transform(totalPrice, '1.0-0');
}
}
