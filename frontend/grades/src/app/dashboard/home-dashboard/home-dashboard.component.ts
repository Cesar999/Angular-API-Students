import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from 'src/app/http-service.service';

@Component({
  selector: 'app-home-dashboard',
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.css']
})
export class HomeDashboardComponent implements OnInit {
  classes = [];
  constructor(private httpService: HttpServiceService) { }

  ngOnInit() {
    this.httpService.getSchedule()
    .subscribe(
      (response) => {
         console.log(response);
         if (response.msg) {
           this.leanClasses(response.msg);
         }
      },
      (error) => console.log(error)
    );
  }

  leanClasses(arr) {
    const hours = {
      '8': true,
      '9': true,
      '10': true,
      '11': true,
      '12': true,
      '13': true,
    };

    const output = [];
    for (const a of arr) {
        const obj = {};
        obj = {...a};
        const days_arr = a.days.split('-');
        for (const d of days_arr) {
            obj[d] = true;
        }
        hours[a.starts] = false;
        output.push(obj);
    }

    for (const k in hours) {
      if (hours[k]) {
        output.push({starts: k});
      }
    }

    output.sort(function(a, b){
      return a.starts - b.starts;
    });

    console.log(output);
    this.classes = output;
  }

}
