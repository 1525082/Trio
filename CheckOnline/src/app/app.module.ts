import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {FooterComponent} from './footer/footer.component';
import {NavbarComponent} from './navbar/navbar.component';
import {DeleteProfileComponent} from './delete-profile/delete-profile.component';
import {ChapterComponent} from './chapter/chapter.component';
import {ChangePwComponent} from './change-pw/change-pw.component';
import {ChangeAvatarComponent} from './change-avatar/change-avatar.component';
import {EducationalPlanComponent} from './educational-plan/educational-plan.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {RouterModule, Routes} from "@angular/router";
import {CheckDataService} from "./services/check-data.service";
import {CollapseModule, DropdownModule, ModalModule, TooltipModule, TooltipConfig} from "ng2-bootstrap";
import {ModalDialogComponent} from './modal-dialog/modal-dialog.component';
import {ModalMessageService} from "./services/modal-message.service";
import {TooltipService} from "./services/tooltip.service";
import {LocationStrategy, HashLocationStrategy} from "@angular/common";
import { ScrollButtonsComponent } from './scroll-buttons/scroll-buttons.component';
import {ROUTES} from "./app.routes";

export function getAlertConfig(): TooltipConfig {
    return Object.assign(new TooltipConfig(), {placement: 'right', container: 'body'});
}

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        FooterComponent,
        NavbarComponent,
        DeleteProfileComponent,
        ChapterComponent,
        ChangePwComponent,
        ChangeAvatarComponent,
        EducationalPlanComponent,
        PageNotFoundComponent,
        ModalDialogComponent,
        ScrollButtonsComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot(ROUTES, { useHash: true }),
        CollapseModule.forRoot(),
        DropdownModule.forRoot(),
        ModalModule.forRoot(),
        TooltipModule.forRoot()
    ],
    providers: [CheckDataService, ModalMessageService, TooltipService,
        {provide: TooltipConfig, useFactory: getAlertConfig},
        ], // {provide: LocationStrategy, useClass: HashLocationStrategy} alternative für { useHash: true }
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() {
    }
}
