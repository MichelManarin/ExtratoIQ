import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { KeyValuePair } from '@app/models/key-value-pair';
import { BasePagedListModel } from '@app/shared/base/base-paged-list.model';

@Injectable({
  providedIn: 'root',
})
export class BaseApiService<T = any> {
  urlPadrao = environment.apiUrl || 'http://localhost:3000/api';

  constructor(public api: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    params: new HttpParams(),
  };

  getPagedData(route: string, query: KeyValuePair[]): Observable<BasePagedListModel<T>> {
    let params = new HttpParams();

    query.forEach((x) => {
      params = params.append(x.Key, x.Value);
    });

    this.httpOptions.params = params;

    return this.api.get<BasePagedListModel<T>>(`${this.urlPadrao}/${route}`, this.httpOptions);
  }

  getBlob(route: string): Observable<any> {
    return this.api.get(`${this.urlPadrao}/${route}`, { responseType: 'blob' });
  }

  get(route: string, query?: KeyValuePair[]): Observable<T> {
    if (query) {
      let params = new HttpParams();
      query.forEach((x) => {
        params = params.append(x.Key, x.Value);
      });
      this.httpOptions.params = params;
    }
    return this.api.get<T>(`${this.urlPadrao}/${route}`, this.httpOptions);
  }

  getAll(route: string, query?: KeyValuePair[]): Observable<Array<T>> {
    if (query) {
      let params = new HttpParams();
      query.forEach((x) => {
        params = params.append(x.Key, x.Value);
      });
      this.httpOptions.params = params;
    }
    return this.api.get<Array<T>>(`${this.urlPadrao}/${route}`, this.httpOptions);
  }

  getById(route: string, id: any): Observable<T> {
    return this.api.get<T>(`${this.urlPadrao}/${route}/${id}`, this.httpOptions);
  }

  post(route: string, body: object): Observable<any> {
    return this.api.post<any>(`${this.urlPadrao}/${route}/`, { item: body }, this.httpOptions);
  }

  postFormData(route: string, body: FormData): Observable<any> {
    const httpOptionsFormData = {
      headers: new HttpHeaders({
        enctype: 'multipart/form-data',
      }),
      reportProgress: true,
      observe: 'events' as 'body',
    };

    return this.api.post<any>(`${this.urlPadrao}/${route}/`, body, httpOptionsFormData);
  }

  put(route: string, body: object): Observable<any> {
    return this.api.put<any>(`${this.urlPadrao}/${route}/`, { item: body }, this.httpOptions);
  }

  postOrPut(route: string, body: object, mode: string): Observable<any> {
    if (mode == 'POST')
      return this.api.post<any>(`${this.urlPadrao}/${route}/`, { item: body }, this.httpOptions);
    else return this.api.put<any>(`${this.urlPadrao}/${route}/`, { item: body }, this.httpOptions);
  }

  delete(
    route: string,
    id?: string | number | null,
    query?: KeyValuePair[] | null,
    body?: object | null
  ): Observable<any> {
    // Se query params forem fornecidos
    if (query) {
      let params = new HttpParams();
      query.forEach((x) => {
        params = params.append(x.Key, x.Value);
      });
      this.httpOptions.params = params;
    }

    // DELETE com ID na rota
    if (id) {
      return this.api.delete<any>(`${this.urlPadrao}/${route}/${id}`, this.httpOptions);
    }

    // DELETE com body
    if (body) {
      // Necessário para permitir envio de body no DELETE
      const options = {
        ...this.httpOptions,
        body: { item: body }, // Adiciona o body ao options
      };
      return this.api.delete<any>(`${this.urlPadrao}/${route}`, options);
    }

    // DELETE sem ID, query ou body
    return this.api.delete<any>(`${this.urlPadrao}/${route}`, this.httpOptions);
  }
}

