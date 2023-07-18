import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerBannerComponent } from './inner-banner.component';

describe('InnerBannerComponent', () => {
  let component: InnerBannerComponent;
  let fixture: ComponentFixture<InnerBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InnerBannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnerBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
