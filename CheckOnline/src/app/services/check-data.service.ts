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
import 'rxjs/Rx'; // TODO: remove if IE9 has still problems with promise and add property

@Injectable()
export class CheckDataService {
    /*
    TODO: SHIT LÖSUNG!!
     */
    public password: string;

    public chapters: Chapter[] = [];
    public avatare: Avatar[] = [];
    public student: Student = null;
    public avatar: Avatar = null;
    public competences: Competence[] = [];
    private token: string = "";

    onUpdateAvatar: EventEmitter<Avatar>;
    onUpdateStudent: EventEmitter<Student>;
    onUpdateChapters: EventEmitter<Chapter[]>;
    onAuthenticate: BehaviorSubject<OperationCode>;

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
        this.onUpdateAvatar = new EventEmitter();
        this.onUpdateStudent = new EventEmitter();
        this.onUpdateChapters = new EventEmitter();
        this.onAuthenticate = new BehaviorSubject<OperationCode>(OperationCode.NONE);
        this.setSubscriptionForAuthentication();
        this.checkForToken();
    }

    public preloadData() {
        console.log("CALL PRELOADING DATA");
        if (this.getToken() && this.getToken() != "") {
            this.requestStudent().subscribe(
                stud => this.setStudent(stud),
                this.handleError,
                () => {
                    this.requestAvatarById(this.getStudent().avatarId).subscribe(
                        ava => this.setAvatar(ava)
                    );
                });
            this.requestAvatare().subscribe(
                avas => this.setAvatare(avas),
                this.handleError);
            this.requestChapters().subscribe(
                chaps => this.setChapters(chaps),
                this.handleError);
            /*
             * this should happen before the first chapter will be
             * viewed. So the user don't have to wait again.
             *
             */
            this.requestCompetences().subscribe( // TODO: sort competences on chapters
                comps => this.setCompetences(comps),
                this.handleError);
            this.requestEducationalPlans().subscribe(
                plans => {
                    this.setEducationalPlans(plans);
                    this.getEducationalPlans().forEach(
                        (eduPlan: EducationalPlan) => {
                            this.requestEducationalPlanContentById(eduPlan._id).subscribe(
                                // TODO: ohne [0] wird der content als Array hinzugefügt. liegt wohl am JSON RESPONSE
                                content => EducationalPlan.setContent(eduPlan, content[0]),
                                this.handleError,
                                () => this.filter(EducationalPlan.getContent(eduPlan as EducationalPlan) as EducationalPlanContent)
                            );
                        }
                    );
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
     * @param educationalContent plan content to find compentences to notes
     */
    private filter(educationalContent: EducationalPlanContent) {
        if (!educationalContent || !this.competences) {
            console.error("NOT EDUCATIONAL CONTENT OR COMPETENCES AVAILABLE!");
            return;
        }

        let counter = 0;
        let arr = new Array<EducationalCompetence>(educationalContent.competences.length);
        educationalContent.competences.forEach(
            compNote => {
                let comp = this.competences.find(comp => comp.id == compNote.competenceId);
                if (comp) {
                    arr[counter++] = EducationalCompetence.create(comp, compNote);
                }
            });
        EducationalPlanContent.setCompetencesForDisplay(educationalContent, arr, counter);
    }

    private requestLogin(username, password) {
        return this.http.put(restUrls.getLoginUrl(),
            JSON.stringify({username, password}),
            CheckHeaders.getHeaders())
            .share()
            .map((res: Response) => res.json());
    }

    /**
     * Authenticates a user and gets the token of the user.
     *
     * @param username
     * @param password
     */
    public login(username, password) {
        this.requestLogin(username, password).subscribe(
            obj => {
                this.setPassword(password);
                this.setToken(obj.token);
                this.onAuthenticate.next(OperationCode.SUCCESS);
                this.router.navigate([this.loginPath]);
            },
            error => this.onAuthenticate.next(OperationCode.ERROR)
        );
    }

    public logout() {
        localStorage.removeItem(this.localStorageTokenID);
        this.router.navigate([this.logoutPath]);
    }

    /**
     * Get all avatar which are available.
     * @returns {Observable<R>}
     */
    requestAvatare() {
        return this.http.get(restUrls.getAvatarUrl(),
            CheckHeaders.getHeadersWith(this.getToken()))
            .share()
            .map((res: Response) => res.json());
    }

    /**
     * Gets an avatar by id.
     * @param id
     * @returns {Observable<R>}
     */
    requestAvatarById(id: number) {
        return this.http.get(restUrls.getAvatarByIdUrl(id),
            CheckHeaders.getHeadersWith(this.getToken()))
            .share()
            .map((res: Response) => res.json());
    }

    /**
     * Get the information of the student.
     * @returns {Observable<R>}
     */
    requestStudent() {
        return this.http.get(restUrls.getStudentUrl(),
            CheckHeaders.getHeadersWith(this.getToken()))
            .share()
            .map((res: Response) => res.json());
    }

    /**
     * Get the information of all chapters.
     * @returns {Observable<R>}
     */
    requestChapters() {
        return this.http.get(restUrls.getChaptersUrl(),
            CheckHeaders.getHeadersWith(this.getToken()))
            .share()
            .map((res: Response) => res.json());
    }

    /**
     * Get the information of a chapter by id.
     * @param id selected chapter
     * @returns {Observable<R>}
     */
    requestChapterById(id: number) {
        return this.http.get(restUrls.getChapterById(id),
            CheckHeaders.getHeadersWith(this.getToken()))
            .share()
            .map((res: Response) => res.json());
    }

    /**
     * Get all illustrations of a chapter by id.
     * @param id selected chapter
     * @returns {Observable<R>}
     */
    requestIllustrationByChapterId(id: number) {
        return this.http.get(restUrls.getChapterIllustrationsById(id),
            CheckHeaders.getHeadersWith(this.getToken()))
            .share()
            .map((res: Response) => res.json());
    }

    /**
     * Gives all competences.
     * @returns {Observable<R>}
     */
    requestCompetences() {
        return this.requestStudentCompetences(0, false);
    }

    /**
     * Gives all competences of a chapter by id. By call with id = 0 it returns
     * the competences of all chapters.
     * @param id selected chapter
     * @returns {Observable<R>}
     */
    requestCompetencesByChapterId(id: number) {
        return this.requestStudentCompetences(id, false);
    }

    /**
     * Gives all competences which are achieved.
     * @returns {Observable<R>}
     */
    requestAchievedCompetences() {
        return this.requestStudentCompetences(0, true);
    }

    /**
     * Gives all competences of a chapter by id which are achieved.
     * @param id selected chapter
     * @returns {Observable<R>}
     */
    requestAchievedCompetencesByChapterId(id: number) {
        return this.requestStudentCompetences(id, true);
    }

    /**
     * Gives all competences of a chapter by id. Is id = 0 then it gives all
     * competences.
     * @param id selected chapter, id = 0 => all competences
     * @param checked false | true => all achieved competences
     * @returns {Observable<R>}
     */
    private requestStudentCompetences(id: number, checked: boolean) {
        return this.http.get(restUrls.getCompetencesUrl(id, checked),
            CheckHeaders.getHeadersWith(this.getToken()))
            .share()
            .map((res: Response) => res.json());
    }

    /**
     * Gives all educational plans.
     * @returns {Observable<R>}
     */
    requestEducationalPlans() {
        return this.http.get(restUrls.getEducationalPlanUrl(),
            CheckHeaders.getHeadersWith(this.getToken()))
            .share()
            .map((res: Response) => res.json());
    }

    /**
     * Gives the notes to the competences of a educational plan. Includes
     * not the competences. Only the numbers of the competences.
     * @param id of the educational plan
     * @returns {Observable<R>}
     */
    requestEducationalPlanContentById(id: number) {
        return this.http.get(restUrls.getEducationalPlanUrlById(id),
            CheckHeaders.getHeadersWith(this.getToken()))
            .share()
            .map((res: Response) => res.json());
    }

    /*
     TODO: check following methods
     */

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
            CheckHeaders.getHeadersWith(this.getToken()))
            .share()
            .map((res: Response) => res.json());
    }

    updatePassword(curPw: string, newPw: string) {
        return this.http.put(restUrls.getRequestPasswordRecoveryUrl(),
            { password: curPw, newpassword: newPw },
            CheckHeaders.getHeadersWith(this.getToken()))
            .share()
            .map((res: Response) => res.json());
    }

    deleteProfile() {
        return this.http.delete(restUrls.getDeleteProfileUrl(),
            CheckHeaders.getHeadersWith(this.getToken()))
            .share()
            .map((res: Response) => res.json());
    }

    /**
     * Prints the error parsed in json and as error message in the
     * console.
     * @param error the error object, maybe the response error of the server
     */
    private handleError(error: any) {
        console.error("FEHLER:", error);
    }

    private setSubscriptionForAuthentication() {
        // TODO: remove subscription and do preloading in login and checkForToken methods.
        this.onAuthenticate.subscribe(
            code => {
                switch (code) {
                    case OperationCode.SUCCESS:
                        this.preloadData();
                        console.log("CODE: " + OperationCode[code] + " | VALUE: " + this.getToken());
                        break;
                    case OperationCode.ERROR:
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
            this.onAuthenticate.next(OperationCode.SUCCESS);
        }
    }

    /*
     TODO: add more getter and setter
     */

    public getToken() {
        return this.token;
    }

    public setToken(token: string) {
        localStorage.setItem(this.localStorageTokenID, token);
        console.log(token);
        this.token = token;
    }

    public setStudent(student: Student) {
        this.onUpdateStudent.emit(student);
        this.student = student;
    }

    public getStudent() {
        return this.student;
    }

    public setChapters(chapters: Chapter[]) {
        this.onUpdateChapters.emit(chapters);
        this.chapters = chapters;
    }

    public getChapters() {
        return this.chapters;
    }

    /**
     * Searchs the chapter of the given id in the stored data.
     * @returns {Headers}
     */
    public getChapter(id: number) {
        return this.chapters.find(chapter => chapter._id == id);
    }

    public setAvatar(avatar: Avatar) {
        this.onUpdateAvatar.emit(avatar);
        this.avatar = avatar;
    }

    public setAvatare(avatare: Avatar[]) {
        this.avatare = avatare;
    }

    public getAvatare() {
        return this.avatare;
    }

    public setCompetences(competences: Competence[]) {
        this.competences = competences;
    }

    public setEducationalPlans(plans: EducationalPlan[]) {
        this.educationalPlans = plans;
    }

    public getEducationalPlans() {
        return this.educationalPlans;
    }

    public setPassword(password: string) {
        this.password = password;
    }

    public getPassword(): string {
        return this.password;
    }
}

class CheckHeaders {
    /**
     * Gives the normale header with json content type.
     * @returns {Headers}
     */
    private static getStandardHeadersObj(): Headers {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        return headers;
    }

    /**
     * Gives header with json content type in a object.
     * @returns {{headers: Headers}}
     */
    static getHeaders(): any {
        return {headers: this.getStandardHeadersObj()};
    }

    /**
     * Gives header with authorization and token.
     * @returns {{headers: Headers}}
     */
    static getHeadersWith(token: string): any {
        var authHeaders = this.getStandardHeadersObj();
        authHeaders.append("Authorization", token);
        return {headers: authHeaders};
    }
}