import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  encryptData(data: any, secretKey: string): string {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    return encryptedData;
  }

  decryptData(encryptedData: string, secretKey: string): any {
    if (!encryptedData) {
      console.error('Encrypted data is empty or null');
      return null;
    }
  
    try {
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
      const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
      if (!decryptedData) {
        console.error('Failed to decrypt data');
        return null;
      }
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null;
    }
  }
  
}
