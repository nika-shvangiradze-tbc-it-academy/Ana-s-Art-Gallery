import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtAbout } from './art-about';

describe('ArtAbout', () => {
  let component: ArtAbout;
  let fixture: ComponentFixture<ArtAbout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtAbout],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtAbout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
