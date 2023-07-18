import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestService } from 'src/app/services/request.service';
import { EncryptionService } from 'src/app/services/encryption.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  searchTerm: string = '';
  cities: any
  filteredCities:any = [];
  isDropdownOpen: boolean = false;
  searchForm:any 
  cityId:any 
  loading:any = false
  constructor(private formBuilder: FormBuilder , private req :RequestService , private router:Router ,  private encryptionService: EncryptionService) {
    this.searchForm = this.formBuilder.group({
      city: ['Karachi'],
      adults: [2],
      kids: [0],
      rooms: [1]
    });
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.req.post('city/list',true,true).subscribe((res:any)=>{
      this.cities = res.data
      
    })
  }
  filterCities() {
    this.filteredCities = this.cities.filter((city:any) => city.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }
  selectCity(city:any) {
    this.searchTerm = city.name; // Set the selected city in the search input
    this.cityId = city.id; // Set the selected city in the search input
    this.filteredCities = [] // Hide the dropdown
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
  onSubmit() {
    this.loading = true 
    this.req.post('property/find', { city_id: this.cityId }, true).subscribe((res: any) => {
      console.log(res.data);
      this.loading = false 
     const cities = this.cities.filter((city:any) => city.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
      // Navigate to the search-result component and pass the data
      this.router.navigate(['/search-result']);
     const  hotel =  JSON.stringify(res.data)
     const city =  JSON.stringify(cities)
      const encryptedHotel = this.encryptionService.encryptData(hotel, 'staybook1700');
      localStorage.setItem('hotel', encryptedHotel);
      const encryptedCity = this.encryptionService.encryptData(city, 'staybook1700');
      localStorage.setItem('city', encryptedCity);
      
    });
  }
}
