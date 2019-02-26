import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetGradesComponent } from './get-grades.component';

describe('GetGradesComponent', () => {
  let component: GetGradesComponent;
  let fixture: ComponentFixture<GetGradesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetGradesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
