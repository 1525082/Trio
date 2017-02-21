"use strict";
var restUrls = (function () {
    function restUrls() {
    }
    /**
     * Returns the url of the api from "check online".
     *
     * @returns {string}
     */
    restUrls.getApiUrl = function () {
        return this.endPoint + this.api;
    };
    /**
     * Returns the url for the password recovery.
     *
     * @returns {string}
     */
    restUrls.getRequestPasswordRecoveryUrl = function () {
        return this.getApiUrl() + this.reqPassRecovery;
    };
    /**
     * Returns the url for the password reset.
     *
     * @returns {string}
     */
    restUrls.getPasswordRecoveryResetUrl = function () {
        return this.getApiUrl() + this.passRecoveryReset;
    };
    /**
     * Returns the url to delete the profile.
     *
     * @returns {string}
     */
    restUrls.getDeleteProfileUrl = function () {
        return this.getApiUrl() + this.student;
    };
    /**
     * Returns the url for the authentication.
     *
     * @returns {string}
     */
    restUrls.getLoginUrl = function () {
        return this.getApiUrl() + this.login;
    };
    /**
     * Returns the url to get all avatars.
     *
     * @returns {string}
     */
    restUrls.getAvatarUrl = function () {
        return this.getApiUrl() + this.avatar;
    };
    restUrls.getAvatarByIdUrl = function (id) {
        return this.getUpdateAvatarUrl(id);
    };
    /**
     * Returns the url to update an avatar.
     *
     * @param id
     * @returns {string}
     */
    restUrls.getUpdateAvatarUrl = function (id) {
        return this.getAvatarUrl() + this.separator + id.toLocaleString();
    };
    /**
     * Returns the url for getting student information.
     * Also you can delete the student (inactivate) with it.
     *
     * @returns {string}
     */
    restUrls.getStudentUrl = function () {
        return this.getApiUrl() + this.student;
    };
    /**
     * Returns the url to get all chapters.
     *
     * @returns {string}
     */
    restUrls.getChaptersUrl = function () {
        return this.getApiUrl() + this.chapter;
    };
    /**
     * Returns the url to get a chapter selected
     * through the given id.
     *
     * @param id
     * @returns {string}
     */
    restUrls.getChapterById = function (id) {
        return this.getApiUrl() + this.chapter
            + this.separator + id;
    };
    /**
     * Returns the url to get all illustrations of a chapter selected
     * through the given chapterId.
     *
     * @param id
     * @returns {string}
     */
    restUrls.getChapterIllustrationsById = function (id) {
        return this.getApiUrl() + this.illustration
            + this.separator + id;
    };
    /**
     * Returns the url to get the competences of a selected chapter
     * through the given id. With the checked: boolean you can select
     * if you want to see all competences or only the reached.
     *
     * @param chapterId
     * @param checked
     * @returns {string}
     */
    restUrls.getCompetencesUrl = function (chapterId, checked) {
        if (checked === void 0) { checked = false; }
        return this.getApiUrl() + this.competence
            + ("?checked=" + checked + "&chapterId=" + chapterId);
    };
    /**
     * Returns the url to get all education plans of the authenticated student.
     *
     * @returns {string}
     */
    restUrls.getEducationalPlanUrl = function () {
        return this.getApiUrl() + this.educationalPlan;
    };
    /**
     * Returns the url to get all competences from a education plan through
     * the given id.
     *
     * @param id
     * @returns {string}
     */
    restUrls.getEducationalPlanUrlById = function (id) {
        return this.getApiUrl() + this.educationalPlan
            + this.separator + id;
    };
    restUrls.endPoint = "http://46.101.204.215:1337";
    restUrls.api = "/api/V1/";
    restUrls.login = "login";
    restUrls.reqPassRecovery = "requestPasswordRecovery";
    restUrls.passRecoveryReset = "passwordRecovery/reset";
    restUrls.avatar = "avatar";
    restUrls.student = "student";
    restUrls.chapter = "chapter";
    restUrls.illustration = "chapterillustrations";
    restUrls.competence = "studentcompetence";
    restUrls.educationalPlan = "educationalPlan";
    restUrls.separator = "/";
    return restUrls;
}());
exports.restUrls = restUrls;
