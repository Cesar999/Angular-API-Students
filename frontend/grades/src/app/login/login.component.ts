import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpServiceService} from '../http-service.service';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private httpService: HttpServiceService, private authService: AuthServiceService, private router: Router) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'username': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required])
    });
  }

  onSubmit() {
    console.log(this.loginForm);
    console.log(this.loginForm.value);
    this.httpService.postLogin(this.loginForm.value)
    .subscribe(
      (response) => {
        console.log(response);
        if (response['flag']) {
          this.router.navigate(['/dashboard']);
        }
      },
      (error) => console.log(error)
    );
  }

  getSecret() {
    this.httpService.getSecret()
    .subscribe(
      (response) => {
        console.log(response);
      },
      (error) => console.log(error)
    );
  }

}
