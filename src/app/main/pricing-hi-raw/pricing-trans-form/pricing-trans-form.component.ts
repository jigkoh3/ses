import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { pricing_tran } from 'app/shared';

@Component({
  selector: 'app-pricing-trans-form',
  templateUrl: './pricing-trans-form.component.html',
  styleUrls: ['./pricing-trans-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PricingTransFormComponent implements OnInit {

  action: string;
  trans: pricing_tran;
  transForm: FormGroup;
  dialogTitle: string;
  contract_years: any;
  contract_months: any;

  /**
   * Constructor
   *
   * @param {MatDialogRef<ContactsContactFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    public matDialogRef: MatDialogRef<PricingTransFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder
  ) {
    // Set the defaults
    this.action = _data.action;
    this.contract_years = _data.contract_years;
    this.contract_months = _data.contract_months;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Contact';
      // this.contact = _data.contact;
    }
    else {
      this.dialogTitle = 'New Contact';
      this.trans = new pricing_tran();
    }

    this.transForm = this.createForm();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create contact form
   *
   * @returns {FormGroup}
   */
  createForm(): FormGroup {
    return this._formBuilder.group({
      order_date: [this.trans.order_date, Validators.required],
      sell_lots: [this.trans.sell_lots, Validators.required],
      buy_lots: [this.trans.buy_lots, Validators.required],
      ag_month_id: [this.trans.ag_month,Validators.required],
      ag_year: [this.trans.ag_year,Validators.required],
      priced: [this.trans.priced],
      execute_on: [this.trans.execute_on]
      
    });
  }

  ngOnInit() {
  }

}
