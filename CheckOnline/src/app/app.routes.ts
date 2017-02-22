import {Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {ChapterComponent} from "./chapter/chapter.component";
import {EducationalPlanComponent} from "./educational-plan/educational-plan.component";
import {ChangeAvatarComponent} from "./change-avatar/change-avatar.component";
import {ChangePwComponent} from "./change-pw/change-pw.component";
import {DeleteProfileComponent} from "./delete-profile/delete-profile.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";

export const ROUTES: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'home', redirectTo: 'achieved/0', pathMatch: 'full'},
    {path: 'chapter/:id', component: ChapterComponent},
    {path: 'educationalPlan/:id', component: EducationalPlanComponent},
    {path: 'achieved/:chapterId', component: ChapterComponent},
    {path: 'changeavatar', component: ChangeAvatarComponent},
    {path: 'changepw', component: ChangePwComponent},
    {path: 'deleteprofile', component: DeleteProfileComponent},
    {path: '**', component: PageNotFoundComponent}
];