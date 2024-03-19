import { Component, OnInit } from '@angular/core';
import { ApplicationComponent } from './administration/application.component';
import { FormService } from './demo/service/base.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[];
    etudiant : any[];

    constructor(public app: ApplicationComponent, private formService: FormService) { }

    ngOnInit() {
        this.model = [
            {label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/administration']},
            {label: 'Administration', icon: 'pi pi-fw pi-th-large',visible: this.formService.hasDroitAccess(['administrateur']),
            items: [    
                {label: 'Utilisateurs', icon: 'pi pi-fw pi-user', routerLink: ['/administration/utilisateur']},
    
                {label: 'Rôles', icon: 'pi pi-fw pi-ticket', routerLink: ['/administration/roles']},
    
    
            ]
        },
            {label: 'Personnes', icon: 'pi pi-fw pi-users',visible: this.formService.hasDroitAccess(['administrateur', 'organisation', 'agents','ong']), routerLink: ['/administration/personnes']},
            {label: 'Menage', icon: 'pi pi-fw pi-building',visible: this.formService.hasDroitAccess(['administrateur', 'agents']), routerLink: ['/administration/menage']},
            {label: 'Territoriale', icon: 'pi pi-fw pi-th-large',visible: this.formService.hasDroitAccess(['administrateur', 'organisation', 'agents','ong']),
            items: [    
                {label: 'Regions', icon: 'pi pi-check pi-th-large', routerLink: ['/administration/regions']},
                {label: 'Departements', icon: 'pi pi-check pi-th-large', routerLink: ['/administration/departements']},

                {label: 'Communes', icon: 'pi pi-check pi-th-large', routerLink: ['/administration/communes']},
                {label: 'Quartiers', icon: 'pi pi-fw pi-table', routerLink: ['/administration/quartiers']},

            ]
        },

            {label: 'Vulnerabilités', icon: 'pi pi-fw pi-tags',visible: this.formService.hasDroitAccess(['administrateur', 'organisation', 'agents','ong']), routerLink: ['/administration/vulnerabilite']},

        ];
   
    }
}
