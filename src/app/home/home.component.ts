import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api.service';
import { map, shareReplay, startWith, tap } from 'rxjs/operators';

const CACHE_KEY = 'cacheKey'

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

  params: string = '';

  public answer_count: number;
  public view_count: number;

  public wiki;
  public order = 'desc';

  public closed;
  public sort = 'activity';
  data$: Observable<any>;

  public questions;

  public counter = 0;
  timeLeft: number = 60;
  interval;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private http: HttpClient
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
        this.totalLength = this.all_questions.length;
      if (this.totalLength > 8) {
        this.showPagination = true;
      } else {
        this.showPagination = false;
      }

      if (this.all_questions.length == 0) {
        this.notFound = true;
        this.loaderActive = false;
        return;
      }
      this.loaderActive = false;
      this.input = ""
      if(localStorage.length > 10) {
        localStorage.clear()
      }
      localStorage.setItem(url, JSON.stringify(data['items']))

    })

  }

  public goToQuestion(link) {
    window.open(link, '_blank');
  }
}
