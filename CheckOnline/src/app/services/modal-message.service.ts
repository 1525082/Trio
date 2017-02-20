import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable()
export class ModalMessageService {
    public sbjInfoMsg: Subject<string> = new Subject();
    public sbjSuccessMsg: Subject<string> = new Subject();
    public sbjErrorMsg: Subject<string> = new Subject();

    constructor() {
    }

    showErrorMsg(msg: string) {
        this.sbjErrorMsg.next(msg);
    }

    showSuccessMsg(msg: string) {
        this.sbjSuccessMsg.next(msg);
    }

    showMsg(msg: string) {
        this.sbjInfoMsg.next(msg);
    }

    public getInfoSubject(): Subject<string> {
        return this.sbjInfoMsg;
    }

    public getSuccessSubject(): Subject<string> {
        return this.sbjSuccessMsg;
    }

    public getErrorSubject(): Subject<string> {
        return this.sbjErrorMsg;
    }
}


