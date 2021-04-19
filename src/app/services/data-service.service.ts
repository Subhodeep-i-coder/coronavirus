
import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { GlobalDataSummary } from '../models/global-Data';
import { DateWiseData } from '../models/date-wise-data';
import { toBase64String } from '@angular/compiler/src/output/source_map';
@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private baseUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/'
  private getGlobalDataUrl = ' '
  private dateWiseDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';

  private extension = '.csv'
  month
  date
  year

  getDate(date: number) {
    if (date < 10) {
      return '0' + date
    }
    return date
  }

  constructor(private http: HttpClient) {
    let now = new Date();
    this.month = now.getMonth() + 1;
    this.date = now.getDate();
    this.year = now.getFullYear();

    console.log({
      date: this.date,
      month: this.month,
      year: this.year
    });

    this.getGlobalDataUrl = `${this.baseUrl}${this.month}-${this.getDate(this.date)}-${this.year}${this.extension}`;
    console.log(this.getGlobalDataUrl);



  }

  getDateWiseData() {
    return this.http.get(this.dateWiseDataUrl, { responseType: 'text' })
      .pipe(map(result => {
        let rows = result.split('\n');
        // console.log(rows);
        let mainData = {};

        let header = rows[0];
        let dates = header.split(/,(?=\S)/)

        dates.splice(0, 4);
        rows.splice(0, 1);

        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/)
          let con = cols[1];
          cols.splice(0, 4);
          // console.log(cols , con);
          mainData[con] = [];
          cols.forEach((value, index) => {
            let dw: DateWiseData = {
              cases: +value,
              country: con,
              date: new Date(Date.parse(dates[index]))

            }
            mainData[con].push(dw)
          })
        })
        // console.log(mainData);

        return mainData;
      }))
  }

  getGlobalData() {
    return (this.http.get(this.getGlobalDataUrl, { responseType: 'text' })).pipe(
      map(result => {
        let data: GlobalDataSummary[] = [];
        let raw = {}
        let rows = result.split('\n');
        rows.splice(0, 1);
        //console.log(rows);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/);
          let cs = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10]
          };
          let temp: GlobalDataSummary = raw[cs.country];
          if (temp) {
            temp.active = cs.active + temp.active;
            temp.confirmed = cs.confirmed + temp.confirmed;
            temp.deaths = cs.deaths + temp.deaths;
            temp.recovered = cs.recovered + temp.recovered;
            raw[cs.country] = temp;
          }
          else {
            raw[cs.country] = cs;
          }
        })
        console.log(raw);
        return <GlobalDataSummary[]>Object.values(raw);
      }),
      catchError((err:HttpErrorResponse)=>{
        if(err.status == 404 ){
          let now = new Date()
          now.setDate(now.getDate() - 1);
          this.month = now.getMonth();
          this.date = now.getDate();
          this.year = now.getFullYear();
          this.getGlobalDataUrl = `${this.baseUrl}${this.getDate(this.month)}-${this.getDate(this.date)}-${this.year}${this.extension}`;
          return this.getGlobalData();
         //console.log(this.globalDataUrl)
        }
      })

    )

  }
}
