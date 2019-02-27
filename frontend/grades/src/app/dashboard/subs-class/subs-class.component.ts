import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from 'src/app/http-service.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';

interface Classy {
  name: String;
  starts: Number;
  ends: Number;
  days: String;
  capacity: Number;
  professor: any;
}

@Component({
  selector: 'app-subs-class',
  templateUrl: './subs-class.component.html',
  styleUrls: ['./subs-class.component.css']
})

export class SubsClassComponent implements OnInit {
  classes = [];
  subsClassForm: FormGroup;

  cardName: String;
  cardStarts: Number;
  cardEnds: Number;
  cardDays: String;
  cardCapacity: Number;
  cardProfessor: any;

  constructor(private httpService: HttpServiceService) { }

  ngOnInit() {
    this.subsClassForm = new FormGroup({
      'class': new FormControl(null, [Validators.required])
    });

    this.httpService.loadClass()
    .subscribe(
      (response) => {
         console.log(response);
         this.classes = response['arr'];
      },
      (error) => console.log(error)
    );
  }

  onSubmit() {
    // console.log(this.subsClassForm.value);
    this.httpService.subsClass(this.subsClassForm.value)
    .subscribe(
      (response) => {
         console.log(response);
         this.subsClassForm.reset();
      },
      (error) => console.log(error)
    );
  }

  populateCard() {
    // console.log(this.subsClassForm.value);
    let obj: Classy;
    const id = this.subsClassForm.value.class;
    for (const e of this.classes) {
        if (e._id === id) {
          obj = e;
          this.cardName = obj.name;
          this.cardStarts = obj.starts;
          this.cardEnds = obj.ends;
          this.cardDays = obj.days;
          this.cardCapacity = obj.capacity;
          this.cardProfessor = obj.professor.username;
          break;
        }
    }
  }

}
