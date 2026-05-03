import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtHeader } from './art-header';

describe('ArtHeader', () => {
  let component: ArtHeader;
  let fixture: ComponentFixture<ArtHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
