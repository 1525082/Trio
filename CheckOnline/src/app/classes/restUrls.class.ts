export class restUrls {
    private static endPoint = "http://46.101.204.215:1337";
    private static api = "/api/V1/";
    private static login = "login";
    private static reqPassRecovery = "requestPasswordRecovery";
    private static passRecoveryReset = "passwordRecovery/reset";
    private static avatar = "avatar";
    private static student = "student";
    private static chapter = "chapter";
    private static illustration = "chapterillustrations";
    private static competence = "studentcompetence";
    private static educationalPlan = "educationalPlan";

    private static separator = "/";

    /**
     * Returns the url of the api from "check online".
     *
     * @returns {string}
     */
    static getApiUrl() {
        return this.endPoint + this.api;
    }

    /**
     * Returns the url for the password recovery.
     *
     * @returns {string}
     */
    static getRequestPasswordRecoveryUrl() {
        return this.getApiUrl() + this.reqPassRecovery;
    }

    /**
     * Returns the url for the password reset.
     *
     * @returns {string}
     */
    static getPasswordRecoveryResetUrl() {
        return this.getApiUrl() + this.passRecoveryReset;
    }

    /**
     * Returns the url to delete the profile.
     *
     * @returns {string}
     */
    static getDeleteProfileUrl() {
        return this.getApiUrl() + this.student;
    }

    /**
     * Returns the url for the authentication.
     *
     * @returns {string}
     */
    static getLoginUrl() {
        return this.getApiUrl() + this.login;
    }

    /**
     * Returns the url to get all avatars.
     *
     * @returns {string}
     */
    static getAvatarUrl() {
        return this.getApiUrl() + this.avatar;
    }

    static getAvatarByIdUrl(id: number) {
        return this.getUpdateAvatarUrl(id);
    }

    /**
     * Returns the url to update an avatar.
     *
     * @param id
     * @returns {string}
     */
    static getUpdateAvatarUrl(id: number) {
        return this.getAvatarUrl() + this.separator + id.toLocaleString();
    }

    /**
     * Returns the url for getting student information.
     * Also you can delete the student (inactivate) with it.
     *
     * @returns {string}
     */
    static getStudentUrl() {
        return this.getApiUrl() + this.student;
    }

    /**
     * Returns the url to get all chapters.
     *
     * @returns {string}
     */
    static getChaptersUrl() {
        return this.getApiUrl() + this.chapter;
    }

    /**
     * Returns the url to get a chapter selected
     * through the given id.
     *
     * @param id
     * @returns {string}
     */
    static getChapterById(id: number) {
        return this.getApiUrl() + this.chapter
            + this.separator + id;
    }

    /**
     * Returns the url to get all illustrations of a chapter selected
     * through the given chapterId.
     *
     * @param id
     * @returns {string}
     */
    static getChapterIllustrationsById(id: number) {
        return this.getApiUrl() + this.illustration
            + this.separator + id;
    }

    /**
     * Returns the url to get the competences of a selected chapter
     * through the given id. With the checked: boolean you can select
     * if you want to see all competences or only the reached.
     *
     * @param chapterId
     * @param checked
     * @returns {string}
     */
    static getCompetencesUrl(chapterId: number, checked: boolean = false) {
        return this.getApiUrl() + this.competence
            + `?checked=${checked}&chapterId=${chapterId}`;
    }

    /**
     * Returns the url to get all education plans of the authenticated student.
     *
     * @returns {string}
     */
    static getEducationalPlanUrl() {
        return this.getApiUrl() + this.educationalPlan;
    }

    /**
     * Returns the url to get all competences from a education plan through
     * the given id.
     *
     * @param id
     * @returns {string}
     */
    static getEducationalPlanUrlById(id: number) {
        return this.getApiUrl() + this.educationalPlan
            + this.separator + id;
    }
}