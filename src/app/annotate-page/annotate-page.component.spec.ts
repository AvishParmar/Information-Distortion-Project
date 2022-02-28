import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotatePageComponent } from './annotate-page.component';

describe('AnnotatePageComponent', () => {
  let component: AnnotatePageComponent;
  let fixture: ComponentFixture<AnnotatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnotatePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
