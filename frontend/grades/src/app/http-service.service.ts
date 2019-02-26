import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

interface User {
  username: String;
  password: String;
  type?: String;
}

interface Class {
  name: String;
  starts: Number;
  ends: Number;
  days: String;
  capacity: Number;
}

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(private http:  HttpClient) { }

  postLogin(user: User) {
    return this.http.post('http://localhost:3000/login', user, {withCredentials: true});
 }

 postRegister(user: User){
    return this.http.post('http://localhost:3000/register', user);
  }

  getSecret(type) {
    return this.http.post('http://localhost:3001/secret', {type},
    {withCredentials: true});
  }

  createClass(_class: Class) {
    return this.http.post('http://localhost:3001/create-class', _class, {withCredentials: true});
 }

 subsClass(_class: any) {
  return this.http.post('http://localhost:3001/subs-class', _class, {withCredentials: true});
}

  loadClass() {
    return this.http.get('http://localhost:3001/load-classes', {withCredentials: true});
  }

  getGrades() {
    return this.http.get('http://localhost:3001/get-grades', {withCredentials: true});
  }

}
