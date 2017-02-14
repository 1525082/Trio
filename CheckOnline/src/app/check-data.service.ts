import { Injectable } from '@angular/core';
import { Http, Headers, Response } from "@angular/http";
import { restUrls } from "./classes/restUrls.class";
import { Chapter } from "./classes/chapter.class";
import { AuthenticationService } from "./authentication.service";
import { Avatar } from "./classes/avatar.class";
import { Student } from "./classes/student.class";
import { ChapterIllustration } from "./classes/chapterIllustration.class";
import { Competence } from "./classes/chapterCompetence.class";
import { ChapterData } from './classes/chapterData.class'
import { EducationalPlan, EducationalPlanContent, EducationalCompetence } from './classes/educationalPlan.class'
import { forEachComment } from 'tslint'

@Injectable()
export class CheckDataService {
    public chapters: Chapter[] = [];
    public avatare: Avatar[] = [];
    public student: Student = null;
    public competences: Competence[] = [];
    public educationalPlans: EducationalPlan[] = [];
    public educationalCompetences: EducationalCompetence[] = [];

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
                this.handleError);
            this.getAvatare(token).subscribe(
                avas => this.avatare = avas as Avatar[],
                this.handleError);
            this.getCompetences(token).subscribe(
                comps => {
                    this.competences = comps as Competence[];
                    // TODO: sort competences on chapters
                    /*
                     * this should happen before the first chapter will be
                     * viewed. So the user don't have to wait again.
                     * 
                     */
                },
                this.handleError);
            this.getEducationalPlans(token).subscribe(
                plans => {
                    this.educationalPlans = plans as EducationalPlan[];
                    for (let eduPlan of this.educationalPlans) {
                        // TODO: ohne [0] wird der content als Array hinzugefügt. liegt wohl am JSON RESPONSE
                        this.getEducationalPlanContentById(token, eduPlan._id).subscribe(
                            content => eduPlan.educationalContent = content[0] as EducationalPlanContent,
                            this.handleError,
                            () => {
                                this.filter(eduPlan.educationalContent);
                            }
                        );
                    }
                },
                this.handleError);
        }
    }
    
    public selectPlan(id: number) {
        let plan: EducationalPlan = this.educationalPlans.find(plan => plan._id == id);
        if(plan) {
            this.educationalCompetences = plan.educationalContent.competencesForDisplay;
        } else {
            console.error("KEIN ENTSPRECHENDER PLAN VERFUEGBAR");
        }
    }
    
    /**
     * Iterates through the notes of an educational plan and finds the competences to
     * the notes.
     * @param educationalContent plan content to finde compentences to notes
     */
    private filter(educationalContent: EducationalPlanContent) {
        if (!educationalContent || !this.competences) {
            console.log(educationalContent);
            console.log(this.competences);
        }

        let counter = 0;
        let arr = new Array<EducationalCompetence>(educationalContent.competences.length);

        for (let compNote of educationalContent.competences) {
            let comp = this.competences.find(comp => comp.id == compNote.competenceId);
            if (comp) {
                arr[counter] = EducationalCompetence.create(comp, compNote);
                counter++;
            }
        }

        // it could be that a note has no competence
        if (counter < arr.length) {
            educationalContent.competencesForDisplay = new Array<EducationalCompetence>(counter);
            for (let i = 0; i < counter; i++) {
                educationalContent.competencesForDisplay[i] = EducationalCompetence.clone(arr[i]);
            }
        } else {
            educationalContent.competencesForDisplay = arr;
        }
    }

    /**
     * Searchs the chapter of the given id in the stored data.
     * @returns {Headers}
     */
    public getChapter(id: number) {
        let chapter: Chapter = null;
        for (chapter of this.chapters) {
            if (chapter._id == id) {
                break;
            }
        }
        return chapter;
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
        return { headers: this.getStandardHeadersObj() };
    }

    /**
     * Gives header with authorization and token.
     * @param token
     * @returns {{headers: Headers}}
     */
    private getAuthenticateHeaders(token) {
        var authHeaders = this.getStandardHeadersObj();
        authHeaders.append("Authorization", token);
        return { headers: authHeaders };
    }

    /**
     * Authenticates a user and gets the token of the user.
     * @param username
     * @param password
     * @returns {Observable<R>}
     */
    public authenticate(username, password) {
        return this.http.put(restUrls.getLoginUrl(),
            JSON.stringify({ username, password }),
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
    getAchievedCompetencesByChapterId(token, id: number) {
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

    /**
     * Gives all educational plans.
     * @param token authentication token of user
     * @returns {Observable<R>}
     */
    getEducationalPlans(token) {
        return this.http.get(restUrls.getEducationalPlanUrl(),
            this.getAuthenticateHeaders(token))
            .map((res: Response) => res.json());
    }

    /**
     * Gives the notes to the competences of a educational plan. Includes 
     * not the competences. Only the numbers of the competences.
     * @param token authentication token of user
     * @param id of the educational plan
     * @returns {Observable<R>}
     */
    getEducationalPlanContentById(token, id: number) {
        return this.http.get(restUrls.getEducationalPlanUrlById(id),
            this.getAuthenticateHeaders(token))
            .map((res: Response) => res.json());
    }

    /**
     * Prints the error parsed in json and as error message in the
     * console.
     * @param error the error object, maybe the response error of the server
     */
    private handleError(error: any) {
        console.log(JSON.stringify(error));
        console.error("FEHLER:", error);
    }
}
