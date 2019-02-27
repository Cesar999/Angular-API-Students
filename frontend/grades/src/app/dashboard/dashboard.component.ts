import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../http-service.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private httpService: HttpServiceService, private store: Store<any>, private router: Router) { }

  isStudent = false;
  isProfessor = false;

  ngOnInit() {
    this.store.select('applicationState')
    .subscribe(
        state => {
          console.log(state);
        if (state.type === 'student') {
          this.isStudent = true;
          this.isProfessor = false;
        } else if (state.type === 'professor') {
          this.isProfessor = true;
          this.isStudent = false;
        } else {
          this.isProfessor = false;
          this.isStudent = false;
        }
      }
    );
  }

  logOut() {
    this.httpService.deleteCookie()
    .subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['/login']);
      },
      (error) => console.log(error)
    );

  }

}
