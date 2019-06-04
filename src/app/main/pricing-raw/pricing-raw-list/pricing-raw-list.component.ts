import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from '../i18n/en';
import { locale as turkish } from '../i18n/tr';
@Component({
  selector: 'app-pricing-raw-list',
  templateUrl: './pricing-raw-list.component.html',
  styleUrls: ['./pricing-raw-list.component.scss']
})
export class PricingRawListComponent implements OnInit {
  foods: any = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' }
  ];

  constructor(
    public route: Router
    // private _fuseTranslationLoaderService: FuseTranslationLoaderService
  ) {
    // this._fuseTranslationLoaderService.loadTranslations(english, turkish);
  }

  ngOnInit() {
  }

  onDetail() {
    this.route.navigate(['/pricing-Detail'])
  }
}
