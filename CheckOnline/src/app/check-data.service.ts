import {Injectable} from '@angular/core';
import {Http, Headers, Response} from "@angular/http";
import {restUrls} from "./classes/restUrls.class";
import {Chapter} from "./classes/chapter.class";
import {AuthenticationService} from "./authentication.service";
import {Avatar} from "./classes/avatar.class";
import {Student} from "./classes/student.class";
import {ChapterIllustration} from "./classes/chapterIllustration.class";
import {Competence} from "./classes/chapterCompetence.class";

@Injectable()
export class CheckDataService {
    public chapters: Chapter[] = [];
    public avatare: Avatar[] = [];
    public student: Student = null;

    constructor(private http: Http) {
    }

    public preloadData(token) {
        if (token) {
            // Verarbeitung...
            this.getStudent(token).subscribe(
                stud => this.student = stud as Student,
                this.handleError);
            this.getChapters(token).subscribe(
                chaps => this.chapters = chaps as Chapter[],
                this.handleError
            );
            this.getAvatare(token).subscribe(
                avas => this.avatare = avas as Avatar[],
                this.handleError);
        }
    }

    /**
     * Gives the normale header with json content type.
     * @returns {Headers}
     */
    private getStandardHeadersObj() {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        return headers;
    }

    /**
     * Gives header with json content type in a object.
     * @returns {{headers: Headers}}
     */
    private getStandardHeaders() {
        return {headers: this.getStandardHeadersObj()};
    }

    /**
     * Gives header with authorization and token.
     * @param token
     * @returns {{headers: Headers}}
     */
    private getAuthenticateHeaders(token) {
        var authHeaders = this.getStandardHeadersObj();
        authHeaders.append("Authorization", token);
        return {headers: authHeaders};
    }

    /**
     * Authenticates a user and gets the token of the user.
     * @param username
     * @param password
     * @returns {Observable<R>}
     */
    public authenticate(username, password) {
        return this.http.put(restUrls.getLoginUrl(),
            JSON.stringify({username, password}),
            this.getStandardHeaders())
            .map((res: Response) => res.json());
    }

    /**
     * Get all avatar which are available.
     * @param token authentication token of user
     * @returns {Observable<R>}
     */
    getAvatare(token) {
        return this.http.get(restUrls.getAvatarUrl(),
            this.getAuthenticateHeaders(token))
            .map((res: Response) => res.json());
    }

    /**
     * Get the information of the student.
     * @param token authentication token of user
     * @returns {Observable<R>}
     */
    getStudent(token) {
        var stud = this.http.get(restUrls.getStudentUrl(),
            this.getAuthenticateHeaders(token))
            .map((res: Response) => res.json());
        stud.subscribe(stud => this.student = stud as Student);
        return stud;
    }

    /**
     * Get the information of all chapters.
     * @param token authentication token of user
     * @returns {Observable<R>}
     */
    getChapters(token) {
        let chapters = this.http.get(restUrls.getChaptersUrl(),
            this.getAuthenticateHeaders(token))
            .map((res: Response) => res.json());
        chapters.subscribe(chaps => this.chapters = chaps as Chapter[]);
        return chapters;
    }

    /**
     * Get the information of a chapter by id.
     * @param token authentication token of user
     * @param id selected chapter
     * @returns {Observable<R>}
     */
    getChapterById(token, id: number) {
        return this.http.get(restUrls.getChapterById(id),
            this.getAuthenticateHeaders(token))
            .map((res: Response) => res.json());
    }

    /*
     Ab hier noch nicht getestet
     */

    /**
     * Get all illustrations of a chapter by id.
     * @param token authentication token of user
     * @param id selected chapter
     * @returns {Observable<R>}
     */
    getIllustrationByChapterId(token, id: number) {
        return this.http.get(restUrls.getChapterIllustrationsById(id),
            this.getAuthenticateHeaders(token))
            .map((res: Response) => res.json());
    }

    /**
     * Gives all competences.
     * @param token authentication token of user
     * @returns {Observable<R>}
     */
    getCompetences(token) {
        return this.getStudentCompetences(token, 0, false);
    }

    /**
     * Gives all competences of a chapter by id. By call with id = 0 it returns
     * the competences of all chapters.
     * @param token authentication token of user
     * @param id selected chapter
     * @returns {Observable<R>}
     */
    getCompetencesByChapterId(token, id: number) {
        return this.getStudentCompetences(token, id, false);
    }

    /**
     * Gives all competences which are achieved.
     * @param token authentication token of user
     * @returns {Observable<R>}
     */
    getAchievedCompetences(token) {
        return this.getStudentCompetences(token, 0, true);
    }

    /**
     * Gives all competences of a chapter by id which are achieved.
     * @param token authentication token of user
     * @param id selected chapter
     * @returns {Observable<R>}
     */
    getAchevedCompetencesByChapterId(token, id: number) {
        return this.getStudentCompetences(token, id, true);
    }

    /**
     * Gives all competences of a chapter by id. Is id = 0 then it gives all
     * competences.
     * @param token authentication token of user
     * @param id selected chapter, id = 0 => all competences
     * @param checked false | true => all achieved competences
     * @returns {Observable<R>}
     */
    private getStudentCompetences(token, id: number, checked: boolean) {
        return this.http.get(restUrls.getCompetencesUrl(id, checked),
            this.getAuthenticateHeaders(token))
            .map((res: Response) => res.json());
    }

    getEducationalPlan(token) {
        return this.http.get(restUrls.getEducationalPlanUrl(),
            this.getAuthenticateHeaders(token))
            .map((res: Response) => res.json());
    }

    getEducationalPlanById(token, id: number) {
        return this.http.get(restUrls.getEducationalPlanUrlById(id),
            this.getAuthenticateHeaders(token))
            .map((res: Response) => res.json());
    }

    private handleError(error: any) {
        console.error("FEHLER:", error);
    }
}
