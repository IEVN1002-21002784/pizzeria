import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablacompraComponent } from './tablacompra.component';

describe('TablacompraComponent', () => {
  let component: TablacompraComponent;
  let fixture: ComponentFixture<TablacompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablacompraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablacompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
