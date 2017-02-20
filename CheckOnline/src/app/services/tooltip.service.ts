import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {TooltipDirective} from "ng2-bootstrap";

@Injectable()
export class TooltipService {
    /*
     Routes for input tooltip style
     */
    private routeLogin = "/";
    private routeChangePw = "/changepw";
    private routeDeleteProfile = "/deleteprofile";
    /*
     Routes for competences tooltip style
     */
    private routeHome = "/home";
    private routeChapter = "/chapter";
    private routeAchieved = "/achieved";
    private routePlan = "/educationalPlan";
    /*
     Information about the style, tag, css classes
     */
    private styleTagId = "tooltipStyle";
    private styleTag: HTMLElement = null;
    private competenceTooltipCSS = `
.tooltip .tooltip-inner {
    background-color: #001a3a;
    color: white;
    text-align: left;
    padding: 10px 15px;
    width: 250px;
    max-width: 250px;
    min-width: 250px;
    top: 200px;
    /*
    min-height: 60px;
    transform: translateY(20%);
    */
    border: 3px solid white;
}

.tooltip.right .tooltip-arrow {
    margin-top: -6px;
    border-width: 6px 6px 6px 0;
    border-right-color: white;
}

.tooltip.right {
    margin-left: 12px;
    padding: 0 6px;
}`;
    private inputTooltipCSS = `
.tooltip .tooltip-inner {
    background-color: #d3ddf2;
    color: #001a3a;
    text-align: left;
    padding: 10px 15px;
    width: 300px;
    max-width: 300px;
    min-width: 300px;
    /*
    margin-top: 50px;
    height: 90px;
    */
}

.tooltip.right .tooltip-arrow {
    margin-top: -6px;
    border-width: 6px 6px 6px 0;
    border-right-color: #d3ddf2;
}

.tooltip.right {
    margin-left: 5px;
    padding: 0 6px;
}`;
    /*
     Selected tooltip style
     */
    private tooltipState: TooltipState = TooltipState.NONE;

    constructor(private router: Router) {
        this.styleTag = document.getElementById(this.styleTagId);
        // react on route event to add the style automatically
        router.events.subscribe((e) => {
            if (e.url.startsWith(this.routeChapter) || e.url.startsWith(this.routeAchieved)
                || e.url.startsWith(this.routePlan) || e.url == this.routeHome) {
                if (this.tooltipState != TooltipState.COMPETENCE) {
                    this.tooltipState = TooltipState.COMPETENCE;
                    this.styleTag.innerHTML = this.competenceTooltipCSS;
                }
            } else if (e.url == this.routeLogin || e.url == this.routeChangePw
                || e.url == this.routeDeleteProfile) {
                if (this.tooltipState != TooltipState.INPUT) {
                    this.tooltipState = TooltipState.INPUT;
                    this.styleTag.innerHTML = this.inputTooltipCSS;
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
        tooltipDirective.tooltip = "";
        tooltipDirective.hide();
    }
}

enum TooltipState {
    COMPETENCE,
    INPUT,
    NONE
}