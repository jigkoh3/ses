import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { navigation } from 'app/navigation/navigation';
import { Router } from '@angular/router';

import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseNavigation, FuseNavigationItem } from '@fuse/types';
import { group } from '@angular/animations';

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy {
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];
    currentUser;
    user;
    role;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,
        private _fuseNavigationService: FuseNavigationService,
        private router: Router
    ) {
        // Set the defaults

        this.userStatusOptions = [
            {
                'title': 'Online',
                'icon': 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon': 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon': 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon': 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon': 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];

        this.languages = [
            {
                id: 'en',
                title: 'English',
                flag: 'us'
            },
            {
                id: 'tr',
                title: 'Turkish',
                flag: 'tr'
            }
        ];

        this.navigation = navigation;



        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, { 'id': this._translateService.currentLang });



        this.currentUser = JSON.parse(localStorage.getItem('SEScurrentUser'));
        if (this.currentUser.user) {
            this.user = this.currentUser.user;
            // Get your navigation array from database or file
            if (this.currentUser.role) {
                this.navigation = this.getNavigation(this.currentUser.role);

                // Register the navigation to the service
                this._fuseNavigationService.register('main', this.navigation);

                // Set the main navigation as our current navigation
                this._fuseNavigationService.setCurrentNavigation('main');
            }

        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void {
        // Do your search here...
        console.log(value);
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }

    getNavigation(role) {
        let items: FuseNavigation[] = [];
        if (role) {
            if (role.auth_role_menu) {

                let headers = _.filter(role.auth_role_menu, x => x.menu_sub == 0);
                headers = _.orderBy(headers, "menu_sequence")
                // "role_id": 28,
                // "application_id": 10,
                // "menu_id": 64,
                // "menu_name": "Pricing White",
                // "menu_url": "pricingwhite",
                // "menu_sequence": 0,
                // "menu_sub": 62,
                // "menu_icon": "fa flaticon-folder"
                
                for (let header of headers) {
                    let group: FuseNavigation;
                    if (header.menu_url == '#') {
                        group = {
                            id: header.menu_id,
                            title: header.menu_name,
                            type: 'group',
                            icon: header.menu_icon.replace('fa flaticon-', ''),
                            children: []
                        };
                        let details = _.filter(role.auth_role_menu, x => x.menu_sub == group.id);
                        details = _.orderBy(details, "menu_sequence")

                        for (let detail of details) {
                            let item: FuseNavigationItem;
                            item = {
                                id: detail.menu_id,
                                title: detail.menu_name,
                                type: 'item',
                                icon: detail.menu_icon.replace('fa flaticon-', ''),
                                url: detail.menu_url
                            }
                            group.children.push(item);
                        }
                    } else {
                        group = {
                            id: header.menu_id,
                            title: header.menu_name,
                            type: 'item',
                            icon: header.menu_icon.replace('fa flaticon-', ''),
                            url: header.menu_url
                        };
                    }
                    items.push(group);
                }  
            }
        }
        return items;
    }

    logout() {
        console.log('Logout');
        this.router.navigate(['/login'])
    };
}
