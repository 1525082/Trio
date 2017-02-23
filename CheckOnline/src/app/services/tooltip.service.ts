import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {TooltipDirective} from "ng2-bootstrap";
import {APP_CONSTS} from "../app.config";

@Injectable()
export class TooltipService {
    /*
     Information about the style, tag, css classes
     */
    private styleTag: HTMLElement = null;

    /*
     Selected tooltip style
     */
    private tooltipState: TooltipState = TooltipState.NONE;

    constructor(private router: Router) {
        this.styleTag = document.getElementById(APP_CONSTS.TOOLTIP_STYLE_TAG_ID);
        // react on route event to add the style automatically
        router.events.subscribe((e) => {
            if (e.url.startsWith(APP_CONSTS.CHAPTER_PATH) || e.url.startsWith(APP_CONSTS.ACHIEVED_CHAPTER_PATH)
                || e.url.startsWith(APP_CONSTS.EDUCATIONAL_PLAN_PATH)) {
                if (this.tooltipState != TooltipState.COMPETENCE) {
                    this.tooltipState = TooltipState.COMPETENCE;
                    this.styleTag.innerHTML = APP_CONSTS.TOOLTIP_COMPETENCE_CSS;
                }
            } else if (e.url == APP_CONSTS.LOGIN_PATH || e.url == APP_CONSTS.CHANGE_PASSWORD_PATH
                || e.url == APP_CONSTS.DELETE_PROFILE_PATH) {
                if (this.tooltipState != TooltipState.INPUT) {
                    this.tooltipState = TooltipState.INPUT;
                    this.styleTag.innerHTML = APP_CONSTS.TOOLTIP_INPUT_CSS;
                }
            } else {
                // nothing to change
            }
        });
    }

    static showTooltip(tooltipDirective: TooltipDirective, message: string) {
        tooltipDirective.tooltip = message;
        tooltipDirective.show();
    }

    static hideTooltip(tooltipDirective: TooltipDirective) {
        tooltipDirective.tooltip = APP_CONSTS.EMPTY_STRING;
        tooltipDirective.hide();
    }
}

enum TooltipState {
    COMPETENCE,
    INPUT,
    NONE
}