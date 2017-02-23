import {Component} from '@angular/core';
import {CheckDataService} from "../services/check-data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {APP_CONSTS} from "../app.config";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
    public isCollapsed: boolean = true;

    nav_url_fragments = {
        // navigation url fragments
        ROUTE_CHAPTER_LIST_CLASS: '',
        ROUTE_PLAN_CLASS: '',
        ROUTE_ACHIEVED_LIST_CLASS: '',
        ROUTE_AVATAR_CLASS: ''
    };

    constructor(private checkService: CheckDataService,
                private router: Router) {
        this.createEventListeners();
    }

    private createEventListeners() {
        this.onAvatarChangedListener();
        this.onStudentChangedListener();
        this.onChaptersChangedListener();
        this.router.events.subscribe((e) => {
            if(e.url.startsWith(APP_CONSTS.CHAPTER_PATH)) {
                this.nav_url_fragments.ROUTE_CHAPTER_LIST_CLASS = 'isActive';
            } else if (e.url.startsWith(APP_CONSTS.ACHIEVED_CHAPTER_PATH)) {
                this.nav_url_fragments.ROUTE_ACHIEVED_LIST_CLASS = 'isActive';
            } else if(e.url.startsWith(APP_CONSTS.EDUCATIONAL_PLAN_PATH)) {
                this.nav_url_fragments.ROUTE_PLAN_CLASS = 'isActive';
            } else if(e.url == APP_CONSTS.CHANGE_AVATAR_PATH || e.url == APP_CONSTS.CHANGE_PASSWORD_PATH
                || e.url == APP_CONSTS.DELETE_PROFILE_PATH) {
                this.nav_url_fragments.ROUTE_AVATAR_CLASS = 'isActive';
            }
        });
    }

    private onAvatarChangedListener() {
        this.checkService.subjectAvatar.subscribe(
            (avatar) => {
                if (avatar) {
                    let style = document.getElementById("navbarAvatar");
                    style.innerHTML = this.getClass("navAvatar",
                        avatar.avatarInactiveUrl,
                        avatar.avatarUrl);
                }
            });
    }

    private onStudentChangedListener() {
        this.checkService.subjectStudent.subscribe(
            (student) => {
                if (student) {
                    let style = document.getElementById("navbarSchoolClass");
                    style.innerHTML =
                        this.getClass("navSchool",
                            student.school.imageUrlInactive,
                            student.school.imageUrl)
                        + this.getClass("navClass",
                            student.studyGroups.imageUrlInactive,
                            student.studyGroups.imageUrl);
                }
            }
        );
    }

    private onChaptersChangedListener() {
        this.checkService.subjectChapters.subscribe(
            (chapters) => {
                if (chapters) {
                    let style = document.getElementById("navbarChapters");
                    style.innerHTML = "";
                    chapters.forEach(chapter => {
                        // generate style for navigation items
                        style.innerHTML += this.getNavCompetenceClass(chapter._id,
                            chapter.strongcolor,
                            chapter.weakcolor);
                    });
                }
            }
        );
    }

    /**
     * Used as template for the css style of the navigation elements navAvatar, navSchool and navClass.
     * @param elmId
     * @param inactiveUrl
     * @param activeUrl
     * @returns {string}
     */
    getClass(elmId: string, inactiveUrl: string, activeUrl: string) {
        return `#${elmId} {
            background: url('../..${inactiveUrl}') transparent no-repeat; 
            background-size: 40px 40px;
        }
        #${elmId}:hover, #${elmId}:focus, .open > #${elmId}, li.isActive > #${elmId} {
            background: url('../..${activeUrl}') transparent no-repeat;
            background-size: 40px 40px;
        }`;
    }

    /**
     * Used as template for the css classes of the different navigation items whose color is specified from the message.
     * @param chapterId
     * @param color
     * @param colorHover
     * @returns {string}
     */
    getNavCompetenceClass(chapterId: number, color: string, colorHover: string) {
        return `li.chapter${chapterId} > a {
            background-color: ${color} !important;
            color: #FFF !important;
        }
        li.chapter${chapterId} > a:hover {
            background-color: ${colorHover} !important;
            color: #FFF !important;
        }`;
    }

    public getStreet() {
        return this.checkService.getStudent().school.address.split(", ")[0];
    }

    public getTown() {
        return this.checkService.getStudent().school.address.split(", ")[1];
    }
}
