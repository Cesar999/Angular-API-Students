import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from 'src/app/http-service.service';

@Component({
  selector: 'app-get-grades',
  templateUrl: './get-grades.component.html',
  styleUrls: ['./get-grades.component.css']
})
export class GetGradesComponent implements OnInit {
  classes;
  constructor(private httpService: HttpServiceService) { }

  ngOnInit() {
    this.httpService.getGrades()
    .subscribe(
      (response) => {
         console.log(response);
         this.classes = response;
      },
      (error) => console.log(error)
    );
  }

}
