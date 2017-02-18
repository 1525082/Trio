import {Injectable} from '@angular/core';
import {Router} from "@angular/router";

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
        .tooltip.right .tooltip-arrow { border-right-color: #FF00FF; } 
        .tooltip-inner { background: #FF00FF; max-width: 300px; }`;
    private inputTooltipCSS = `
        .tooltip.right .tooltip-arrow { border-right-color: #FF0000; } 
        .tooltip-inner { background: #FF0000; max-width: 300px; }`;
    /*
    Selected tooltip style
     */
    private tooltipState: TooltipState = TooltipState.NONE;

    constructor(private router: Router) {
        this.styleTag = document.getElementById(this.styleTagId);
        // react on route event to add the style automatically
        router.events.subscribe((e) => {
            if(e.url.startsWith(this.routeChapter) || e.url.startsWith(this.routeAchieved)
                || e.url.startsWith(this.routePlan) || e.url == this.routeHome) {
                if(this.tooltipState != TooltipState.COMPETENCE) {
                    this.tooltipState = TooltipState.COMPETENCE;
                    this.styleTag.innerHTML = this.competenceTooltipCSS;
                }
            } else if (e.url == this.routeLogin || e.url == this.routeChangePw
                || e.url == this.routeDeleteProfile) {
                if(this.tooltipState != TooltipState.INPUT) {
                    this.tooltipState = TooltipState.INPUT;
                    this.styleTag.innerHTML = this.inputTooltipCSS;
                }
            } else {
                // nothing to change
            }
        });
    }
}

enum TooltipState {
    COMPETENCE,
    INPUT,
    NONE
}