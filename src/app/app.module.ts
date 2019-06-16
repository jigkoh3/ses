import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
// import { SampleModule } from 'app/main/sample/sample.module';
// import { PricingRawModule } from 'app/main/pricing-raw/pricing-raw.module';
// import { ContractModule } from 'app/main/contract/contract.module';
// import { PricingWhiteModule } from 'app/main/pricing-white/pricing-white.module'
// import { AddendumModule } from './main/addendum/addendum.module';

import { AuthGuard, AuthenticationService, MasterService } from './shared'
import { ODataConfiguration, ODataServiceFactory } from "angular-odata-es5";
const appRoutes: Routes = [

    { path: '', loadChildren: './main/main.module#MainModule', canActivate: [AuthGuard] },
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
    // { path: 'session-expire', loadChildren: './session-expire/session-expire.module#SessionExpireModule' },
    // { path: 'error', loadChildren: './server-error/server-error.module#ServerErrorModule' },
    // { path: 'access-denied', loadChildren: './access-denied/access-denied.module#AccessDeniedModule' },
    { path: 'not-found', loadChildren: './login/login.module#LoginModule' },
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        // SampleModule,
        // PricingRawModule,
        // ContractModule,
        // PricingWhiteModule,
        // AddendumModule
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [AuthGuard, AuthenticationService, MasterService, ODataServiceFactory, ODataConfiguration],
})
export class AppModule {
}
