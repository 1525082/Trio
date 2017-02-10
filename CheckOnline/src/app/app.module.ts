import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DeleteProfileComponent } from './delete-profile/delete-profile.component';
import { ChapterComponent } from './chapter/chapter.component';
import { ChangePwComponent } from './change-pw/change-pw.component';
import { ChangeAvatarComponent } from './change-avatar/change-avatar.component';
import { EducationalPlanComponent } from './educational-plan/educational-plan.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { Routes, RouterModule } from "@angular/router";
import { AuthenticationService } from "./authentication.service";
import { CheckDataService } from "./check-data.service";
import { CollapseModule, DropdownModule } from "ng2-bootstrap";

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'home', component: ChapterComponent },
    { path: 'chapter', component: ChapterComponent },
    { path: 'chapter/:id', component: ChapterComponent },
    { path: 'educationalPlan/:id', component: EducationalPlanComponent },
    { path: 'achieved', component: ChapterComponent }, // TODO: entsprechende Komponente erstellen
    { path: 'achieved/:chapterId', component: ChapterComponent }, // TODO: entsprechende Komponente erstellen
    { path: 'changeavatar', component: ChangeAvatarComponent },
    { path: 'changepw', component: ChangePwComponent },
    { path: 'deleteprofile', component: DeleteProfileComponent },
    { path: '**', component: PageNotFoundComponent }
];

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
        PageNotFoundComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot(routes),
        CollapseModule.forRoot(),
        DropdownModule.forRoot()
    ],
    providers: [AuthenticationService, CheckDataService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
