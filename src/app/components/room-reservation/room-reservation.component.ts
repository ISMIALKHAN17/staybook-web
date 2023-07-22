import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { EncryptionService } from 'src/app/services/encryption.service';
import { FormBuilder, Validators } from '@angular/forms';
import { RequestService } from 'src/app/services/request.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-reservation',
  templateUrl: './room-reservation.component.html',
  styleUrls: ['./room-reservation.component.css'],
  providers: [DecimalPipe]
})
export class RoomReservationComponent {
  roomData: any
  reservationForm: any;
  discountCodeApplied = false;
  fromDate: any
  toDate: any
  mainImageIndex: number = 0;
  form: any
  loading:any = false
  totalNights: any
  hotelData:any
  user:any
  months: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  constructor(public decimalPipe: DecimalPipe, private encryptionService: EncryptionService, private formBuilder: FormBuilder,private req:RequestService ,  private authService: AuthService , private router: Router) {
  }
  get isLoggedIn(): boolean {
    return this.authService.getLoggedInStatus();
  }
  ngOnInit(): void {
    const roomData: any = localStorage.getItem('room')
    const room = this.encryptionService.decryptData(roomData, 'staybook1700')
    this.roomData = JSON.parse(room!)

    const secretKey = 'stayBookLogin';
    const encryptedUserData:any = localStorage.getItem('user')
    const userData = this.encryptionService.decryptData(
      encryptedUserData,
      secretKey
    );

    this.user = JSON.parse(userData)

    const hotelData: any = localStorage.getItem('hotelData')
    const hotel = this.encryptionService.decryptData(hotelData, 'staybook1700')
    this.hotelData = JSON.parse(hotel!)
    this.form = this.formBuilder.group({
      startDate: [this.roomData.fromDate.year + '-' + this.roomData.fromDate.month + '-' + this.roomData.fromDate.day, Validators.required],
      endDate: [this.roomData.toDate.year + '-' + this.roomData.toDate.month + '-' + this.roomData.toDate.day, Validators.required],
      totalNight: ['', Validators.required],
      room_id: [this.roomData.id, Validators.required],
      channel_id: [2, Validators.required],
      reservation_status: ['Hold', Validators.required],
      payement_status: ['Unpaid', Validators.required],
      adults: [2, Validators.required],
      kids: [0, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      identityNumber: ['', Validators.required],
      subTotal: [this.roomData.totalPrice, Validators.required],
      discount: [0, Validators.required],
      property_id: [this.hotelData.id , Validators.required],
      total: [this.roomData.totalPrice, Validators.required],
      customer_id: [this.user.id, Validators.required],

    });
    this.calculateTotalNights()
  }
  calculateTotalNights() {
    const startDateParts = this.form.value.startDate.split('-');
    const endDateParts = this.form.value.endDate.split('-');

    const startDate = new Date(
      parseInt(startDateParts[0]),
      parseInt(startDateParts[1]) - 1,
      parseInt(startDateParts[2])
    );

    const endDate = new Date(
      parseInt(endDateParts[0]),
      parseInt(endDateParts[1]) - 1,
      parseInt(endDateParts[2])
    );

    const timeDifference = Math.abs(endDate.getTime() - startDate.getTime());
    this.totalNights = Math.ceil(timeDifference / (1000 * 3600 * 24));
    this.form.patchValue({
      totalNight:this.totalNights
    })
  }

  changeMainImage(index: number): void {
    this.mainImageIndex = index;
  }

  submitForm(): void {
    if (this.isLoggedIn) {
      if (this.form.valid) {
        this.loading = true;
        this.req.post('reservation/room', this.form.value, true).subscribe(
          (res: any) => {
            this.loading = false;
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Reservation successfully created.',
              showConfirmButton: false,
              timer: 2000 // Display for 2 seconds
            });
            this.router.navigate(['/']);
          },
          (error: any) => {
            console.error(error);
            this.loading = false;
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'An error occurred while creating the reservation. Please try again later.',
              showConfirmButton: true,
              confirmButtonText: 'OK'
            });
          }
        );
      } else {
        console.log('Invalid form data');
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Login is required for reservation. Please try again later.',
        showConfirmButton: true,
        confirmButtonText: 'Login',
        showCancelButton: true,
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem('roomReserve', 'true');
          this.router.navigate(['/login']); // Replace '/login' with the actual path to your login page
        }
      });
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
    const { weekdays, weekends } = this.calculateWeekdaysAndWeekends(this.fromDate, this.toDate);
    const weekdaystotalPrice = room.rate_plan.week_days_price * weekdays;
    const weekdendstotalPrice = room.rate_plan.week_days_price * weekends;
    const totalPrice = weekdaystotalPrice + weekdendstotalPrice
    return this.decimalPipe.transform(totalPrice, '1.0-0');
  }
}
