import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEventDetailComponent } from './admin-event-detail.component';

describe('AdminEventDetailComponent', () => {
  let component: AdminEventDetailComponent;
  let fixture: ComponentFixture<AdminEventDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEventDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEventDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
