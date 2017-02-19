import {Injectable, EventEmitter} from '@angular/core';
import {Http, Headers, Response} from "@angular/http";
import {restUrls} from "../classes/restUrls.class";
import {Chapter} from "../classes/chapter.class";
import {Avatar} from "../classes/avatar.class";
import {Student} from "../classes/student.class";
import {Competence} from "../classes/chapterCompetence.class";
import {EducationalPlan, EducationalPlanContent, EducationalCompetence} from '../classes/educationalPlan.class'
import {BehaviorSubject, Observable} from "rxjs";
import {Router} from "@angular/router";
import {OperationCode} from "../classes/operationCode.enum";

@Injectable()
export class CheckDataService {
    public chapters: Chapter[] = [];
    public avatare: Avatar[] = [];
    public student: Student = null;
    public avatar: Avatar = null;
    public competences: Competence[] = [];
    private token: string = "";

    onUpdateAvatar: EventEmitter<Avatar> = new EventEmitter<Avatar>();
    onUpdateStudent: EventEmitter<Student> = new EventEmitter<Student>();
    onUpdateChapters: EventEmitter<Chapter[]> = new EventEmitter<Chapter[]>();
    onAuthenticate: BehaviorSubject<OperationCode> = new BehaviorSubject<OperationCode>(OperationCode.NONE);

    /**
     * Datenstruktur für gesamten Förderplan
     */
    public educationalPlans: EducationalPlan[] = [];
    public educationalCompetences: EducationalCompetence[] = [];

    private localStorageTokenID = "token";
    private loginPath = "/home";
    private logoutPath = "";

    constructor(private http: Http,
                private router: Router) {
        this.setSubscriptionForAuthentication();
        this.checkForToken();
    }

    public preloadData() {
        if (this.getToken() && this.getToken() != "") {
            // Verarbeitung...
            this.getStudent().subscribe(
                stud => this.setStudent(stud),
                this.handleError,
                () => {
                    this.getAvatare().subscribe(
                        avas => this.avatare = avas as Avatar[],
                        this.handleError,
                        () => {
                            for (var avatar of this.avatare) {
                                if (this.student.avatarId == avatar._id) {
                                    this.setAvatar(avatar);
                                    break;
                                }
                            }
                        }
                    );
                }
            );
            this.getChapters().subscribe(
                chaps => this.setChapters(chaps),
                this.handleError);
            this.getCompetences().subscribe(
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
            this.getEducationalPlans().subscribe(
                plans => {
                    this.educationalPlans = plans as EducationalPlan[];
                    for (let eduPlan of this.educationalPlans) {
                        // TODO: ohne [0] wird der content als Array hinzugef�gt. liegt wohl am JSON RESPONSE
                        this.getEducationalPlanContentById(eduPlan._id).subscribe(
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
        if (plan) {
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
        return {headers: this.getStandardHeadersObj()};
    }

    /**
     * Gives header with authorization and token.
     * @returns {{headers: Headers}}
     */
    private getAuthenticateHeaders() {
        var authHeaders = this.getStandardHeadersObj();
        authHeaders.append("Authorization", this.getToken());
        return {headers: authHeaders};
    }

    /**
     * Authenticates a user and gets the token of the user.
     * @param username
     * @param password
     * @returns {Observable<R>}
     */
    public authenticate(username, password) {
        this.http.put(restUrls.getLoginUrl(),
            JSON.stringify({username, password}),
            this.getStandardHeaders())
            .map((res: Response) => res.json())
            .subscribe(
                obj => this.setToken(obj.token), // TODO: control handling
                error => this.onAuthenticate.next(OperationCode.ERROR)
            );
    }

    public logout() {
        localStorage.removeItem(this.localStorageTokenID);
        this.onAuthenticate.next(OperationCode.ERROR);
    }

    /**
     * Get all avatar which are available.
     * @returns {Observable<R>}
     */
    getAvatare() {
        return this.http.get(restUrls.getAvatarUrl(),
            this.getAuthenticateHeaders())
            .map((res: Response) => res.json());
    }

    /**
     * Get the information of the student.
     * @returns {Observable<R>}
     */
    getStudent() {
        return this.http.get(restUrls.getStudentUrl(),
            this.getAuthenticateHeaders())
            .map((res: Response) => res.json());
    }

    /**
     * Get the information of all chapters.
     * @returns {Observable<R>}
     */
    getChapters() {
        return this.http.get(restUrls.getChaptersUrl(),
            this.getAuthenticateHeaders())
            .map((res: Response) => res.json());
    }

    /**
     * Get the information of a chapter by id.
     * @param id selected chapter
     * @returns {Observable<R>}
     */
    getChapterById(id: number) {
        return this.http.get(restUrls.getChapterById(id),
            this.getAuthenticateHeaders())
            .map((res: Response) => res.json());
    }

    /**
     * Get all illustrations of a chapter by id.
     * @param id selected chapter
     * @returns {Observable<R>}
     */
    getIllustrationByChapterId(id: number) {
        return this.http.get(restUrls.getChapterIllustrationsById(id),
            this.getAuthenticateHeaders())
            .map((res: Response) => res.json());
    }

    /**
     * Gives all competences.
     * @returns {Observable<R>}
     */
    getCompetences() {
        return this.getStudentCompetences(0, false);
    }

    /**
     * Gives all competences of a chapter by id. By call with id = 0 it returns
     * the competences of all chapters.
     * @param id selected chapter
     * @returns {Observable<R>}
     */
    getCompetencesByChapterId(id: number) {
        return this.getStudentCompetences(id, false);
    }

    /**
     * Gives all competences which are achieved.
     * @returns {Observable<R>}
     */
    getAchievedCompetences() {
        return this.getStudentCompetences(0, true);
    }

    /**
     * Gives all competences of a chapter by id which are achieved.
     * @param id selected chapter
     * @returns {Observable<R>}
     */
    getAchievedCompetencesByChapterId(id: number) {
        return this.getStudentCompetences(id, true);
    }

    /**
     * Gives all competences of a chapter by id. Is id = 0 then it gives all
     * competences.
     * @param id selected chapter, id = 0 => all competences
     * @param checked false | true => all achieved competences
     * @returns {Observable<R>}
     */
    private getStudentCompetences(id: number, checked: boolean) {
        return this.http.get(restUrls.getCompetencesUrl(id, checked),
            this.getAuthenticateHeaders())
            .map((res: Response) => res.json());
    }

    /**
     * Gives all educational plans.
     * @returns {Observable<R>}
     */
    getEducationalPlans() {
        return this.http.get(restUrls.getEducationalPlanUrl(),
            this.getAuthenticateHeaders())
            .map((res: Response) => res.json());
    }

    /**
     * Gives the notes to the competences of a educational plan. Includes
     * not the competences. Only the numbers of the competences.
     * @param id of the educational plan
     * @returns {Observable<R>}
     */
    getEducationalPlanContentById(id: number) {
        return this.http.get(restUrls.getEducationalPlanUrlById(id),
            this.getAuthenticateHeaders())
            .map((res: Response) => res.json());
    }

    /**
     *
     * @param id
     * @returns {Observable<R>}
     */
    updateAvatar(id: number) {
        /*
         null weil kein body vorhanden, entscheidung welcher Avatar geht ueber URL
         */
        return this.http.put(restUrls.getUpdateAvatarUrl(id), null,
            this.getAuthenticateHeaders())
            .map((res: Response) => res.json());
    }

    updatePassword(curPw: string, newPw: string) {
        return this.http.put(restUrls.getRequestPasswordRecoveryUrl(),
            {
                password: curPw,
                newpassword: newPw
            },
            this.getAuthenticateHeaders())
            .map((res: Response) => res.json());
    }

    deleteProfile(curPw: string) {
        return this.http.put(restUrls.getDeleteProfileUrl(),
            {
                password: curPw
            }, this.getAuthenticateHeaders())
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

    private setSubscriptionForAuthentication() {
        this.onAuthenticate.subscribe(
            code => {
                switch(code) {
                    case OperationCode.SUCCESS:
                        this.preloadData();
                        this.router.navigate([this.loginPath]);
                        console.log("CODE: " + OperationCode[code] + " | VALUE: " + this.getToken());
                        break;
                    case OperationCode.ERROR:
                        this.router.navigate([this.logoutPath]);
                        console.log("CODE: " + OperationCode[code] + " | VALUE: Fehlermeldung...");
                        break;
                    default:
                        console.log("NOT AUTHENTICATED");
                }
            }
        );
    }

    private checkForToken() {
        let token = localStorage.getItem(this.localStorageTokenID);
        if (token != null) {
            this.setToken(token);
        } else {
            this.onAuthenticate.next(OperationCode.ERROR);
        }
    }

    public getToken() {
        return this.token;
    }

    private setToken(token: string) {
        localStorage.setItem(this.localStorageTokenID, token);
        this.token = token;
        this.onAuthenticate.next(OperationCode.SUCCESS);
    }

    public setAvatar(avatar: Avatar) {
        this.onUpdateAvatar.emit(avatar);
        this.avatar = avatar;
    }

    public setStudent(student: Student) {
        this.onUpdateStudent.emit(student);
        this.student = student;
    }

    public setChapters(chapters: Chapter[]) {
        this.onUpdateChapters.emit(chapters);
        this.chapters = chapters;
    }
}