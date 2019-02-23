import { Injectable } from '@angular/core';
import { HttpServiceService } from './http-service.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(
    private httpService: HttpServiceService,
    private store: Store<any>,
    private router: Router) { }

  toAuthenticate(type): any {
    this.httpService.getSecret(type)
    .subscribe(
      (response) => {
        // console.log('response', response);
        if (response['validate']) {
          // console.log('Validated');
          this.storeAuth(response['validate']);
          this.storeType(response['type']);
          this.router.navigate(['/dashboard']);
        } else {
          console.log('No Validated');
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  storeAuth(data) {
    this.store.dispatch({
      type: 'AUTHENTICATE',
      payload: data
    });
  }

  storeType(data) {
    this.store.dispatch({
      type: 'TYPE',
      payload: data
    });
  }

}
