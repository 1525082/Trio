import { Component, OnInit } from '@angular/core';
import {CheckDataService} from "../check-data.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private checkService: CheckDataService) { }

  ngOnInit() {
  }

}
