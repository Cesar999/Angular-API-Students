import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../http-service.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private httpService: HttpServiceService, private store: Store<any>) { }

  ngOnInit() {
    this.httpService.getSecret()
    .subscribe(
      (response) => {
        console.log('response', response);
        if (response['validate']) {
          console.log('Validated');
          this.storeState();
        } else {
          console.log('No Validated');
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  storeState() {
    // this.store.select('applicationState')
    //   .subscribe(
    //     state => {
    //     if (state) {
    //       this.num1 = state.from1_num1;
    //       this.num2 = state.from1_num2;
    //     }
    //   });
  }

  // num1Changed() {
  //   this.store.dispatch({
  //     type: 'FORM1_NUM1',
  //     payload: this.num1
  //   });
  // }

}
