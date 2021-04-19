import { Component, OnInit } from '@angular/core';
import { merge } from 'rxjs';
import { count, map } from 'rxjs/operators';
import { DateWiseData } from 'src/app/models/date-wise-data';
import { GlobalDataSummary } from 'src/app/models/global-Data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  
  data:any=[]
  countries: string[] = [];
  totalConfirmed = 0;
  totalDeaths = 0;
  totalActive = 0;
  totalRecovered = 0;
  selectedCountryData: DateWiseData[];
  dateWiseData;
  loading = true;
  dataTable = [];


  chart = {
    LineChart: "LineChart",
    height: 500,
    options: {
      animation: {
        duration: 500,
        easing: 'out'
      },
    }
  }



  constructor(private service: DataServiceService) { }

  ngOnInit(): void {

    merge(
      this.service.getDateWiseData().pipe(
        map(result => {
          this.dateWiseData = result;
        })
      ),
      this.service.getGlobalData().pipe(
        map(result =>{

          this.data = result;
          this.data.forEach(cs => {
            this.countries.push(cs.country)
          })
        })
      )
    ).subscribe(
      {
        complete : ()=> {
        this.updateValues('Afghanistan')
          this.loading=false;
        }
      }
    )

  }



  updateChart() {
this.dataTable=[];
   // this.dataTable.push(['Date', 'cases'])
    this.selectedCountryData.forEach(cs => {
      this.dataTable.push([cs.date, cs.cases])
    })

  }

  updateValues(country: string) {
    console.log(country);
    this.data.forEach(cs => {
      if (cs.country == country) {
        this.totalActive = cs.active
        this.totalDeaths = cs.deaths
        this.totalRecovered = cs.recovered
        this.totalConfirmed = cs.confirmed
      }
    })
    this.selectedCountryData = this.dateWiseData[country];
    this.updateChart();
    // console.log(this.selectedCountryData);

  }
}
