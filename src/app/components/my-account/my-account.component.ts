import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { EncryptionService } from 'src/app/services/encryption.service';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css'],
  providers:[DatePipe]
})
export class MyAccountComponent {
  bookings:any = []
  user:any


  constructor(private req:RequestService , private encryptionService:EncryptionService,private datePipe: DatePipe){}

  ngOnInit(): void {
    const secretKey = 'stayBookLogin';
    const encryptedUserData:any = localStorage.getItem('user')
    const userData = this.encryptionService.decryptData(
      encryptedUserData,
      secretKey
    );
    this.user = JSON.parse(userData)
    this.req.post('reservation/detail',{customer_id : this.user.id},true).subscribe((res:any)=>{
      this.bookings = res.data
    })
  }
}
