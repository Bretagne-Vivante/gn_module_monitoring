import { Observable, of, forkJoin } from '@librairies/rxjs';
import { mergeMap, concatMap } from '@librairies/rxjs/operators';

import { MonitoringObject } from '../../class/monitoring-object';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

// services
import { ActivatedRoute } from '@angular/router';
import { MonitoringObjectService } from '../../services/monitoring-object.service';
import { ConfigService } from '../../services/config.service';
import { DataUtilsService } from '../../services/data-utils.service';
import { MapService } from '@geonature_common/map/map.service';
import { AuthService, User } from '@geonature/components/auth/auth.service';

import { Utils } from '../../utils/utils';
@Component({
  selector: 'pnx-object',
  templateUrl: './monitoring-object.component.html',
  styleUrls: ['./monitoring-object.component.css'],
})
export class MonitoringObjectComponent implements OnInit {
  obj: MonitoringObject;
  module: MonitoringObject;
  sites: {};

  backendUrl: string;
  frontendModuleMonitoringUrl: string;

  objForm: FormGroup;

  bEdit = false;
  bLoadingModal = false;

  currentUser: User;

  objectsStatus: Object = {};
  heightMap;

  moduleSet = false;

  constructor(
    private _route: ActivatedRoute,
    private _objService: MonitoringObjectService,
    private _configService: ConfigService,
    private _dataUtilsService: DataUtilsService,
    private _formBuilder: FormBuilder,
    public mapservice: MapService,
    private _auth: AuthService
  ) {}

  ngOnInit() {
    const elements = document.getElementsByClassName(
      'monitoring-map-container'
    );
    if (elements.length >= 1) {
      elements[0].remove();
      // elements[0].remove();
    }

    const height =
      document.body.clientHeight - document.getElementById('object').offsetTop;
    document.getElementById('object').style.height = height - 20 + 'px';

    this.heightMap = height - 60 + 'px';

    this.currentUser = this._auth.getCurrentUser();
    this.currentUser['cruved'] = {};

    of(true)
      .pipe(
        mergeMap(() => {
          return this.initParams(); // parametres de route
        }),
        mergeMap(() => {
          return this.initConfig(); // initialisation de la config
        }),

        mergeMap(() => {
          return this.initData(); // recupérations des données Nomenclature, Taxonomie, Utilisateur.. et mise en cache
        }),

        mergeMap(() => {
          return this.getDataObject(); // récupération des données de l'object selon le type (module, site, etc..)
        })
      )
      .subscribe(() => {
        this.obj.initTemplate(); // pour le html

        // si on est sur une création (pas d'id et id_parent ou pas de module_code pour module (root))
        this.bEdit =
          this.bEdit ||
          (this.obj.isRoot() && !this.obj.moduleCode) ||
          (!this.obj.id && !!this.obj.parentId);
        this.bLoadingModal = false; // fermeture du modal



        this.obj.bIsInitialized = true; // obj initialisé
        if (!this.sites) {
          this.initSites();
        } else {
          this.initObjectsStatus();
        }
      });
  }

  getModuleSet() {
    // Verifie si le module est configué
    this.module.get(0).subscribe(() => {

      const schema = this._configService.schema(this.module.moduleCode, 'module');
      const moduleFieldList = Object.keys(this._configService.schema(this.module.moduleCode, 'module'))
      .filter(key => schema[key].required);
      this.moduleSet = moduleFieldList
        .every(v => ![null, undefined].includes(this.module.properties[v] || this.obj.properties[v]));
    });
  }

  initSites() {
    return this.module.get(1).subscribe(() => { // TODO liste indépendantes carte et listes

      this.currentUser['cruved'] = this.module.cruved;

      const sites = this.module['children']['site'];
      this.sites = {
        features: sites.map((site) => {
          site['id'] = site['properties']['id_base_site'];
          site['type'] = 'Feature';
          return site;
        }),
        type: 'FeatureCollection',
      };
      this.initObjectsStatus();
    });
  }

  initObjectsStatus() {
    const objectsStatus = {};
    for (const childrenType of Object.keys(this.obj.children)) {
      objectsStatus[childrenType] = this.obj.children[childrenType].map(
        (child) => {
          return {
            id: child.id,
            selected: false,
            visible: true,
            current: false
          };
        }
      );
    }


    // init site status
    if (this.obj.siteId) {
      objectsStatus['site'] = [];
      this.sites["features"].forEach(
        (f) => {
          // determination du site courrant
          let cur = false;
          if (f.properties.id_base_site == this.obj.siteId){
            cur = true;
          }

          objectsStatus['site'].push({
            id: f.properties.id_base_site,
            selected: false,
            visible: true,
            current: cur
          });
        }
      );
    }

    this.objectsStatus = objectsStatus;
  }

  initParams() {
    
    return this._route.paramMap.pipe(
      mergeMap((params) => {
        const objectType = params.get('objectType')
          ? params.get('objectType')
          : 'module';

        this.obj = new MonitoringObject(
          params.get('moduleCode'),
          objectType,
          params.get('id'),
          this._objService
        );

        this.module = new MonitoringObject(
          params.get('moduleCode'),
          'module',
          null,
          this._objService
        );

        

        this.obj.parentId = params.get('parentId');
        return this._route.queryParamMap;
      }),
      mergeMap((params) => {
        this.objForm = this._formBuilder.group({});
        this.obj.bIsInitialized = false;
        this.bLoadingModal = true;

        return of(true);
      })
    );
  }

  initConfig(): Observable<any> {
    return this._configService.init(this.obj.moduleCode).pipe(
      mergeMap(() => {
        this.frontendModuleMonitoringUrl = this._configService.frontendModuleMonitoringUrl();
        this.backendUrl = this._configService.backendUrl();
        return of(true);
      })
    );
  }

  initData(): Observable<any> {
    this.getModuleSet()
    return this._dataUtilsService.getInitData(this.obj.moduleCode);
  }

  getDataObject(): Observable<any> {
    return this.obj.get(1);
  }

  onObjChanged(obj: MonitoringObject) {
    if (obj['objectType'] === 'site') {
      this.initSites();
    }
    this.getModuleSet()
  }
}
