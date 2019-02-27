import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from 'src/app/http-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-set-grade',
  templateUrl: './set-grade.component.html',
  styleUrls: ['./set-grade.component.css']
})
export class SetGradeComponent implements OnInit {
  arr;
  classes;

  cardName = 'none';
  cardStarts = '0';
  cardEnds = '0';

  students;

  setGradeForm: FormGroup;

  constructor(private httpService: HttpServiceService) { }

  ngOnInit() {
    this.setGradeForm = new FormGroup({
      'class': new FormControl(null, [Validators.required]),
      'student': new FormControl(null, [Validators.required]),
      'grade': new FormControl(null, [Validators.required])
    });

    this.httpService.getProfClasses()
    .subscribe(
      (response) => {
         this.arr = response;
         this.classes = response['msg'];
      },
      (error) => console.log(error)
    );

  }

  populateCard() {
    const temp = this.setGradeForm.value.class;
    for (const e of this.classes) {
      if (e._id === temp) {
        this.cardName = e.name;
        this.cardStarts = e.starts;
        this.cardEnds = e.ends;
        this.students = e.students;
      }
    }
  }

  onSubmit() {
    console.log(this.setGradeForm.value);
    this.httpService.setGrade(this.setGradeForm.value)
    .subscribe(
      (response) => {
         console.log(response);
         this.setGradeForm.reset();
      },
      (error) => console.log(error)
    )
  }

}
