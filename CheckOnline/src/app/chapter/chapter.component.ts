import { AuthenticationService } from '../authentication.service'
import { CheckDataService } from '../check-data.service'
import { Chapter } from '../classes/chapter.class'
import { Competence } from '../classes/chapterCompetence.class'
import { ChapterIllustration } from '../classes/chapterIllustration.class'
import { ChapterData } from '../classes/chapterData.class'
import { Component, OnInit, DoCheck, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

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
        let id;
        if (this.route.snapshot.params['id']) {
            id = +this.route.snapshot.params['id'];
            this.isAchieved = false;
        } else if (this.route.snapshot.params['chapterId']) {
            id = +this.route.snapshot.params['chapterId'];
            this.isAchieved = true;
        }
        if (id && this.selectedID != id) {
            this.selectedID = id;
            this.prepareChapterFolderUrl(id);
            this.loadData(id);
        }
    }

    private loadData(id: number) {
        let token = this.authService.getToken();

        // TODO: verschachtelung entfernen
        this.checkService.getChapterById(token, id).subscribe(
            chap => this.chapter = chap as Chapter,
            error => console.error("ERROR!: ", error),
            () => {
                this.changeView(id);
                this.checkService.getIllustrationByChapterId(token, id).subscribe(
                    illus => this.chapterIllus = illus as ChapterIllustration[],
                    error => console.error("ERROR!: ", error),
                    () => {
                        var observable;
                        if (this.isAchieved) {
                            observable = this.checkService.getAchievedCompetencesByChapterId(token, id);
                        } else {
                            observable = this.checkService.getCompetencesByChapterId(token, id);
                        }
                        observable.subscribe(
                            comps => this.chapterComps = comps as Competence[],
                            error => console.error("ERROR!: ", error),
                            () => {
                                this.updateCompetences();
                            });
                    });
            });
    }

    private prepareChapterFolderUrl(id: number) {
        var folder: string = id.toLocaleString();
        if (id < 10) {
            folder = "0" + id.toLocaleString();
        }
        this.chapterFolderUrl = "../../images/chapter" + folder + "/";
    }

    private changeView(id) {
        var main = document.getElementsByTagName("body").item(0);
        if (main) {
            main.style.backgroundColor = this.chapter.weakcolor;
        }

        this.flagUrl = this.chapterFolderUrl + "littleChapterFlag.png";
    }

    private updateCompetences() {
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

    getImageUrl(checked: boolean) {
        if (checked) {
            return this.chapterFolderUrl + "competenceDone.png";
        } else {
            return this.chapterFolderUrl + "competenceUndone.png";
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