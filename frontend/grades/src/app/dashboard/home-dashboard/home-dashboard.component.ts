import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from 'src/app/http-service.service';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-home-dashboard',
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.css']
})
export class HomeDashboardComponent implements OnInit {
  classes = [];
  constructor(private httpService: HttpServiceService, private store: Store<any>) { }

  ngOnInit() {
    this.store.select('applicationState')
    .subscribe(
        state => {
          console.log(state);
        if (state.type === 'student') {
          this.httpService.getScheduleStudent()
          .subscribe(
            (response) => {
               console.log(response);
               if (response.msg) {
                 this.leanClasses(response.msg);
               }
            },
            (error) => console.log(error)
          );
        } else if (state.type === 'professor') {
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
        } else {

        }
      }
    );
  }

  leanClasses(arr) {
    if (arr) {
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
          if (a.days) {
            const days_arr = a.days.split('-');
            for (const d of days_arr) {
                obj[d] = true;
            }
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

}
