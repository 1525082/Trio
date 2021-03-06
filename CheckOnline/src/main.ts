import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment.prod';
import {AppModule} from './app/app.module';
import {CheckDataService} from "./app/services/check-data.service";
import {ModalMessageService} from "./app/services/modal-message.service";
import {TooltipService} from "./app/services/tooltip.service";

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule,
    [CheckDataService, ModalMessageService, TooltipService]).catch(err => console.log(err));
