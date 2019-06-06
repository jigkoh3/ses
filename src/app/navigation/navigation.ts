import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            
            {
                id       : 'pricing-raw',
                title    : 'Pricing Raw',
                translate: 'NAV.PRCR.TITLE',
                type     : 'item',
                icon     : 'email',
                url      : '/pricing-raw',
                badge    : {
                    title    : '25',
                    translate: 'NAV.PRCR.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
            },
            {
                id       : 'pricing-white',
                title    : 'Pricing White',
                translate: 'Pricing White',
                type     : 'item',
                icon     : 'email',
                url      : '/pricing-white',
                badge    : {
                    title    : '25',
                    translate: '12',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
            },
            {
                id       : 'contract',
                title    : 'Contract',
                translate: 'Contract',
                type     : 'item',
                icon     : 'email',
                url      : '/contracts',
                badge    : {
                    title    : '25',
                    translate: '12',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
            },
            {
                id       : 'Addendum',
                title    : 'Addendum',
                translate: 'Addendum',
                type     : 'item',
                icon     : 'email',
                url      : '/Addendum',
                badge    : {
                    title    : '25',
                    translate: '12',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
            }
        ]
    }
];
