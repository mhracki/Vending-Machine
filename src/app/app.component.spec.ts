import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';


let fixture :ComponentFixture<AppComponent>;
let comp:AppComponent;


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports : [
        ReactiveFormsModule,
        ]
    }).compileComponents().then(() =>{
fixture= TestBed.createComponent(AppComponent);
comp = fixture.componentInstance;
// de =fixture.debugElement.query(By.css('form'));
// el = de.nativeElement;
    });
  }));
  
 
  it('should create the app', () => {
    comp.ngOnInit();
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('it should inserted dime +1', () => {
    comp.ngOnInit();
    comp.insertCoin(0.25);
    expect(comp.dolarCoins[2].counter).toEqual(1);

  });

  it('rest should be 1x dollar, 3x quater, 1x dime, 1x nickel', () => {
    comp.ngOnInit();
    let temprest = comp.restcoins[0].counter;
    let temprest1 = comp.restcoins[1].counter;
    let temprest2 = comp.restcoins[2].counter;
    let temprest3 = comp.restcoins[3].counter;

    
    comp.rest(1.90);
    expect(comp.restcoins[0].counter).toEqual(temprest-1);
    expect(comp.restcoins[1].counter).toEqual(temprest1-1);
    expect(comp.restcoins[2].counter).toEqual(temprest2-3);
    expect(comp.restcoins[3].counter).toEqual(temprest3-1);

  });


  it('Should substract 1 item B from table and rest should be 2x dollar ', () => {
    comp.ngOnInit();
    let temprest = comp.restcoins[3].counter;
    let temp = comp.itemArray[1].quantity;
    comp.selectedItemId=1;
    comp.insertedmoney=3;
    comp.buy();
    expect(comp.itemArray[1].quantity).toEqual(temp-1);
    expect(comp.restcoins[3].counter).toEqual(temprest-2);
  
   

  });

  
 
});
