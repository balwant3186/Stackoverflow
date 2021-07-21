import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../environments/environment";
import { map, catchError } from "rxjs/operators";
import { throwError, Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ApiService {

constructor(private http: HttpClient) { }

  get(path: string) {
    const url = environment.api_url + "&" + path;

    console.log('url', url)
    return this.http.get(url).pipe(
        map((res: Response) => res),
        catchError((error: Response) => throwError(error))
    );
  }


}
