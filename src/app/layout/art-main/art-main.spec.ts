import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtMain } from './art-main';

describe('ArtMain', () => {
  let component: ArtMain;
  let fixture: ComponentFixture<ArtMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtMain],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtMain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
