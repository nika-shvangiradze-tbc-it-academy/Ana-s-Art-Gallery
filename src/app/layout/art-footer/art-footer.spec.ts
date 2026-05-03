import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtFooter } from './art-footer';

describe('ArtFooter', () => {
  let component: ArtFooter;
  let fixture: ComponentFixture<ArtFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtFooter],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
