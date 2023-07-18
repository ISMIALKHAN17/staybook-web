import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { EncryptionService } from 'src/app/services/encryption.service';
@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent {
  @Output() sendTitle: EventEmitter<any> = new EventEmitter<any>();
  data: any;
  title:any = []
  city:any
  
  constructor(private route: ActivatedRoute , private router: Router , private encryptionService:EncryptionService) { }
  
  ngOnInit() {
    const hotelData:any = localStorage.getItem('hotel')
    const hotel = this.encryptionService.decryptData(hotelData,'staybook1700')
    this.data = JSON.parse(hotel!)
    const cityData:any = localStorage.getItem('city');
    const city = this.encryptionService.decryptData(cityData,'staybook1700')
    this.title = JSON.parse(city!)
    this.title = {...this.title , hotelFound:this.data.length}
  }
  truncateDescription(description: string): string {
    const words = description.split(' ');
    if (words.length <= 100) {
      return description;
    }
    const truncatedWords = words.slice(0, 100);
    return truncatedWords.join(' ') + '...';
  }
  navigateToHotelView(hotel: any) {

    this.router.navigate(['hotel-view'], { state: { data: hotel , url:window.location.href } });
}
}
