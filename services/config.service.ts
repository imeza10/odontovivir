import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Config } from 'src/app/models/config';
import { CONFIG_LS_NAME, SESSION_LS_NAME, SESSION_TYPE_NAME } from 'src/app/models/consts';
import { fromBinary, toBinary } from 'utils/encrypter.helper';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private _storage: any = {};
  private readonly _assetsConfig;

  get config(): Config {
    if(!!this._storage[CONFIG_LS_NAME]) 
      return this._storage[CONFIG_LS_NAME];
    
    const dataStorage = this._getStorage(CONFIG_LS_NAME);
    if (!!dataStorage?.urlBase) 
      return dataStorage;

    return new Config();
  }

  constructor(private http: HttpClient) {
    this._assetsConfig = 'assets/config/config.json';
  }

  clean() {
    sessionStorage.removeItem(SESSION_TYPE_NAME);

    sessionStorage.removeItem(SESSION_LS_NAME);
    localStorage.removeItem(SESSION_LS_NAME);
    
    localStorage.removeItem(CONFIG_LS_NAME); 
  }

  async getAppConfig(): Promise<void> {
    try {
      if(!this.config?.urlApi){
        this._storage[CONFIG_LS_NAME] = await this.http.get<Config>(this._assetsConfig).toPromise();
        if (!!this._storage[CONFIG_LS_NAME])
          this._setStorage(CONFIG_LS_NAME, this._storage[CONFIG_LS_NAME]);
      }
      
      return;
    } catch (error) {
      this.clean();
      console.error(`ConfigService: ${error}`);
    }
  }

  private _getStorage = (_localName: string): any => {
    try{
      const dataStorage = localStorage.getItem(_localName);
      this._storage[_localName] = !!dataStorage ? JSON.parse(fromBinary(dataStorage)) : null;
      return this._storage[_localName];
    } catch (error) {
      return null;
    }
  }

  private _setStorage = (_localName: string, objet: any): void => {
    this._storage[_localName] = objet;
    localStorage.setItem(_localName, toBinary(JSON.stringify(this._storage[_localName])));
  }
}