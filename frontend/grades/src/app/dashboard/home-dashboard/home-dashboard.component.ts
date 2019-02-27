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

  elements = [
    {h: 8, mon: {name: '', prof: ''}, tue: {name: '', prof: ''},
    wed: {name: '', prof: ''}, thu: {name: '', prof: ''}, fri: {name: '', prof: ''}},

    {h: 9, mon: {name: '', prof: ''}, tue: {name: '', prof: ''},
    wed: {name: '', prof: ''}, thu: {name: '', prof: ''}, fri: {name: '', prof: ''}},

    {h: 10, mon: {name: '', prof: ''}, tue: {name: '', prof: ''},
    wed: {name: '', prof: ''}, thu: {name: '', prof: ''}, fri: {name: '', prof: ''}},

    {h: 11, mon: {name: '', prof: ''}, tue: {name: '', prof: ''},
    wed: {name: '', prof: ''}, thu: {name: '', prof: ''}, fri: {name: '', prof: ''}},

    {h: 12, mon: {name: '', prof: ''}, tue: {name: '', prof: ''},
    wed: {name: '', prof: ''}, thu: {name: '', prof: ''}, fri: {name: '', prof: ''}},

    {h: 13, mon: {name: '', prof: ''}, tue: {name: '', prof: ''},
    wed: {name: '', prof: ''}, thu: {name: '', prof: ''}, fri: {name: '', prof: ''}},
  ];

  constructor(private httpService: HttpServiceService, private store: Store<any>) { }

  ngOnInit() {
    this.store.select('applicationState')
    .subscribe(
        state => {
          // console.log(state);
        if (state.type === 'student') {
          this.httpService.getScheduleStudent()
          .subscribe(
            (response) => {
               // console.log(response);
               if (response['msg']) {
                  this.leanClasses(response['msg']);
               }
            },
            (error) => console.log(error)
          );
        } else if (state.type === 'professor') {
          this.httpService.getSchedule()
          .subscribe(
            (response) => {
               // console.log(response);
               if (response['msg']) {
                 this.leanClasses(response['msg']);
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
    const obj_arr = [];
    for (const a of arr) {
      if (a.days) {
        const temp = a.days.split('-');
        const obj = {...a};
        for (const d of temp) {
          obj[d] = true;
        }
        // console.log(obj);
        obj_arr.push(obj);
      }
    }

   for (const a of obj_arr) {
     // console.log(a);
      for (const e of this.elements) {
        if (e.h === a.starts) {
          if (a.Mon) {
            e.mon.name = a.name;
            e.mon.prof = `Prof. ${a.professor.username}`;
          }
          if (a.Tue) {
            e.tue.name = a.name;
            e.tue.prof = `Prof. ${a.professor.username}`;
          }
          if (a.Wed) {
            e.wed.name = a.name;
            e.wed.prof = `Prof. ${a.professor.username}`;
          }
          if (a.Thu) {
            e.thu.name = a.name;
            e.thu.prof = `Prof. ${a.professor.username}`;
          }
          if (a.Fri) {
            e.fri.name = a.name;
            e.fri.prof = `Prof. ${a.professor.username}`;
          }
        }
      }
   }

  }

}
