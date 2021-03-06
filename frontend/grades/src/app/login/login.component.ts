import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpServiceService} from '../http-service.service';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  message = '';
  loginForm: FormGroup;
  constructor(
    private httpService: HttpServiceService,
     private authService: AuthServiceService,
     private router: Router,
     private store: Store<any>) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'username': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required])
    });
  }

  onSubmit() {
    // console.log(this.loginForm);
    // console.log(this.loginForm.value);
    this.httpService.postLogin(this.loginForm.value)
    .subscribe(
      (response) => {
        console.log(response);
        if (response['msg']) {
          this.message = response['msg'];
        }

        if (response['flag']) {
          setTimeout(() => {
            this.authService.toAuthenticate(response['type']);
          }, 1000);
        } else {
          setTimeout(() => {
            this.message = '';
          }, 2000);
        }
      },
      (error) => console.log(error)
    );
  }


}
