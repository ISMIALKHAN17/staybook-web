import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { RequestService } from 'src/app/services/request.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { EncryptionService } from 'src/app/services/encryption.service';


@Component({
  selector: 'app-hotel-view',
  templateUrl: './hotel-view.component.html',
  styleUrls: ['./hotel-view.component.css'],
  animations: [
    trigger('popin', [
      state('true', style({ transform: 'scale(1)' })),
      state('false', style({ transform: 'scale(0)' })),
      transition('false => true', animate('1000ms ease-in')),
      transition('true => false', animate('1000ms ease-out'))
    ])
  ],
  providers:[DecimalPipe]
})
export class HotelViewComponent {
  hotelData: any;
  title:any
  isDropdownOpen:any
  searchForm:any
  roomWeekDayPrice:any
  roomWeekEndPrice:any
  hoveredDate: NgbDate | null = null;
  isHoveredOverCalendar:any = false
	fromDate: any;
	toDate: any;
  roomView:any = false
  roomData:any

  constructor(private formBuilder: FormBuilder , private req :RequestService , private router:Router ,private calendar: NgbCalendar , private modalService:NgbModal , public decimalPipe: DecimalPipe , private encryptionService:EncryptionService) {
    this.searchForm = this.formBuilder.group({
      city: ['Karachi'],
      adults: [2],
      kids: [0],
      rooms: [1]
    });
    this.fromDate = calendar.getToday();
		this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }
  formatDate(date: any): string {
    const formattedDate = new Date(date.year, date.month - 1, date.day);
    const options:any = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDateString = formattedDate.toLocaleDateString('en-US', options);
    const parts = formattedDateString.split(' ');
    return parts[0] + ' ' + parts[1] + ' ' + parts[2] + ' ' + parts[3];
  }
  ngOnInit() {
    this.hotelData = history.state.data;
    this.title = this.hotelData.name
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  increaseCount(type: string) {
    if (type === 'adults') {
      let adults = this.searchForm.value.adults
      adults++
      this.searchForm.get('adults').setValue(adults);
    } else if (type === 'kids') {
      let kids = this.searchForm.value.kids
      kids++
      this.searchForm.get('kids').setValue(kids);
    } else if (type === 'rooms') {
      let rooms = this.searchForm.value.rooms
      rooms++
      this.searchForm.get('rooms').setValue(rooms);
    }
  }
  decreaseCount(type: string) {
    if (type === 'adults') {
      let adults = this.searchForm.value.adults
      adults--
      this.searchForm.get('adults').setValue(adults);
    } else if (type === 'kids') {
      let kids = this.searchForm.value.kids
      kids--
      this.searchForm.get('kids').setValue(kids);
    } else if (type === 'rooms') {
      let rooms = this.searchForm.value.rooms
      rooms--
      this.searchForm.get('rooms').setValue(rooms);
    }
  }
  saveChanges() {
    this.isDropdownOpen = false;
  }
	onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
	}
	isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}
	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}
	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

  open(modal:any){
    this.modalService.open(modal,{centered:true})
  }

  openRooms(modal: any, hotel: any) {
    console.log(this.fromDate);
    this.open(modal)
    const { weekdays, weekends } = this.calculateWeekdaysAndWeekends(this.fromDate, this.toDate);
    this.roomWeekDayPrice = 0;
    this.roomWeekEndPrice = 0;
  
    hotel.room.forEach((room: any) => {
      console.log(room.rate_plan.week_days_price);
      console.log(room.rate_plan.weekends_price);
      
      // Calculate the price for weekdays and weekends
      const roomWeekDayPrice = room.rate_plan.week_days_price * weekdays;
      const roomWeekEndPrice = room.rate_plan.weekends_price * weekends;
      
      // Add the calculated prices to the total
      this.roomWeekDayPrice += roomWeekDayPrice;
      this.roomWeekEndPrice += roomWeekEndPrice;
      
      // Log the total price for the room
    });
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
    return totalPrice ;
  }
  getGoogleMapsLink(): string {
    const hotelName = encodeURIComponent(this.hotelData.name);
    const address = encodeURIComponent(this.hotelData.address_line_1);
    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${hotelName}+${address}`;
    return googleMapsLink;
  }
  roomDetails(modal:any,room:any){
    this.roomData = room;
    const fromDate = this.fromDate;
    const toDate = this.toDate;
    const totalPrice = this.calculateRoomWeekDayPrice(room);
  
    // Add fromDate, toDate, and totalPrice to the roomData
    this.roomData.fromDate = fromDate;
    this.roomData.toDate = toDate;
    this.roomData.totalPrice = totalPrice;
  
    const encryptedRoomData = this.encryptionService.encryptData(JSON.stringify(this.roomData), 'staybook1700');
    localStorage.setItem('room', encryptedRoomData);
    this.modalService.dismissAll();
    this.router.navigate(['reservation']);
  }
}
