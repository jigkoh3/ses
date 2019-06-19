import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-pricing-trans-form',
  templateUrl: './pricing-trans-form.component.html',
  styleUrls: ['./pricing-trans-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PricingTransFormComponent implements OnInit {

  action: string;
  // contact: Contact;
  contactForm: FormGroup;
  dialogTitle: string;

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

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Contact';
      // this.contact = _data.contact;
    }
    else {
      this.dialogTitle = 'New Contact';
      // this.contact = new Contact({});
    }

    this.contactForm = this.createContactForm();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create contact form
   *
   * @returns {FormGroup}
   */
  createContactForm(): FormGroup {
    return this._formBuilder.group({
      // id: [this.contact.id],
      // name: [this.contact.name],
      // lastName: [this.contact.lastName],
      // avatar: [this.contact.avatar],
      // nickname: [this.contact.nickname],
      // company: [this.contact.company],
      // jobTitle: [this.contact.jobTitle],
      // email: [this.contact.email],
      // phone: [this.contact.phone],
      // address: [this.contact.address],
      // birthday: [this.contact.birthday],
      // notes: [this.contact.notes]
    });
  }

  ngOnInit() {
  }

}
