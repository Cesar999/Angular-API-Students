import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(public router: Router, private store: Store<any>) {}

  canActivate(): Observable<boolean>|boolean {
    return this.store.select('applicationState')
    .pipe(
      map(
        state => {
          console.log(state);
        if (state.auth === false) {
          this.router.navigate(['login']);
          return false;
        } else {
          return true;
        }
      })
    );
  }

}
