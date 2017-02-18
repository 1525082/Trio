import {AuthenticationService} from '../services/authentication.service'
import {CheckDataService} from '../services/check-data.service'
import {Chapter} from '../classes/chapter.class'
import {Competence} from '../classes/chapterCompetence.class'
import {ChapterIllustration} from '../classes/chapterIllustration.class'
import {ChapterData} from '../classes/chapterData.class'
import {Component, DoCheck, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router'

@Component({
    selector: 'app-chapter',
    templateUrl: './chapter.component.html',
    styleUrls: ['./chapter.component.css']
})
export class ChapterComponent implements OnInit, DoCheck, OnDestroy {
    private chapter: Chapter;
    private selectedID: number;
    private chapterIllus: ChapterIllustration[] = [];
    private chapterComps: Competence[] = [];
    protected construction: ChapterData[] = null;

    constructor(private route: ActivatedRoute,
                private checkService: CheckDataService,
                private authService: AuthenticationService) {
    }

    private isAchieved = false;

    private body = null;

    ngOnInit() {
        this.body = document.getElementsByTagName("body").item(0);
    }

    ngDoCheck() {
        let id = this.resolveId();
        if (id != undefined && this.selectedID != id) {
            this.selectedID = id;
            if (id == 0) {
                this.loadAllAchievedCompetences();
            } else {
                this.loadAchievedOrNoneAchievedChapter(id);
            }
        }
    }

    private resolveId(): number {
        if (this.route.snapshot.params['id']) {
            this.isAchieved = false;
            return +this.route.snapshot.params['id'];
        } else if (this.route.snapshot.params['chapterId']) {
            this.isAchieved = true;
            return +this.route.snapshot.params['chapterId'];
        } else {
            return undefined;
        }
    }

    private loadAllAchievedCompetences() {
        /*
            ILLUSTRATIONEN FÜR ALLE KOMPETENZEN NICHT AUSREICHEND!!!
         */
        this.checkService.getAchievedCompetences(this.authService.getToken()).subscribe(
            comps => this.chapterComps = comps as Competence[],
            error => console.error("ERROR!: ", error),
            () => {
                this.setStyle("#D3DDF2");
                this.chapterIllus = new Array<ChapterIllustration>(this.chapterComps.length);
                for(let i = 0; i < this.chapterIllus.length; i++) {
                    this.chapterIllus[i] = new ChapterIllustration(0,
                        "/images/illustrations/illustrationLeft.png",
                        "/images/illustrations/illustrationRight.png");
                }
                this.updateChapterData();
            });
    }

    private loadAchievedOrNoneAchievedChapter(id: number) {
        let token = this.authService.getToken();
        // TODO: verschachtelung entfernen
        this.checkService.getChapterById(token, id).subscribe(
            chap => this.chapter = chap as Chapter,
            error => console.error("ERROR!: ", error),
            () => {
                this.setStyle(this.chapter.weakcolor);
                this.checkService.getIllustrationByChapterId(token, id).subscribe(
                    illus => this.chapterIllus = illus as ChapterIllustration[],
                    error => console.error("ERROR!: ", error),
                    () => {
                        let observable;
                        if (this.isAchieved) {
                            observable = this.checkService.getAchievedCompetencesByChapterId(token, id);
                        } else {
                            observable = this.checkService.getCompetencesByChapterId(token, id);
                        }
                        observable.subscribe(
                            comps => this.chapterComps = comps as Competence[],
                            error => console.error("ERROR!: ", error),
                            () => {
                                this.updateChapterData();
                            });
                    });
            });
    }

    public setStyle(color: string) {
        if (this.body) {
            this.body.setAttribute("style", "background-color: " + color);
        }
    }

    private updateChapterData() {
        let max = (this.chapterComps.length / 5);
        if (max > Math.floor(max)) {
            max = Math.floor(max) + 1;
        }

        this.construction = new Array<ChapterData>(max);
        for (let k = 0; k < max; k++) {
            let anzahl = 5;
            if (k == (max - 1)) {
                anzahl = this.chapterComps.length - (k * 5);
            }

            this.construction[k] = new ChapterData(anzahl);
            this.construction[k].illustration = this.chapterIllus[k];
            for (let i = 0; i < anzahl; i++) {
                let elmId = ((k * 5) + i);
                this.construction[k].competences[i] = this.chapterComps[elmId];
            }
        }
    }

    private getFolderNrForComp(chapterId: number) {
        if (chapterId < 10) {
            return "0" + chapterId.toLocaleString();
        }
        return chapterId.toLocaleString();
    }

    public getFlagUrl(chapterId: number) {
        return "../../images/chapter" + this.getFolderNrForComp(chapterId) + "/littleChapterFlag.png";
    }

    getImageUrl(checked: boolean, chapterId: number) {
        var folder = "../../images/chapter" + this.getFolderNrForComp(chapterId) + "/";
        if (checked) {
            return folder + "competenceDone.png";
        } else {
            return folder + "competenceUndone.png";
        }
    }

    ngOnDestroy() {
        // TODO: hintergrundfarbe zurücksetzen
        const main = document.getElementsByTagName('body').item(0);
        if (main) {
            main.style.backgroundColor = '#FFFFFF';
        }
    }
}