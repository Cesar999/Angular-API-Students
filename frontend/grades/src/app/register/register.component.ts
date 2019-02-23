import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpServiceService} from '../http-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private httpService: HttpServiceService) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      'username': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required]),
      'confirm': new FormControl(null, [Validators.required]),
      'type': new FormControl(null, [Validators.required])
    });
  }

onSubmit(){
  console.log(this.registerForm);
  console.log(this.registerForm.value);
  this.httpService.postRegister(this.registerForm.value)
  .subscribe(
    (response) => {
      console.log(response);
    },
    (error) => console.log(error)
  );
}

}
