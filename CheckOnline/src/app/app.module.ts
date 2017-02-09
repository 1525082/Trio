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
    EducationalPlanComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
