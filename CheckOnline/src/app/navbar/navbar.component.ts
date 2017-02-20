import {Component} from '@angular/core';
import { CheckDataService } from "../services/check-data.service";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
    public isCollapsed: boolean = true;

    constructor(private checkService: CheckDataService) {
        this.createEventListeners();
    }

    private createEventListeners() {
        this.onAvatarChangedListener();
        this.onStudentChangedListener();
        this.onChaptersChangedListener();
    }

    private onAvatarChangedListener() {
        this.checkService.onUpdateAvatar.subscribe(
            (avatar) => {
                let style = document.getElementById("navbarAvatar");
                style.innerHTML = this.getClass("navAvatar",
                    avatar.avatarInactiveUrl,
                    avatar.avatarUrl);
            }
        );
    }

    private onStudentChangedListener() {
        this.checkService.onUpdateStudent.subscribe(
            (student) => {
                let style = document.getElementById("navbarSchoolClass");
                style.innerHTML =
                    this.getClass("navSchool",
                        student.school.imageUrlInactive,
                        student.school.imageUrl)
                    + this.getClass("navClass",
                        student.studyGroups.imageUrlInactive,
                        student.studyGroups.imageUrl);
            }
        );
    }

    private onChaptersChangedListener() {
        this.checkService.onUpdateChapters.subscribe(
            (chapters) => {
                let style = document.getElementById("navbarChapters");
                style.innerHTML = "";
                chapters.forEach(chapter => {
                    // generate style for navigation items
                    style.innerHTML += this.getNavCompetenceClass(chapter._id,
                        chapter.strongcolor,
                        chapter.weakcolor);
                });
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
        #${elmId}:hover, #${elmId}:focus, .open > #${elmId} {
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
}
