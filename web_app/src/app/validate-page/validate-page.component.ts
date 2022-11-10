import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatasetService } from '../dataset.service';
import { distortion_categories, HeadlineDOM } from '../HeadlineDOM';
import * as globalVars from '../global-vars';

@Component({
  selector: 'app-validate-page',
  templateUrl: './validate-page.component.html',
  styleUrls: ['./validate-page.component.css']
})
export class ValidatePageComponent implements OnInit {

  @Input() headline!: HeadlineDOM;
  @Input() username!: string;
  selectedAnnotation!: [number, string, string];
  editFlag: boolean;
  editBtnLabel: string;
  submitBtnLabel: string;
  editBtnIcon: string;
  inputDist!: string;
  distortion_categories: String[];

  constructor(private datasetService: DatasetService, private _snackBar: MatSnackBar) {
    this.editFlag = false;
    this.editBtnIcon = "edit";
    this.editBtnLabel = "Edit annotation";
    this.submitBtnLabel = "Approve";
    this.distortion_categories = distortion_categories;
  }

  ngOnInit(): void {
    this.getHeadlineData(-1);
  }

  getHeadlineData(srno: number): void {
    this.datasetService.getValidateData(srno).subscribe(
      (response) => {
        this.headline = new HeadlineDOM(response);
      },
      (error) => {
        console.log('[Error] Fetching headline data: ' + error);
        alert('Error fetching headline data');
        if (srno > 0) {
          this.getHeadlineData(srno - 1);
        }
      })
  }

  editHeadlineData(): void {
    this.datasetService.editAnnotateData(this.headline.srno, this.username, 'Draft', this.selectedAnnotation[0], this.inputDist).subscribe(
      (response) => {
        this.headline = new HeadlineDOM(response);
      },
      (error) => {
        console.log('[Error] Fetching headline data: ' + error);
        alert('Error fetching headline data');
        if (this.headline.srno > 0) {
          this.getHeadlineData(this.headline.srno - 1);
        }
      })
  }

  submitValidateData(): void {
    this.datasetService.submitValidateData(this.headline.srno, 'Final', this.selectedAnnotation[0]).subscribe(
      (response) => {
        this.headline = new HeadlineDOM(response);
      },
      (error) => {
        console.log('[Error] Fetching headline data: ' + error);
        alert('Error fetching headline data');
        if (this.headline.srno > 0) {
          this.getHeadlineData(this.headline.srno - 1);
        }
      })
  }

  onSelection(event: any, value: any) {
    // console.log(value[0].value); 
    // let selIdx = 0;
    // for (let i = 0; i < this.headline.annotations.length; i++) {
    //   if(this.headline.annotations[i].distortion_category == value[0].value.distortion_category 
    //     && this.headline.annotations[i].dist_headline == value[0].value.dist_headline){
    //       selIdx = i;
    //       break
    //     }
    // }

    this.selectedAnnotation = [value[0].value.idx, value[0].value.distortion_category, value[0].value.dist_headline];
  }

  btnClick(mode: string): void {
    if (mode == 'submit') {
      if (this.editFlag) {
        this.editHeadlineData()
        this.inputDist = ''
        this.selectedAnnotation = [-1, '', '']
        this.btnClick('edit')
      } else {
        if (this.selectedAnnotation == null || this.selectedAnnotation[0] == -1) {
          alert('Please select an annotation to approve');
        }
        else {
          if (confirm('Confirm: Approve selected annotation?')) {
            this.submitValidateData()
          }
        }
      }
    } else if (mode == 'next') {
      this.selectedAnnotation = [-1, '', ''];
      this.getHeadlineData(this.headline.srno)
    } else if (mode == 'prev' && this.headline.srno > 0) {
      this.selectedAnnotation = [-1, '', ''];
      this.getHeadlineData(this.headline.srno - 2)
    }
    else if (mode == 'edit') {
      this.editFlag = !this.editFlag;
      if (this.editFlag) {
        if (this.selectedAnnotation == null || this.selectedAnnotation[0] == -1) {
          alert('Please select an annotation to edit');
          this.editFlag = !this.editFlag;
        }
        else {
          this.editBtnIcon = "cancel";
          this.editBtnLabel = "Cancel Edit";
          this.submitBtnLabel = "Submit Edit";
        }
      }
      else {
        this.editBtnIcon = "edit";
        this.editBtnLabel = "Edit annotation";
        this.submitBtnLabel = "Approve";
      }
    }
  }

  getDistortionExample(): string {
    return 'Example of ' + this.selectedAnnotation[1] + ' distortion:' +
      '\n\nOriginal Headline: ' + (globalVars.distortionExamples as any)[this.selectedAnnotation[1]].ogHeadline +
      '\n\nDistortion: ' + (globalVars.distortionExamples as any)[this.selectedAnnotation[1]].distortion
  }

  openSnackBar() {
    this._snackBar.open(this.getDistortionExample(), 'Dismiss', {
      duration: 15000,
      horizontalPosition: "center",
      verticalPosition: "bottom",
      panelClass: ['example-snackbar']
    });
  }
}
