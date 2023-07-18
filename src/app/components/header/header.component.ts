import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EncryptionService } from 'src/app/services/encryption.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(
    private authService: AuthService,
    private encryptionService: EncryptionService
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.getLoggedInStatus();
  }

  get userName(): any {
    const encryptedUserData = localStorage.getItem('user');
    if (!encryptedUserData) {
      return null;
    }

    const secretKey = 'stayBookLogin';
    const userData = this.encryptionService.decryptData(
      encryptedUserData,
      secretKey
    );

    if (!userData) {
      return null;
    }

     // Log decrypted user data

    return JSON.parse(userData);
  }

  logout(): void {
    this.authService.setLoggedInStatus(false);
  }
}
