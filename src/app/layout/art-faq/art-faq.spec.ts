import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtFaq } from './art-faq';

describe('ArtFaq', () => {
  let component: ArtFaq;
  let fixture: ComponentFixture<ArtFaq>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtFaq],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtFaq);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
