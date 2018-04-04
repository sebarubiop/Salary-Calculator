import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = "Tax Estimation Calculator";
  income: number = 50000;
  newIncome: number;
  types = [
    { id: 0, name: "Gross" },
    { id: 1, name: "Gross + Superannuation" }];
  type: number = 0;
  superAmount: number;
  superPercentage: number = 9.5;
  taxRate: number;
  netSalary: number;
  netSuper: number;
  showSpinner: boolean = false;
  displayedColumns = ['superannuation', 'gross', 'grossSuper', 'tax', 'net', 'netSuper'];
  ELEMENT_DATA: Element[];
  dataSource;

  calculateSalary() {
    // clean the datatable
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);

    this.showSpinner = true;
    
    //Simulating a rest api request
    setTimeout(() => {

      if(this.type == 0){ //Gross (i.e. $50,000)
        this.superAmount = this.income * (this.superPercentage / 100);// (i.e. $50,000 * 9.5% = $4,750)
        this.taxRate = this.calculateTax(this.income);// (i.e. $7,797 - after calculateTax)
        this.netSalary = this.income - this.taxRate;// (i.e. $50,000 - $7,797 = $42,203)
        this.netSuper = this.netSalary + this.superAmount;
        this.ELEMENT_DATA = [
          {superannuation: this.superAmount, gross:this.income, grossSuper:this.income+this.superAmount, tax: this.taxRate, net: this.netSalary, netSuper: this.netSuper}];
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);

      }else if(this.type == 1){ //Gross + SuperAnnuation
        this.superAmount = this.income * (this.superPercentage / 100);// (i.e. $50,000 * 9.5% = $4,750)
        this.newIncome = this.income - this.superAmount;// (i.e. $50,000 - $4,750 = $45,250)
        this.taxRate = this.calculateTax(this.newIncome);// (i.e. $6,253.25 - after calculateTax)
        this.netSalary = this.newIncome - this.taxRate;// (i.e. $45,250 - $6,253.25 = $38,996.75)
        this.netSuper = this.netSalary + this.superAmount;
        this.ELEMENT_DATA = [
          {superannuation: this.superAmount, gross:this.newIncome, grossSuper:this.income, tax: this.taxRate, net: this.netSalary, netSuper: this.netSuper}];
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      } 

      this.showSpinner = false;
      
    }, 1000);
  }

  calculateTax(amount): number {
    let tax: number, amountDiff: number;
    if(amount <= 18200)
      return 0;
    if(amount >= 18201 && amount <= 37000)
      tax = amount * 0.19;
    if(amount >= 37001 && amount <= 87000){
      amountDiff = amount - 37000;
      tax = (amountDiff * 0.325) + 3572;
    }
    if(amount >= 87001 && amount <= 180000){
      amountDiff = amount - 87000;
      tax = (amountDiff * 0.37) + 19822;
    }
    if(amount >= 180001){
      amountDiff = amount - 180000;
      tax = (amountDiff * 0.45) + 54232;
    }
    return tax;
  }
}

export interface Element {
  superannuation: number;
  gross?: number;
  grossSuper?: number;
  tax: number;
  net: number;
  netSuper: number;
}
