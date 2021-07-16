import { Movie } from "../models/Movie";
import dateFormat from "dateformat";

const DAY_MS = 1000 * 60 * 60 * 24;

export const buildChartData = (movies: Movie[]) => {
    let chartData: any = {};
  
    let volumeByYear: any = {};
    let ratingAggByYear: any = {};
    let volumeByDecade: any = {};
    let ratingAggByDecade: any = {};
    let volumeByWatchDate: any = {};
    let ratingAggByWatchDate: any = {};
  
    let minYear = 3000;
    let maxYear = 0;
  
    movies.forEach(m => {
      const year = m.titleBreakout.year.substr(1, 4);
      const decade = m.titleBreakout.year.substr(1, 3) + '0';
      const yearNum = parseInt(year, 10);
      const watchDate = m.date;
  
      if(yearNum < minYear) {
        minYear = yearNum;
      }
      if(yearNum > maxYear) {
        maxYear = yearNum;
      }
  
      if(volumeByYear[year]) {
        volumeByYear[year]++;
        ratingAggByYear[year] += parseFloat(m.rating);
      }
      else {
        volumeByYear[year] = 1;
        ratingAggByYear[year] = parseFloat(m.rating);
      }
  
      if(volumeByDecade[decade]) {
        volumeByDecade[decade]++;
        ratingAggByDecade[decade] += parseFloat(m.rating);
      }
      else {
        volumeByDecade[decade] = 1;
        ratingAggByDecade[decade] = parseFloat(m.rating);
      }

      if(volumeByWatchDate[watchDate]) {
          volumeByWatchDate[watchDate]++;
          ratingAggByWatchDate[watchDate] += parseFloat(m.rating);
      }
      else {
          volumeByWatchDate[watchDate] = 1;
          ratingAggByWatchDate[watchDate] = parseFloat(m.rating);
      }
    });

    const sortedMovies = [...movies].sort((a: Movie, b: Movie) => parseInt(a.id, 10) - parseInt(b.id));
    const earliestWatched = sortedMovies[0].date;
    const latestWatched = sortedMovies[sortedMovies.length - 1].date;
    let timeCounter = new Date(earliestWatched).getTime();

    let lastFormatted;
    chartData.volumeByWatchDate = [];
    chartData.ratingAggByWatchDate = [];
    chartData.watchDateTicks = [];

    /**
     * Loop through all days from first watched to latest watched
     */
    while(true) {
        const formatted = dateFormat(timeCounter, "mmmm d, yyyy")

        if(formatted === lastFormatted) {
            timeCounter += DAY_MS;
            continue;
        }

        chartData.watchDateTicks.push(formatted);

        lastFormatted = formatted;
        timeCounter += DAY_MS;

        // console.log(formatted);
        if(volumeByWatchDate[formatted]) {
            chartData.volumeByWatchDate.push({
                date: formatted,
                count: volumeByWatchDate[formatted]
            });

            chartData.ratingAggByWatchDate.push({
                date: formatted,
                avg: (ratingAggByWatchDate[formatted] / volumeByWatchDate[formatted]).toFixed(2)
            });
        }
        else {
            chartData.volumeByWatchDate.push({
                date: formatted,
                count: 0
            });
        }


        if(formatted === latestWatched) {
            break;
        }
    }
  
    let index = minYear;
  
    chartData.volumeByYear = [];
    chartData.ratingAggByYear = [];
    chartData.volumeByDecade = [];
    chartData.ratingAggByDecade = [];
  
    let decadesUsed = new Set();
  
    /**
     * Loop through all years from earliest movie release to most recent movie release
     */
    while(index <= maxYear) {
      const yString = index.toString();
      const decade = yString.substr(0,3) + '0';
  
      if(volumeByYear[yString]) {
        chartData.volumeByYear.push({
          year: index,
          count: volumeByYear[yString]
        });
  
        chartData.ratingAggByYear.push({
          year: index,
          avg: (ratingAggByYear[yString] / volumeByYear[yString]).toFixed(2)
        });
      }
      else {
        chartData.volumeByYear.push({
          year: index,
          count: 0
        });
  
        // chartData.ratingAggByYear.push({
        //   year: index,
        //   avg: 0
        // });
      }
  
      if(!decadesUsed.has(decade)) {
        decadesUsed.add(decade);
        if(volumeByDecade[decade]) {
          chartData.volumeByDecade.push({
            decade,
            count: volumeByDecade[decade]
          });
    
          chartData.ratingAggByDecade.push({
            decade,
            avg: (ratingAggByDecade[decade] / volumeByDecade[decade]).toFixed(2)
          });
        }
        else {
          chartData.volumeByDecade.push({
            decade,
            count: 0
          });
    
        //   chartData.ratingAggByDecade.push({
        //     decade,
        //     avg: 0
        //   });
        }
      }
  
      index++;
    }
  
    return chartData;
  };