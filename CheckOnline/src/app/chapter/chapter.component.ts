import {AuthenticationService} from '../authentication.service'
import {CheckDataService} from '../check-data.service'
import {Chapter} from '../classes/chapter.class'
import {Competence} from '../classes/chapterCompetence.class'
import {ChapterIllustration} from '../classes/chapterIllustration.class'
import {ChapterData} from '../classes/chapterData.class'
import {Component, DoCheck, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router'

@Component({
    selector: 'app-chapter',
    templateUrl: './chapter.component.html',
    styleUrls: ['./chapter.component.css']
})
export class ChapterComponent implements DoCheck, OnDestroy {
    private chapter: Chapter;
    private selectedID: number;
    private chapterIllus: ChapterIllustration[] = [];
    private chapterComps: Competence[] = [];
    private chapterFolderUrl: string;
    protected construction: ChapterData[] = null;
    protected flagUrl = "";


    constructor(private route: ActivatedRoute,
                private checkService: CheckDataService,
                private authService: AuthenticationService) {
    }

    private isAchieved = false;

    ngDoCheck() {
        let id = undefined;
        if (this.route.snapshot.params['id']) {
            id = +this.route.snapshot.params['id'];
            this.isAchieved = false;
        } else if (this.route.snapshot.params['chapterId']) {
            id = +this.route.snapshot.params['chapterId'];
            console.log(this.route.snapshot.params['chapterId']);
            this.isAchieved = true;
        }
        if (id != undefined && this.selectedID != id) {
            this.selectedID = id;
            this.setColor();
            if (id == 0) {
                this.checkService.getAchievedCompetences(this.authService.getToken()).subscribe(
                    comps => this.chapterComps = comps as Competence[],
                    error => console.error("ERROR!: ", error),
                    () => {
                        this.chapterIllus = new Array<ChapterIllustration>(this.chapterComps.length);
                        for(let i = 0; i < this.chapterIllus.length; i++) {
                            this.chapterIllus[i] = new ChapterIllustration(0,
                                "/images/illustrations/illustrationLeft.png",
                                "/images/illustrations/illustrationRight.png");
                        }
                        this.updateChapterData();
                    });
            } else {
                this.loadData(id);
            }
        }
    }

    private loadData(id: number) {
        let token = this.authService.getToken();
        /*
         ILLUSTRATIONEN FÜR ALLE KOMPETENZEN NICHT AUSREICHEND!!!
         */
        // TODO: verschachtelung entfernen
        this.checkService.getChapterById(token, id).subscribe(
            chap => this.chapter = chap as Chapter,
            error => console.error("ERROR!: ", error),
            () => {
                //this.changeView();
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

    protected color: string = "#FFFFFF";

    public setColor() {
        if(this.selectedID == 0) {
            this.color = "#FF00FF";
        } else {
            this.color = this.chapter.weakcolor;
        }
    }

    private changeView() {
        let main = document.getElementsByClassName("main").item(0);
        //let main = document.getElementsByTagName("body").item(0);
        if (main) {
            main.setAttribute("style", "backgroud-color: " + this.chapter.weakcolor);
            //main.style.backgroundColor = this.chapter.weakcolor;
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