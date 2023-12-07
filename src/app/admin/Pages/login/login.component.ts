import { Component } from '@angular/core';
import { AuthGoogleService } from '../../../auth-google.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
constructor(private AuthGoogleService : AuthGoogleService){}

  login() {
    this.AuthGoogleService.login();
  }
}
