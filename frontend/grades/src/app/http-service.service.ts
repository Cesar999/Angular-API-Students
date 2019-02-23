import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

interface User {
  username: String;
  password: String;
  type?: String;
}

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(private http:  HttpClient) { }

  postLogin(user: User) {
    return this.http.post('http://localhost:3000/login', user, {withCredentials: true});
 }

 postRegister(user: User) {
  return this.http.post('http://localhost:3000/register', user);
}

getSecret() {
  return this.http.get('http://localhost:3001/secret',
  {withCredentials: true});
}


}
