import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment';
import {AppModule} from './app/app.module';
import {CheckDataService} from "./app/services/check-data.service";
import {ModalMessageService} from "./app/services/modal-message.service";
import {TooltipService} from "./app/services/tooltip.service";

if (environment.production) {
    //enableProdMode();
}
enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule,
    [CheckDataService, ModalMessageService, TooltipService]);
