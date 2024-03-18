import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { BreadcrumbService } from 'src/app/app.breadcrumb.service';
import { FormService } from 'src/app/demo/service/base.service';

@Component({
  selector: 'app-list-quartiers',
  templateUrl: './list-quartiers.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./list-quartiers.component.scss']
})
export class ListQuartiersComponent {
  load: boolean = false;
  titlePage = 'Quartiers';
  formTitle: any;
  state: boolean = false;
  deleteDialog: boolean = false;
  formState: boolean = false;
  deleteState = false;

  communeData;
  form: FormGroup;
  tableColumns = [
    { header: 'Libelle', field: 'libelle' },
  ];

  tableData = [];
  cols = [];
  temporaile: any = {};

  formsFields = [
    { name: 'idCommunes', label: 'Communes', type: 'dropdown', validators: [Validators.required], state: "commune" },
    { name: 'libelle', label: 'Libelle', type: 'text', validators: [Validators.required] },
  ];





  constructor(private service: FormService, private fb: FormBuilder, private breadcrumbService: BreadcrumbService, private messageService: MessageService,) {
    this.breadcrumbService.setItems([
      { label: 'Liste Des Quartiers' },
    ]);
  }

  ngOnInit(): void {
    this.getAlls();
    this.getAllCommunes();
    this.form = this.fb.group({
      id: [''],
      idCommunes: ['', Validators.required],
      libelle: ['', [Validators.required, Validators.minLength(4)]]
    });
  }


  // getters
  get id() { return this.form.get('id') }
  get idCommunes() { return this.form.get('idCommunes') }
  get libelle() { return this.form.get('libelle') }

  getAlls() {
    this.load = true;
    this.service.getAll("quartiers").subscribe({
      next: value => {
        this.tableData = value;
      },
      error: err => console.error('Observable emitted an error: ' + err),
      complete: () => { this.load = false },
    });
  }

  getAllCommunes() {
    this.service.getAll('communes').subscribe({
      next: value => this.communeData = value,
      error: error => console.error('Observable emitted an error:', error),
      complete: () => this.load = false
    });
  }

  edit(val: any) {
    this.temporaile = {};
    this.formTitle = "Modifier une Quartier";
    this.temporaile = { ...val };
    this.formState = true;
  }






  add() {
    this.temporaile = {};

    this.formTitle = "Ajouter une Quartier";
    this.formState = true;
  }


  // Print list
  printListe() {

  }

  openCreateQuarterModal() {
    this.formState = true;
  }

  // Ajouter un nouveau quartier
  addQuarter() {
    if (this.form.valid) {
      this.service.create('quartiers', this.form.value)
        .subscribe(value => {
          this.formState = false;
          console.log('Created successfully !', value);
          this.ngOnInit();
        });
    } else {
      this.form.markAllAsTouched();
    }
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  //open delete Dialog

  async opendeleteDialog(val: any) {
    this.temporaile = { ...val };
    this.deleteDialog = true;

  }

  //editer quartier
  modifier() {
    if (this.form.invalid) {
      // Marquez tous les champs comme touchés pour afficher les erreurs
      this.form.markAllAsTouched();
    } else {
      this.state = true
      this.service.update("quartiers", this.form.value, this.form.value.id).subscribe({
        next: value => console.log(value),
        error: err => {
          this.state = false,
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message, life: 3000 });
        },
        complete: () => {
          this.state = false;
          this.form.reset();
          this.formState = false

          this.ngOnInit();

          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Ajouté avec success', life: 3000 });
        },

      });
    }
  }
  //supprimer un quartier

  deleteQuartier() {
    this.state = true;
    this.service.delete("quartiers" + "/" + this.temporaile.id).subscribe((result) => {
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Supprimer avec success', life: 3000 });
      this.state = false;

      this.deleteDialog = false;
      this.ngOnInit();
      this.temporaile = {};

    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.message, life: 5000 });
        this.state = false;
      })

  }
}
