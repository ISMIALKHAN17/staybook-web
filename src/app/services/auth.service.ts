import { Injectable } from '@angular/core';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean;

  constructor(private encryptionService: EncryptionService) {
    // Check local storage for encrypted user login status on service initialization
    const encryptedStatus:any = localStorage.getItem('isLoggedIn');
    const secretKey = 'stayBookLogin'; // Replace this with your actual secret key
    const decryptedStatus = this.encryptionService.decryptData(encryptedStatus, secretKey);
    this.isLoggedIn = decryptedStatus === 'true';
  }

  // Set user login status
  setLoggedInStatus(value: boolean): void {
    this.isLoggedIn = value;
    const secretKey = 'stayBookLogin'; // Replace this with your actual secret key
    const encryptedStatus = this.encryptionService.encryptData(value ? 'true' : 'false', secretKey);
    localStorage.setItem('isLoggedIn', encryptedStatus);
  }

  // Get user login status
  getLoggedInStatus(): boolean {
    return this.isLoggedIn;
  }
}

