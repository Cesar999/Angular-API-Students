import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsClassComponent } from './subs-class.component';

describe('SubsClassComponent', () => {
  let component: SubsClassComponent;
  let fixture: ComponentFixture<SubsClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
