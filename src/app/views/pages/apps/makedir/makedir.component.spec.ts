import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakedirComponent } from './makedir.component';

describe('MakedirComponent', () => {
  let component: MakedirComponent;
  let fixture: ComponentFixture<MakedirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakedirComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakedirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
