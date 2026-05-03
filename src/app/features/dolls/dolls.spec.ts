import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dolls } from './dolls';

describe('Dolls', () => {
  let component: Dolls;
  let fixture: ComponentFixture<Dolls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dolls],
    }).compileComponents();

    fixture = TestBed.createComponent(Dolls);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
