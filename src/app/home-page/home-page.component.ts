import { Component, OnInit } from '@angular/core';
import { DatasetService } from '../dataset.service';
import { HeadlineDOM } from '../HeadlineDOM';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  annotateFlag: boolean;
  validateFlag: boolean;
  homeFlag: boolean;
  inputSrNo!: number;
  headline!: HeadlineDOM;

  constructor(private datasetService: DatasetService) {
    this.annotateFlag = false;
    this.validateFlag = false;
    this.homeFlag = true;
  }

  ngOnInit(): void {
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
      console.log("Switiching visibility for " + mode);
    } else if (mode == 'validate') {
      this.homeFlag = false;
      this.annotateFlag = false;
      this.validateFlag = true;
      console.log("Switiching visibility for " + mode);
    } else if (mode == 'home') {
      this.homeFlag = true;
      this.annotateFlag = false;
      this.validateFlag = false;
      console.log("Switiching visibility for " + mode);
    } else if (mode == 'search') {
      this.getHeadlineData(this.inputSrNo);
    }
  }
}