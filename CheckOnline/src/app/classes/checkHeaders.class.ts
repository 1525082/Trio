import {Headers} from "@angular/http";

export class CheckHeaders {
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