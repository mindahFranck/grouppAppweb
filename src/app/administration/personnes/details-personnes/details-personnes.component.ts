import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/app.breadcrumb.service';
import { FormService } from 'src/app/demo/service/base.service';

@Component({
  selector: 'app-details-personnes',
  templateUrl: './details-personnes.component.html',
  styleUrls: ['./details-personnes.component.scss']
})
export class DetailsPersonnesComponent implements OnInit{
  personne:any;
  loads: boolean = false;
  id: any;
  pourcentage:any;

  constructor(private route: ActivatedRoute, private service: FormService, private breadcrumbService: BreadcrumbService,private router: Router){
      this.breadcrumbService.setItems([
        { label: 'Liste Des Personnes', routerLink:"/administration/personnes/list"},
        { label: 'Details Personnes'},
    ]);
    
  }
  ngOnInit(){
    this.id = this.route.snapshot.params['id'];
    this.loads = true ;
    this.service.getById("personnes",this.id).subscribe({
      next: data =>{
          this.personne = data.data;
          this.pourcentage = data.pourcentage
  

      },
      error: err => console.error('Observable emitted an error: ' + err),
      complete: () =>      this.loads = false,

   });
  }
  redirect(id){
    console.log(id)
    this.router.navigateByUrl(`administration/personnes/details/${id}` )
    this.ngOnInit()
  }
}
