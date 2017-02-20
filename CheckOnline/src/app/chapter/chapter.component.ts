import {CheckDataService} from '../services/check-data.service'
import {Chapter} from '../classes/chapter.class'
import {Competence} from '../classes/chapterCompetence.class'
import {ChapterIllustration} from '../classes/chapterIllustration.class'
import {ChapterData} from '../classes/chapterData.class'
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router'

@Component({
    selector: 'app-chapter',
    templateUrl: './chapter.component.html',
    styleUrls: ['./chapter.component.css']
})
export class ChapterComponent implements OnInit, OnDestroy {
    private chapter: Chapter;
    private chapterIllus: ChapterIllustration[] = [];
    private chapterComps: Competence[] = [];
    private construction: ChapterData[] = null;

    private params;
    private selectedID: number;
    private body = null;

    constructor(protected route: ActivatedRoute,
                protected checkService: CheckDataService) {
    }

    ngOnInit() {
        this.setBody(document.getElementsByTagName("body").item(0));
        this.route.params.subscribe(
            params => {
                this.setParams(params);
                this.onParamChanged(this);
            }
        );
    }

    onParamChanged(scope: ChapterComponent) {
        if (scope.getParams().id) {
            scope.setSelectedId(parseInt(scope.getParams().id));
            scope.loadNonAchievedChapter();
        } else if (scope.getParams().chapterId) {
            scope.setSelectedId(parseInt(scope.getParams().chapterId));
            if (scope.getSelectedId() === 0) {
                scope.loadAllAchievedCompetencesTEST();
            } else {
                scope.loadAchievedChapter();
            }
        }
    }

    // TODO: remove from all class in one!
    private handleError(error: any) {
        console.error("ERROR!: ", error);
    }

    private loadAllAchievedCompetencesTEST() {
        /*
         ILLUSTRATIONEN FÜR ALLE KOMPETENZEN NICHT AUSREICHEND!!!
         TODO: REST API MUSS ENTSPRECHEND VIELE ILLUSTRATIONEN ZURÜCKGEBEN!
         */
        this.checkService.requestAchievedCompetences().subscribe(
            comps => this.setChapterComps(comps),
            this.handleError,
            () => {
                this.setStyle("#D3DDF2");
                this.setChapterIllus(new Array<ChapterIllustration>(this.getChapterComps().length));
                this.getChapterIllus().fill(new ChapterIllustration(0,
                    "/images/illustrations/illustrationLeft.png",
                    "/images/illustrations/illustrationRight.png"));
                this.updateChapterData();
            });
    }

    private loadAchievedChapter() {
        this.checkService.requestChapterById(this.getSelectedId()).subscribe(
            chapter => this.setChapter(chapter),
            this.handleError,
            () => {
                this.setStyle(this.getChapter().weakcolor);
                this.checkService.requestIllustrationByChapterId(this.getSelectedId()).subscribe(
                    illus => this.setChapterIllus(illus),
                    this.handleError,
                    () => {
                        this.checkService.requestAchievedCompetencesByChapterId(this.getSelectedId()).subscribe(
                            comps => this.setChapterComps(comps),
                            this.handleError,
                            () => {
                                this.updateChapterData();
                            });
                    });
            });
    }

    private loadNonAchievedChapter() {
        this.checkService.requestChapterById(this.getSelectedId()).subscribe(
            chapter => this.setChapter(chapter),
            this.handleError,
            () => {
                this.setStyle(this.getChapter().weakcolor);
                this.checkService.requestIllustrationByChapterId(this.getSelectedId()).subscribe(
                    illus => this.setChapterIllus(illus),
                    this.handleError,
                    () => {
                        this.checkService.requestCompetencesByChapterId(this.getSelectedId()).subscribe(
                            comps => this.setChapterComps(comps),
                            this.handleError,
                            () => {
                                this.updateChapterData();
                            });
                    });
            });
    }

    public setStyle(color: string) {
        if (this.getBody()) {
            this.getBody().setAttribute("style", "background-color: " + color);
        }
    }

    private updateChapterData() {
        let max = (this.getChapterComps().length / 5);
        if (max > Math.floor(max)) {
            max = Math.floor(max) + 1;
        }

        this.setConstruction(new Array<ChapterData>(max));
        for (let k = 0; k < max; k++) {
            let count = (k == (max - 1)) ? this.getChapterComps().length - (k * 5) : 5;

            this.getConstruction()[k] = new ChapterData(count);
            this.getConstruction()[k].illustration = this.getChapterIllus()[k];
            for (let i = 0; i < count; i++) {
                let elmId = ((k * 5) + i);
                this.getConstruction()[k].competences[i] = this.getChapterComps()[elmId];
            }
        }
    }

    private getFolderNrForComp(id: number) {
        return (id < 10) ? "0" + id.toString() : id.toString();
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
        if (this.getBody()) {
            this.getBody().style.backgroundColor = "#FFFFFF";
        }
    }

    /*
     *              GETTER && SETTER
     *-----------------------------------------------
     */

    public setSelectedId(id: number) {
        this.selectedID = id;
    }

    public getSelectedId(): number {
        return this.selectedID;
    }

    public setBody(body: HTMLElement) {
        this.body = body;
    }

    public getBody(): HTMLElement {
        return this.body;
    }

    public setChapter(chapter: Chapter) {
        this.chapter = chapter;
    }

    public getChapter(): Chapter {
        return this.chapter;
    }

    public setChapterIllus(illus: ChapterIllustration[]) {
        this.chapterIllus = illus;
    }

    public getChapterIllus(): ChapterIllustration[] {
        return this.chapterIllus;
    }

    public setChapterComps(comps: Competence[]) {
        this.chapterComps = comps;
    }

    public getChapterComps(): Competence[] {
        return this.chapterComps;
    }

    public setConstruction(construction: ChapterData[]) {
        this.construction = construction;
    }

    public getConstruction() {
        return this.construction;
    }

    public setParams(params) {
        this.params = params;
    }

    public getParams() {
        return this.params;
    }
}