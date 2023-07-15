import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Character } from '../interfaces/character';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  readonly API = "https://www.moogleapi.com/api/v1/characters";

  constructor(private http: HttpClient) { }

  getCharacters(){
    return this.http.get<Character[]>(this.API);
  }
}
