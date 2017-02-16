import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment';
import {AppModule} from './app/app.module';
import {AuthenticationService} from "./app/authentication.service";
import {CheckDataService} from "./app/check-data.service";
import {ModalMessageService} from "./app/modal-message.service";

if (environment.production) {
    //enableProdMode();
}
enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule,
    [AuthenticationService, CheckDataService, ModalMessageService]);
