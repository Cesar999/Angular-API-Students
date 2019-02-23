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

  ngOnInit() {

  }

}
