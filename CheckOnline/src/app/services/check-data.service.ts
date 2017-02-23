import {Injectable} from '@angular/core';
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
import 'rxjs/Rx';
import {CheckHeaders} from "../classes/checkHeaders.class";
import {APP_CONSTS} from "../app.config";

@Injectable()
export class CheckDataService {
    public avatare: Avatar[] = [];
    public educationalPlans: EducationalPlan[] = []; // On own created structures for the educational plan and its content.
    public competences: Competence[] = [];
    private token: string = "";
    public password: string;

    subjectEducationalPlans: BehaviorSubject<EducationalPlan[]> = new BehaviorSubject([]);
    subjectFilteredEducationalPlan: BehaviorSubject<EducationalPlan> = new BehaviorSubject(null);
    subjectStudent: BehaviorSubject<Student> = new BehaviorSubject(null);
    subjectAvatar: BehaviorSubject<Avatar> = new BehaviorSubject(null);
    subjectChapters: BehaviorSubject<Chapter[]> = new BehaviorSubject([]);
    subjectAuthentication: BehaviorSubject<OperationCode> = new BehaviorSubject(OperationCode.NONE);
    arePlansLoadedAndFiltered: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(private http: Http,
                private router: Router) {
        this.checkForToken();
    }

    /**
     * Request all data from the REST-API what is needed for the application.
     *
     */
    public preloadData() {
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
            this.requestCompetences().subscribe(
                comps => this.setCompetences(comps),
                this.handleError);
            this.loadEducationalPlanAndFilter();
        }
    }

    private loadEducationalPlanAndFilter() {
        this.requestEducationalPlans().subscribe(
            plans => {
                this.setEducationalPlans(plans);
                this.getEducationalPlans().forEach(
                    (eduPlan: EducationalPlan) => {
                        this.requestEducationalPlanContentById(eduPlan._id).subscribe(
                            // ohne [0] wird der content als Array hinzugefügt. liegt wohl am JSON RESPONSE
                            content => EducationalPlan.setContent(eduPlan, content[0]),
                            this.handleError,
                            () => {
                                this.filter(EducationalPlan.getContent(eduPlan as EducationalPlan) as EducationalPlanContent);
                                this.setFilteredEducationalPlan(eduPlan);
                                this.arePlansLoadedAndFiltered.next(true);
                            }
                        );
                    }
                );
            },
            this.handleError);
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

    /**
     * Subscribes on a Observable and sets the token and emits a operation code.
     *
     * @param username
     * @param password
     */
    public login(username, password) {
        this.requestLogin(username, password).subscribe(
            obj => {
                this.setPassword(password);
                this.setToken(obj.token);
                this.subjectAuthentication.next(OperationCode.SUCCESS);
                this.preloadData();
                this.router.navigate([APP_CONSTS.LOGGED_IN_PATH]);
            },
            error => this.subjectAuthentication.next(OperationCode.ERROR)
        );
    }

    /**
     * Removes the token from the localStorage and navigates to the login page.
     *
     */
    public logout() {
        localStorage.removeItem(APP_CONSTS.LOCALSTORAGE_TOKEN_ID);
        this.router.navigate([APP_CONSTS.LOGGED_OUT_PATH]);
    }

    /**
     * Authenticates a user and gets the token of the user.
     *
     * @param username
     * @param password
     * @returns {Observable<R>}
     */
    private requestLogin(username, password) {
        return this.http.put(restUrls.getLoginUrl(),
            JSON.stringify({username, password}),
            CheckHeaders.getHeaders())
            .share()
            .map((res: Response) => res.json());
    }

    /**
     * Get all avatar which are available.
     *
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
     *
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
     *
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
     *
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
     *
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
     *
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
     *
     * @returns {Observable<R>}
     */
    requestCompetences() {
        return this.requestStudentCompetences(0, false);
    }

    /**
     * Gives all competences of a chapter by id. By call with id = 0 it returns
     * the competences of all chapters.
     *
     * @param id selected chapter
     * @returns {Observable<R>}
     */
    requestCompetencesByChapterId(id: number) {
        return this.requestStudentCompetences(id, false);
    }

    /**
     * Gives all competences which are achieved.
     *
     * @returns {Observable<R>}
     */
    requestAchievedCompetences() {
        return this.requestStudentCompetences(0, true);
    }

    /**
     * Gives all competences of a chapter by id which are achieved.
     *
     * @param id selected chapter
     * @returns {Observable<R>}
     */
    requestAchievedCompetencesByChapterId(id: number) {
        return this.requestStudentCompetences(id, true);
    }

    /**
     * Gives all competences of a chapter by id. Is id = 0 then it gives all
     * competences.
     *
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
     *
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
     *
     * @param id of the educational plan
     * @returns {Observable<R>}
     */
    requestEducationalPlanContentById(id: number) {
        return this.http.get(restUrls.getEducationalPlanUrlById(id),
            CheckHeaders.getHeadersWith(this.getToken()))
            .share()
            .map((res: Response) => res.json());
    }

    /**
     * Sends the id of the new avatar to the REST-API. The response gives a feedback whether
     * the avatar has been changed.
     *
     * @param id of the new avatar
     * @returns {Observable<R>}
     */
    updateAvatar(id: number) {
        return this.http.put(restUrls.getUpdateAvatarUrl(id), null, // currently server doesn't handle a body => null
            CheckHeaders.getHeadersWith(this.getToken()))
            .share()
            .map((res: Response) => res.json());
    }

    /**
     * Send the new password to the REST-API. The response gives a feedback whether the
     * password has been changed.
     *
     * @param curPw the current password
     * @param newPw the new password
     * @returns {Observable<R>}
     */
    updatePassword(curPw: string, newPw: string) {
        return this.http.put(restUrls.getRequestPasswordRecoveryUrl(),
            { password: curPw, newpassword: newPw },
            CheckHeaders.getHeadersWith(this.getToken()))
            .share()
            .map((res: Response) => res.json());
    }

    /**
     * Sends the server the information to "delete" (only deactivation) the user profile.
     * The response gives a feedback whether the profile has been deleted.
     *
     * @returns {Observable<R>}
     */
    deleteProfile() {
        return this.http.delete(restUrls.getDeleteProfileUrl(),
            CheckHeaders.getHeadersWith(this.getToken()))
            .share()
            .map((res: Response) => res.json());
    }

    /**
     * Prints the error parsed in json and as error message in the
     * console.
     *
     * @param error the error object, maybe the response error of the server
     */
    private handleError(error: any) {
        console.error(error);
    }

    /**
     * Checks whether the token is available in the localstorage and if it is available it sets the token.
     *
     */
    private checkForToken() {
        let token = localStorage.getItem(APP_CONSTS.LOCALSTORAGE_TOKEN_ID);
        if (token != null) {
            this.setToken(token);
            this.subjectAuthentication.next(OperationCode.SUCCESS);
            this.preloadData();
        }
    }

    /*
     *              GETTER && SETTER
     *-----------------------------------------------
     */

    public getToken() {
        return this.token;
    }

    public setToken(token: string) {
        localStorage.setItem(APP_CONSTS.LOCALSTORAGE_TOKEN_ID, token);
        this.token = token;
    }

    public setStudent(student: Student) {
        this.subjectStudent.next(student);
    }

    public getStudent() {
        return this.subjectStudent.getValue();
    }

    public setChapters(chapters: Chapter[]) {
        this.subjectChapters.next(chapters);
    }

    public getChapters() {
        return this.subjectChapters.getValue();
    }

    /**
     * Searchs the chapter of the given id in the stored data.
     * @returns {Headers}
     */
    public getChapter(id: number) {
        return this.getChapters().find(chapter => chapter._id == id);
    }

    public setAvatar(avatar: Avatar) {
        this.subjectAvatar.next(avatar);
    }

    public getAvatar() {
        return this.subjectAvatar.getValue();
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
        this.subjectEducationalPlans.next(plans);
        //this.educationalPlans = plans;
    }

    public getEducationalPlans(): EducationalPlan[] {
        return this.subjectEducationalPlans.getValue();
        //return this.educationalPlans;
    }

    public setFilteredEducationalPlan(plan: EducationalPlan) {
        this.subjectFilteredEducationalPlan.next(plan);
    }

    public getetFilteredEducationalPlan(): EducationalPlan {
        return this.subjectFilteredEducationalPlan.getValue();
    }

    public setPassword(password: string) {
        this.password = password;
    }

    public getPassword(): string {
        return this.password;
    }

    /*
     TODO: add more getter and setter
     */
}