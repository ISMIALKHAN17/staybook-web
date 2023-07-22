import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { RequestService } from 'src/app/services/request.service';
import { EncryptionService } from 'src/app/services/encryption.service'; // Import the EncryptionService
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
 screen:any = 'login'
 showPassword: boolean = false;
 loginForm!: any;
 loading = false
 signupForm:any

 constructor(private formBuilder: FormBuilder , private req:RequestService,private authService: AuthService,  private encryptionService: EncryptionService , private router: Router) {}
 ngOnInit() {
   this.loginForm = this.formBuilder.group({
     email: ['', [Validators.required, Validators.email]],
     password: ['', [Validators.required]]
   });
   this.signupForm = this.formBuilder.group({
    fullName: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
 }
 signup() {
  this.loading = true
  if (this.signupForm.valid) {
    this.req.post('user/add', this.signupForm.value, true).subscribe(
      (res: any) => {
          this.loading = false
          const user = JSON.stringify(res);
          const encryptedUser = this.encryptionService.encryptData(user, 'stayBookLogin');
          localStorage.setItem('user', encryptedUser);               
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Signup successful!'
        });
      },
      (error: any) => {
          this.loading = false
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to signup. Please try again.'
        });
      }
    );
  } else {
      this.loading = false
    console.log('Invalid form data');
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Please fill in all required fields.'
    });
  }
}
 onSubmit() {
  this.loading = true
  if (this.loginForm.invalid) {
    return;
  }
    this.req.post('login', this.loginForm.value, true).subscribe(
      (res: any) => {
        if(res.email !== 'Invalid credentials'){
          this.loading = false;
          const user = JSON.stringify(res);
          const encryptedUser = this.encryptionService.encryptData(user, 'stayBookLogin');
          localStorage.setItem('user', encryptedUser);
        this.authService.setLoggedInStatus(true);
        Swal.fire({
          icon: 'success',
          title: 'Login Success',
          text: 'You have successfully logged in!',
          timer: 2000,
          timerProgressBar: true
        });
        const roomReserve = localStorage.getItem('roomReserve')
        if(roomReserve === 'true'){
          this.router.navigate(['/reservation']);
          localStorage.removeItem('roomReserve')
        }else{
          this.router.navigate(['/']);
        }
      }else{
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid email or password!',
          timer: 2000,
          timerProgressBar: true
        });
      }
      },
      (error: any) => {
        this.loading = false;
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid email or password!',
          timer: 2000,
          timerProgressBar: true
        });
      }
    );
  }
togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}
   // Form is valid, perform login logic here
}
