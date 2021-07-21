import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public input: string = 'How to center an image';

  public all_questions;
  public loaderActive: boolean = false;
  public notFound: boolean = false;
  public showPagination: boolean = false;
  public acceptedValue: boolean;
  public showLimit: boolean = false
  public answer_count: number;
  public view_count: number;
  public wiki;
  public order = 'desc';
  public closed;
  public sort = 'activity';

  public counter = 0;
  timeLeft: number = 60;
  interval;

  constructor(
    private apiService: ApiService,
  ) {
    this.startTimer()
  }

  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 60;
      }
    }, 1000)
  }


  totalLength: any;
  page: number = 1;

  ngOnInit() {}

  onChange(value) {
    this.acceptedValue = value;
  }

  onChangeClosed(value) {
    this.closed = value;
  }

  onChangeWiki(value) {
    this.wiki = value;
  }

  onChangeOrder(value) {
    this.order = value;
  }
  onChangeSort(value) {
    this.sort = value;
  }

  public searchKeywords() {
    this.showLimit = false
    this.notFound = false;
    this.loaderActive = true;
    let url = `title=${this.input}&accepted=${this.acceptedValue}&answers=${this.answer_count}&closed=${this.closed}&views=${this.view_count}&wiki=${this.wiki}&order=${this.order}&sort=${this.sort}`;
    if(localStorage.getItem(url)) {
      this.all_questions = JSON.parse(localStorage.getItem(url))
      this.loaderActive = false
      this.input = ""
      this.showPagination = true
      return
    }
    if(this.counter == 5 && this.timeLeft > 0) {
      this.loaderActive = false
      this.showLimit = true
      return
    }
    this.apiService.get(url).subscribe(data => {
      this.counter++
      this.all_questions = data['items']
      this.loaderActive = false
      this.all_questions.length > 8 ? this.showPagination = true : this.showPagination = false;
      if (this.all_questions.length == 0) {
        this.notFound = true;
        this.loaderActive = false;
        return;
      }
      this.loaderActive = false;
      this.input = ""
      if(localStorage.length > 50) {
        localStorage.clear()
      }
      localStorage.setItem(url, JSON.stringify(data['items']))
    })

  }
  public goToQuestion(link) {
    window.open(link, '_blank');
  }
}
