import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'src/app/app.breadcrumb.service';
import { FormService } from 'src/app/demo/service/base.service';

type Commune = {
  id: number;
  code: string;
  commune: string;
  departement_id: number;
  createdAt: Date;
  updatedAt: Date;
};
// Type de données acceptables par un quartier
type QuartierDetails<T> = {
  id: number;
  libelle: string;
  idCommunes: number;
  createdAt: Date;
  updatedAt: Date;
  commune: T;
  residences: string[];
};


@Component({
  selector: 'app-details-quartiers',
  templateUrl: './details-quartiers.component.html',
  styleUrls: ['./details-quartiers.component.scss']
})
export class DetailsQuartiersComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private service: FormService, private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'Liste Des Quartiers', routerLink: "/administration/quartiers/list" },
      { label: 'Details Quarties' },
    ]);

  }

  // Declaration de la propriete qui contiendra l'identifiant recupere dans l'url.
  quartierID: number;
  quartierDetails: QuartierDetails<Commune>;
  loader = false;
  hasResidences = false;

  // Getting the department's name:
  subInfo: any;

  ngOnInit() {
    // Recupere l'id dans l'url.
    this.quartierID = this.activatedRoute.snapshot.params['id'];
    this.loader = true;
    this.getQuartierDetails();
  }

  // Getting the departement's name
  get departement() {
    this.service.getById("departements", this.quartierDetails?.commune.departement_id).subscribe({
      next: department => this.subInfo = department,
      error: error => console.error('Observable emitted an error: ' + error)
    });

    return this.subInfo.departement;
  }


  // Fonction pour recuperer les details d'un quartier
  getQuartierDetails() {
    this.service.getById('quartiers', this.quartierID).subscribe({
      next: data => {
        this.quartierDetails = data;
        console.log(this.quartierDetails);
      },
      error: err => console.error('Observable emitted an error: ' + err),
      complete: () => this.loader = false,
    });
    console.log(this.quartierDetails);

  }

  // Fonction qui verifie si un quartier a ou non une residence
  checkHasResidences() {
    this.quartierDetails.residences.length == 0 ? this.hasResidences = false : this.hasResidences = true;
    return this.hasResidences;
  }
}
