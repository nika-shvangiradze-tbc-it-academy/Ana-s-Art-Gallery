import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Artworks } from './artworks';

describe('Artworks', () => {
  let component: Artworks;
  let fixture: ComponentFixture<Artworks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Artworks],
    }).compileComponents();

    fixture = TestBed.createComponent(Artworks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
