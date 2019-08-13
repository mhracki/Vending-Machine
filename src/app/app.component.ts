import { Component } from "@angular/core";
import { Item } from "./item";
import { Coin } from "./coin";
import { FormGroup,FormBuilder, Validators,  } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "Vending-Machine";

  itemArray: Item[] = [];
  dolarCoins: Coin[] = [];
  coinNames: string[] = ["Nickel", "Dime", "Quater", "Dollar"];
  coinValues: number[] = [0.05, 0.1, 0.25, 1];
  names: string[] = ["a", "b", "c"];
  prices: number[] = [0.65, 1, 1.5];
  restcoins: Coin[] = [];
  machCoinQua: number = 50;
  insertedmoney: number = 0;
  selectedItemId: number;
  CoinsinMach:number[]=[];
  lcdSwitch="";
  show:boolean = false;
  public servicePanel:FormGroup;
  constructor (private formbuilder:FormBuilder){

  }
  ngOnInit(): void {

    this.servicePanel = this.formbuilder.group({
      coin:[0],
      quantity:[0,Validators.pattern('[-0-9 ]*')],
      items:[0],
      quantityitems:[0,Validators.pattern('[-0-9]*')]
    });

    for (let i = 0; i < this.names.length; i++) {
      this.itemArray[i] = {
        id: i,
        name: this.names[i],
        price: this.prices[i],
        quantity: 20,
      };
    }
    for (let i = 0; i < this.coinNames.length; i++) {
      this.dolarCoins[i] = {
        id: i,
        name: this.coinNames[i],
        value: this.coinValues[i],
        counter: 0
      };
      this.restcoins[i] = {
        id: i,
        name: this.coinNames[i],
        value: this.coinValues[i],
        counter: this.machCoinQua
      };
    }
    
    this.lcdSwitch="Chose Item";
  }
  showpanel(){
    this.show =true;
  }
  addCoins(){
    
    if(this.servicePanel.status!=="INVALID"){
      this.restcoins[this.servicePanel.value.coin].counter+=this.servicePanel.value.quantity;
      this.itemArray[this.servicePanel.value.items].quantity+=this.servicePanel.value.quantityitems;
      if(this.restcoins[this.servicePanel.value.coin].counter<0){
        this.restcoins[this.servicePanel.value.coin].counter=0;
      }
      if(this.itemArray[this.servicePanel.value.items].quantity<0){
        this.itemArray[this.servicePanel.value.items].quantity=0;
      }

    }
  }

  
  insertCoin(coin: number) {
    this.lcdSwitch=`Loaded coin  ${coin}$`;
    this.insertedmoney += coin;
    this.insertedmoney = Math.round(this.insertedmoney * 100) / 100;
    this.lcdSwitch+=` Total is ${this.insertedmoney} $`;
    for (let i = 0; i < this.dolarCoins.length; i++) {
      if (coin === this.dolarCoins[i].value) {
        this.dolarCoins[i].counter += 1;
      }
    }
  }
  removeCoins(){
    for (let i = 0; i < this.dolarCoins.length; i++) {
              this.dolarCoins[i].counter = 0;      
    }
    this.insertedmoney=0;
  }

  chosen(id: number) {
    this.selectedItemId = id;
    this.lcdSwitch=`Selected  ${this.itemArray[id].name.toUpperCase()} Price : ${this.itemArray[id].price}$ Insert a Coin`;
  }
  buy() {
   // debugger;
    if(this.selectedItemId===undefined){
      this.lcdSwitch="Select item first";
    }else{
    if(this.itemArray[this.selectedItemId].quantity<=0)
    {
  this.lcdSwitch=`Item ${this.itemArray[this.selectedItemId].name } is not avaiable chose another item`;
    } else 
    if (this.insertedmoney < this.itemArray[this.selectedItemId].price) {
      
      
      this.lcdSwitch=`Insert a coin, left ${Math.round((this.itemArray[this.selectedItemId].price-this.insertedmoney) *100)/100}$ `;
      
    } else {
      for(let i = this.restcoins.length-1; i >= 0; i--){
        this.CoinsinMach[i]=this.restcoins[i].counter;
      }
      let crest =this.insertedmoney - this.itemArray[this.selectedItemId].price;
      this.itemArray[this.selectedItemId].quantity-=1;
      console.log("ilość przedmiotw w",this.itemArray[this.selectedItemId].quantity);
      crest=Math.round(crest *100)/100;
      this.lcdSwitch=`You bought item ${this.itemArray[this.selectedItemId].name} rest ${crest} `;
      
      if (crest > 0) {
        this.rest(crest);
        this.lcdSwitch+="returned "
        for (let i = this.restcoins.length-1; i >= 0; i--) {
          
          if (this.restcoins[i].counter < this.CoinsinMach[i]) {
            this.lcdSwitch+=(this.CoinsinMach[i]- this.restcoins[i].counter)+" ";
            this.lcdSwitch+=this.restcoins[i].name + " ";
            while (this.restcoins[i].counter > this.CoinsinMach[i]) {
              this.restcoins[i].counter -= 1;
              
              
            }
          }
        }
      }
      
      for(let i = this.restcoins.length-1; i >= 0; i--){
        this.restcoins[i].counter+=this.dolarCoins[i].counter;
      }
      this.removeCoins();
    }}
    
  }
  rest = x => {
    
    while (x > 0.049) {
      x=Math.round(x *100)/100;
      
      if (x >=1&&this.restcoins[3].counter>0) {
        this.restcoins[3].counter -= 1;
        x = x - 1;
      } else if (x >= 0.25&&this.restcoins[2].counter>0) {
        this.restcoins[2].counter -= 1;
        x = x - 0.25;
      } else if (x >= 0.1&&this.restcoins[1].counter>0) {
        this.restcoins[1].counter -= 1;
        x = x - 0.1;
      } else if (x >= 0.05&&this.restcoins[0].counter>0) {
        this.restcoins[0].counter -= 1;
        x = x - 0.05;
      } else{
        this.lcdSwitch="Sorry! machine is empty, no money will be ";
        break;
      }
    }
  };

  returnM() {
    this.lcdSwitch="returned";
    for (let i = 0; i < this.dolarCoins.length; i++) {
      this.lcdSwitch+=` ${this.dolarCoins[i].counter} ${this.dolarCoins[i].name}s ` ;
      let count=this.dolarCoins[i].counter;
      if(count>0){
        for (let j = 0; j < count; j++) {
        
          this.dolarCoins[i].counter-=1;
        }
      }
      
    }
    this.removeCoins();
    
  }
}
