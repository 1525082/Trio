import { Component } from '@angular/core';
import { Chapter } from "../classes/chapter.class";
import { Router } from "@angular/router";
import { CheckDataService } from "../check-data.service";
import { AuthenticationService } from "../authentication.service";
import { Student } from "../classes/student.class";
import { Avatar } from "../classes/avatar.class";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
    public isCollapsed: boolean = true;
    private token: string = null;

    constructor(protected authService: AuthenticationService,
                protected checkService: CheckDataService,
                private router: Router) {
        this.token = this.authService.getToken();
        this.loadData();
    }

    loadData() {
        let style = document.createElement('style');
        if (!this.checkService.student) {
            this.checkService.getStudent(this.token).subscribe(stud => {
                this.checkService.student = stud as Student;
                this.appendSchoolAndClassToNavbar(style);
            });
        } else {
            this.appendSchoolAndClassToNavbar(style);
        }

        if (!this.checkService.avatare || this.checkService.avatare.length == 0) {
            this.checkService.getAvatare(this.token).subscribe(avatare => {
                this.checkService.avatare = avatare as Avatar[];
                this.appendAvatar(style);
            });
        } else {
            this.appendAvatar(style);
        }

        if (!this.checkService.chapters || this.checkService.chapters.length == 0) {
            this.checkService.getChapters(this.token).subscribe(chapters => {
                this.checkService.chapters = chapters as Chapter[];
                this.appendColorsToChapters(style);
            });
        } else {
            this.appendColorsToChapters(style);
        }

        document.getElementsByTagName('head')[0].appendChild(style);
    }

    private appendSchoolAndClassToNavbar(style) {
        // generate style for navigation items
        style.appendChild(document.createTextNode(
            this.getClass("navSchool",
                this.checkService.student.school.imageUrlInactive,
                this.checkService.student.school.imageUrl)
            + this.getClass("navClass",
                this.checkService.student.studyGroups.imageUrlInactive,
                this.checkService.student.studyGroups.imageUrl)));
    }

    private appendAvatar(style) {
        for (let avatar of this.checkService.avatare) {
            if (avatar._id == this.checkService.student.avatarId) {
                // generate style for navigation items
                style.appendChild(document.createTextNode(
                    this.getClass("navAvatar",
                        avatar.avatarInactiveUrl,
                        avatar.avatarUrl)));
            }
        }
    }

    private appendColorsToChapters(style) {
        this.checkService.chapters.forEach(chapter => {
            // generate style for navigation items
            style.appendChild(document.createTextNode(
                this.getNavCompetenceClass(chapter._id,
                    chapter.strongcolor,
                    chapter.weakcolor)));
        });
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
            background: url('../..${activeUrl}');
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

    /*
    logout() {
        this.authService.logout();
    }
    
    onClickAllAchievedCompetences() {
        this.router.navigate(['/achieved', 0]);
    }

    onClickAchievedCompetences(chapter: Chapter) {
        this.router.navigate(['/achieved', chapter._id]);
    }

    onClickChapterCompetences(chapter: Chapter) {
        this.router.navigate(['/chapter', chapter._id]);
    }
    */
}
