import {Injectable} from '@angular/core';

@Injectable()
export class ModalMessageService {
    public isErrorVisible: boolean = false;
    public errorMsg: string = "";

    public isSuccessVisible: boolean = false;
    public successMsg: string = "";

    public isMsgVisible: boolean = false;
    public msg: string = "";

    constructor() {
    }

    showErrorMsg(msg: string) {
        this.errorMsg = msg;
        this.isErrorVisible = true;
    }

    showSuccessMsg(msg: string) {
        this.successMsg = msg;
        this.isSuccessVisible = true;
    }

    showMsg(msg: string) {
        this.msg = msg;
        this.isMsgVisible = true;
    }

    hide() {
        this.isErrorVisible = false;
        this.isSuccessVisible = false;
        this.isMsgVisible = false;
    }
}


