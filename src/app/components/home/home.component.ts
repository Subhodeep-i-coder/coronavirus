import { Component, OnInit } from '@angular/core';
import { GoogleChartsModule } from 'angular-google-charts';
import { GlobalDataSummary } from 'src/app/models/global-Data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalConfirmed = 0;
  totalDeaths = 0;
  totalActive = 0;
  totalRecovered = 0;
  globalData: GlobalDataSummary[];
  datatable = [];
  loading=true;
 chart = {
   PieChart : "PieChart" , 
   LineChart : "LineChart" ,
   height: 500 ,
   options: {
    animation : {
      duration:500 , 
      easing : 'out'
    },
    is3D : true
  }
 }
   
 
  constructor(private dataService: DataServiceService) { }


  initChart(caseType : string) {

    this.datatable = [];
    // this.datatable.push(["Country", "Cases"])

    this.globalData.forEach(cs => {
      
      let value :number ;
      if (caseType == 'c')
        if (cs.confirmed > 2000)
          value = cs.confirmed
          
      if (caseType == 'a')
        if (cs.active > 2000)
          value = cs.active
      if (caseType == 'd')
        if (cs.deaths > 1000)
          value = cs.deaths
          
      if (caseType == 'r')
        if (cs.recovered > 2000)
            value = cs.recovered
        

      this.datatable.push([
            cs.country, value
          ])
    })
    console.log(this.datatable);

   
      //firstRowIsData: true,
     
 
  }

  ngOnInit(): void {
    this.dataService.getGlobalData()
      .subscribe(
        {
          next: (result) => {
            console.log(result);
            this.globalData = result;
            result.forEach(cs => {
              if (!Number.isNaN(cs.confirmed)) {
                this.totalActive += cs.active
                this.totalConfirmed += cs.confirmed
                this.totalDeaths += cs.deaths
                this.totalRecovered += cs.recovered
              }
            })
            this.initChart('c');
          },
          complete : ()=>{
            this.loading = false;
          } 

        }
      )

  }

  updateChart(input: HTMLInputElement) {
    console.log(input.value);
    this.initChart(input.value)
  }

}
