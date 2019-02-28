import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { url_fe_noty, url_fe_auth } from '../../../../urls_const.js';

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
    return this.http.post(url_fe_auth + '/login', user, {withCredentials: true});
 }

 postRegister(user: User){
    return this.http.post(url_fe_auth + '/register', user);
  }

  deleteCookie() {
    return this.http.get(url_fe_auth + '/delete-cookie', {withCredentials: true});
 }


  getSecret(type) {
    return this.http.post(url_fe_noty + '/secret', {type},
    {withCredentials: true});
  }

  createClass(_class: Class) {
    return this.http.post(url_fe_noty + '/create-class', _class, {withCredentials: true});
 }

 subsClass(_class: any) {
  return this.http.post(url_fe_noty + '/subs-class', _class, {withCredentials: true});
}

  loadClass() {
    return this.http.get(url_fe_noty + '/load-classes', {withCredentials: true});
  }

  getGrades() {
    return this.http.get(url_fe_noty + '/get-grades', {withCredentials: true});
  }

  getProfClasses() {
    return this.http.get(url_fe_noty + '/get-prof-classes', {withCredentials: true});
  }

  setGrade(obj) {
    return this.http.post(url_fe_noty + '/set-grade', obj, {withCredentials: true});
  }

  getSchedule() {
    return this.http.get(url_fe_noty + '/get-schedule', {withCredentials: true});
  }

  getScheduleStudent() {
    return this.http.get(url_fe_noty + '/get-schedule-student', {withCredentials: true});
  }


}
