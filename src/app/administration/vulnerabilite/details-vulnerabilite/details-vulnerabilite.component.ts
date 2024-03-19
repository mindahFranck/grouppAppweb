import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'src/app/app.breadcrumb.service';
import { FormService } from 'src/app/demo/service/base.service';

@Component({
  selector: 'app-details-vulnerabilite',
  templateUrl: './details-vulnerabilite.component.html',
  styleUrls: ['./details-vulnerabilite.component.scss']
})
export class DetailsVulnerabiliteComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private service: FormService, private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'Liste Des Quartiers', routerLink: "/administration/quartiers/list" },
      { label: 'Details Quarties' },
    ]);

  }

  // Declaration de la propriete qui contiendra l'identifiant recupere dans l'url.
  vulnerabilityDetails;
  vulnerabilityID: number;
  loader = false;
  hasResidences = false;

  // Getting the department's name:
  subInfo: any;

  ngOnInit() {
    // Recupere l'id dans l'url.
    this.vulnerabilityID = this.activatedRoute.snapshot.params['id'];
    this.loader = true;
    this.getQuartierDetails();
  }

  // Getting the departement's name
  // get departement() {
  //   this.service.getById("departements", this.vulnerabilityDetails?.commune.departement_id).subscribe({
  //     next: department => this.subInfo = department,
  //     error: error => console.error('Observable emitted an error: ' + error)
  //   });

  //   return this.subInfo.departement;
  // }


  // Fonction pour recuperer les details d'un quartier
  getQuartierDetails() {
    this.service.getById('vulnerabilites', this.vulnerabilityID).subscribe({
      next: data => {
        this.vulnerabilityDetails = data;
        console.log(this.vulnerabilityDetails);
      },
      error: err => console.error('Observable emitted an error: ' + err),
      complete: () => this.loader = false,
    });
    console.log(this.vulnerabilityDetails);

  }

  // Fonction qui verifie si un quartier a ou non une residence
  checkHasResidences() {
    this.vulnerabilityDetails.residences.length == 0 ? this.hasResidences = false : this.hasResidences = true;
    return this.hasResidences;
  }
}
