import { Component, OnInit } from '@angular/core';
import { DatasetService } from '../dataset.service';
import { HeadlineDOM } from '../HeadlineDOM';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  // ui component flags
  loginFlag: boolean;
  annotateFlag: boolean;
  validateFlag: boolean;
  homeFlag: boolean;
  backBtnLabel: string;
  backBtnIcon: string;

  //login data
  username!: string;
  password!: string;

  inputSrNo!: number;
  headline!: HeadlineDOM;

  constructor(private datasetService: DatasetService, private loginService: LoginService) {
    this.loginFlag = true;
    this.annotateFlag = false;
    this.validateFlag = false;
    this.homeFlag = false;
    this.backBtnIcon = "logout";
    this.backBtnLabel = "Logout";
  }

  ngOnInit(): void {
  }

  processLogin(username: string, password: string) {
    return this.loginService.authenticate(username, password).subscribe(
      (response) => {
        this.loginFlag = !response;
        this.homeFlag = response;
        this.backBtnLabel = this.username.split('.')[0].toUpperCase();
      },
      (error) => {
        console.log('[Error] Login Failed' + error);
        alert('[Error] Login Failed. Check username and password');
      })

  }

  getHeadlineData(inputSrNo: number): void {
    this.datasetService.getHeadlineData(inputSrNo).subscribe(
      (response) => {
        this.headline = new HeadlineDOM(response);
      },
      (error) => {
        console.log('[Error] Fetching headline data: ' + error);
        alert('Error fetching headline data');
        if (inputSrNo > 0) {
          this.getHeadlineData(inputSrNo - 1);
        }
      })
  }

  btnClick(mode: string): void {
    if (mode == 'annotate') {
      this.homeFlag = false;
      this.validateFlag = false;
      this.annotateFlag = true;
      this.backBtnIcon = "arrow_back_ios";
      this.backBtnLabel = "Back";
      console.log("Switiching visibility for " + mode);
    } else if (mode == 'validate') {
      this.homeFlag = false;
      this.annotateFlag = false;
      this.validateFlag = true;
      this.backBtnIcon = "arrow_back_ios";
      this.backBtnLabel = "Back";
      console.log("Switiching visibility for " + mode);
    } else if (mode == 'home') {
      if (!this.homeFlag) {
        this.homeFlag = true;
        this.annotateFlag = false;
        this.validateFlag = false;
        this.backBtnIcon = "logout";
        this.backBtnLabel = this.username.split('.')[0].toUpperCase();
      } else if (!this.loginFlag) {
        this.homeFlag = false;
        this.loginFlag = true;
      }
      console.log("Switiching visibility for " + mode);
    } else if (mode == 'search') {
      this.getHeadlineData(this.inputSrNo);
    } else if (mode == 'login') {
      if (this.username == null) {
        alert('Please enter your username');
      }
      else if (this.password == null) {
        alert('Please enter your password');
      }
      else {
        this.processLogin(this.username, this.password);
      }
    }
  }
}