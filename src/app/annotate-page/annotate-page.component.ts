import { Component, Input, OnInit } from '@angular/core';
import { DatasetService } from '../dataset.service';
import { HeadlineDOM } from '../HeadlineDOM';
import { distortion_categories } from '../HeadlineDOM';

@Component({
  selector: 'app-annotate-page',
  templateUrl: './annotate-page.component.html',
  styleUrls: ['./annotate-page.component.css']
})
export class AnnotatePageComponent implements OnInit {
  @Input() headline!: HeadlineDOM;
  inputDist!: string;
  inputDistCat!: string;
  distortion_categories: String[];

  constructor(private datasetService: DatasetService) {
    this.distortion_categories = distortion_categories;
  }

  ngOnInit(): void {
    this.getHeadlineData(-1);
  }

  getHeadlineData(srno: number): void {
    this.datasetService.getAnnotateData(srno).subscribe(
      (response) => {
        this.headline = new HeadlineDOM(response);
        // console.log(this.headline.annotations)
      },
      (error: Error) => {
        console.log('[Error] Fetching headline data: ' + error);
        alert('Error fetching headline data');
        if (srno > 0) {
          this.getHeadlineData(srno - 1);
        }
      }
    )
  }

  btnClick(mode: string): void {
    if (mode == 'submit') {
      // console.log(this.inputDist, this.inputDistCat);
      if (!this.inputDistCat) {
        alert('Please select a distortion category');
      } else if (!this.inputDist) {
        alert('Please enter a valid distortion');
      } else {
        if (confirm('Submit below distortion?')) {
          this.datasetService.submitAnnotateData(this.headline.srno, 'Draft', this.inputDistCat, this.inputDist)
            .subscribe((response) => {
              this.headline = new HeadlineDOM(response);
              // console.log(this.headline.annotations)
            });
            this.inputDist = '';
            this.inputDistCat = '';
        }
      }
    } else if (mode == 'next') {
      this.getHeadlineData(this.headline.srno)
      this.inputDist = '';
      this.inputDistCat = '';
    }
  }

}
