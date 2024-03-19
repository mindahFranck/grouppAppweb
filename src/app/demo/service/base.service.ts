/* /* eslint-disable no-console */
import { HttpResponse, HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as FileSave from 'file-saver';
import { Import } from '../interface/import';
import readXlsxFile from 'read-excel-file';
import { MessageService } from 'primeng/api';
import { AuthentificationsService } from './auth.service';



@Injectable({ providedIn: 'root' })
export class FormService {
  modulesAccess= this.auth.role;

  constructor(private http: HttpClient, private messageService: MessageService,private auth:AuthentificationsService) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'rejectUnauthorized': 'false'
    })
  }
  getAll(api: string): Observable<any> {
    //console.log(this.endpoint)
    return this.http
      .get(`${environment.apiUrl}/${api}`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  getFiliere(api: string, faculteId: number, diplomeId: number) {
    return this.http.get<any>(`${environment.apiUrl}/${api}/faculte?faculteId=${faculteId}&diplomeId=${diplomeId}`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  getFiliereBy(api: string, faculteId: number, diplomeId: number) {
    return this.http.get<any>(`${environment.apiUrl}/${api}?faculteId=${faculteId}&diplomeId=${diplomeId}`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  getDepartements(api: string, regionId: number) {
    return this.http.get<any>(`${environment.apiUrl}/${api}?regionId=${regionId}`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  getArrondissement(api: string, departementId: number) {
    return this.http.get<any>(`${environment.apiUrl}/${api}?departId=${departementId}`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  getData(api: string): Observable<any> {
    console.log("Get Data from " + api);
    return this.http
      .get(`${environment.apiUrl}/${api}`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  getParameteres() {
    return this.http
      .get(`${environment.apiUrl}/` + "administration/institutions/parametres", this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  create(api: string, form: any): Observable<any> {
    console.log("Create ok ", form)
    console.log(`${api}`, JSON.stringify(form));
    return this.http.post<any>(`${environment.apiUrl}/${api}`, JSON.stringify(form), this.httpOptions)

      .pipe(

        catchError(this.handleError)
      )

  }

  pv(api: string, form: any): Observable<any> {
    console.log("Create ok", form)
    return this.http.post<any>(`${environment.apiUrl}/${api}`, JSON.stringify(form), this.httpOptions)
      .pipe(
        retry(0),
        catchError(this.handleError)
      )

  }


  update(api: string, form: any, id: number): Observable<any> {
    console.log("Update ok", form);

    return this.http.put<any>(`${environment.apiUrl}/${api}/${id}`, JSON.stringify(form), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )

  }


  updates(api: string, form: any): Observable<any> {
    console.log("Update ok", form);

    return this.http.put<any>(`${environment.apiUrl}/${api}/${form.id}`, JSON.stringify(form), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )

  }


  delete(api: string) {
    console.log("Delete ok")
    return this.http.delete<any>(`${environment.apiUrl}/${api}`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }



  getById(api: string, id: number) {
    return this.http.get<any>(`${environment.apiUrl}/${api}/${id}`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  getState(): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/` + "state", this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  getByEnrollement(api: string, type: string) {
    return this.http.get<any>(`${environment.apiUrl}/${api}/${type}`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  getDataReinscription(url: any, data: any) {
    return this.http.get<any>(`${environment.apiUrl}/${url}?faculteId=${data.faculteId}&typeReinscription=${data.typeReinscription}&matricule=${data.matricule}&nom=${data.nom}&prenom=${data.prenom}&cni=${data.cni}&email=${data.email}&confirmationEmail=${data.confirmationEmail}`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage;

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.status == 201) {
        errorMessage = { "code": error.status, "message": "OK" };

      } else {
        errorMessage = { "code": error.status, "message": error.error.message };

      }
    }
    return throwError(errorMessage);
  }


  generateExcel(title, data) {
    if (data.length > 0) {

      data.map(item => {
        delete item['id'];
        delete item['createdByUser'];
        delete item['createdDate'];
        delete item['lastModifiedByUser'];
        delete item['lastModifiedDate'];
        delete item['isDefault'];

        if (item.hasOwnProperty('inscriptions') && item.hasOwnProperty('fullName') && item.hasOwnProperty('nbrePaiement') && item.hasOwnProperty('soldeTotal')) {
          delete item['fullName'];
          item['dernierDiplome'] = 'dernierDiplomeCode'
          delete item['inscriptions'];
          delete item['nbrePaiement'];
          delete item['soldeTotal'];
          delete item['matricule'];


        }



      })
    } else {
      data = [];
    }
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, title);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSave.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }



  makePdf2(title: string, data: any) {
    const winUrl = URL.createObjectURL(
      new Blob([data], { type: "text/html" })
    );

    const win = window.open(
      winUrl,
      "win",
      `width=800,height=400,screenX=200,screenY=200`
    );
  }

  printListe(title: string, data: any) {
    const win = window.open(
      '',
      title,
      `width=800,height=400,screenX=200,screenY=200`
    );
    win.document.write('<html><head><title>' + title + '</title><link rel="stylesheet" type="text/css" href="../../../print.css"></head><body>');
    win.document.write(data);
    win.document.write('</body></html>');
    win.print();
    win.close();
  }


  public makePdf(title: string, data: any) {
    const win = window.open(
      '',
      title,
      `width=800,height=400,screenX=200,screenY=200`
    );
    win.document.write('<html><head><title>' + title + '</title><link rel="stylesheet" type="text/css" href="../../../print.css"></head><body>');
    win.document.write(data);
    win.document.write('</body></html>');

  }

  generateRandomChars(prefix: string, length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return prefix + result;
  }
  hasDroitAccess(key: any){

    return key.includes(JSON.parse(this.modulesAccess));

  }
}
