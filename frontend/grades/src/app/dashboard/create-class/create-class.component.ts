import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/http-service.service';

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.css']
})
export class CreateClassComponent implements OnInit {
  createClassForm: FormGroup;
  days = ['Mon-Wed-Fri', 'Tue-Thu', 'Mon-Tue-Wed-Thu-Fri'];

  constructor(private httpService: HttpServiceService) { }

  ngOnInit() {
    this.createClassForm = new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'starts': new FormControl(null, [Validators.required]),
      'ends': new FormControl(null, [Validators.required]),
      'days': new FormControl(null, [Validators.required]),
      'capacity': new FormControl(null, [Validators.required])
    });
  }

  onSubmit() {
    console.log(this.createClassForm.value);
    this.httpService.createClass(this.createClassForm.value)
    .subscribe(
      (response) => {
         console.log(response);
      },
      (error) => console.log(error)
    );
  }

}
