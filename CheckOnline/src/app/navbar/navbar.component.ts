import {Component, OnInit} from '@angular/core';
import {Chapter} from "../classes/chapter.class";
import {Router} from "@angular/router";
import {CheckDataService} from "../check-data.service";
import {AuthenticationService} from "../authentication.service";
import {Student} from "../classes/student.class";
import {Avatar} from "../classes/avatar.class";
import {isEmpty} from "rxjs/operator/isEmpty";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
    public isCollapsed: boolean = true;
    private token: string = null;

    constructor(private authService: AuthenticationService,
                public checkService: CheckDataService,
                private router: Router) {
        this.token = this.authService.getToken();
        this.loadData();
    }

    loadData() {
        let style = document.createElement('style');
        if (!this.checkService.student) {
            console.log("If -> Student");
            this.checkService.getStudent(this.token).subscribe(stud => {
                this.checkService.student = stud as Student;
                this.appendSchoolAndClassToNavbar(style);
            });
        } else {
            console.log("ELSE -> Student");
            this.appendSchoolAndClassToNavbar(style);
        }

        if (!this.checkService.avatare || this.checkService.avatare.length == 0) {
            console.log("IF -> Avatar");
            this.checkService.getAvatare(this.token).subscribe(avatare => {
                this.checkService.avatare = avatare as Avatar[];
                this.appendAvatar(style);
            });
        } else {
            console.log("ELSE -> Avatar");
            this.appendAvatar(style);
        }

        if (!this.checkService.chapters || this.checkService.chapters.length == 0) {
            console.log("IF -> Chapter");
            this.checkService.getChapters(this.token).subscribe(chapters => {
                this.checkService.chapters = chapters as Chapter[];
                this.appendColorsToChapters(style);
            });
        } else {
            console.log("ELSE -> Chapter");
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
            if (avatar._id = this.checkService.student.avatarId) {
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
        return `li#chapter${chapterId} > a {
            background-color: ${color};
            color: #FFF;
        }
        li#chapter${chapterId} > a:hover {
            background-color: ${colorHover};
            color: #FFF;
        }`;
    }

    logout() {
        this.authService.logout();
    }

    onSelect(chapter: Chapter) {
        this.router.navigate(['/chapters', chapter._id]);
    }

    onLoad(chapter: Chapter) {
        console.log(chapter);
        let style = document.createElement('style');
        // generate style for navigation items
        style.appendChild(document.createTextNode(
            this.getNavCompetenceClass(chapter._id,
                chapter.strongcolor,
                chapter.weakcolor)));
        document.getElementsByTagName('head')[0].appendChild(style);
    }
}
