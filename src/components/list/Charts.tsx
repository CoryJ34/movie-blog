import React from "react";
import react, { useState } from "react";
import { connect } from "react-redux";
import { LineChart, XAxis, Line, Tooltip, YAxis } from "recharts";
import { Movie } from "../../models/Movie";
import "./styles/Charts.scss";

interface Props {
  filteredMovies: Movie[];
  chartData: any;
}

const testData: any = [
  {
    test: 'A',
    val: 1
  },
  {
    test: 'B',
    val: 8
  },
  {
    test: 'C',
    val: 3
  },
  {
    test: 'D',
    val: 7
  }
]

const Charts = (props: Props) => {
  if(!props.chartData) {
    return null;
  }

  const {chartData} = props;
  // Volume by year/decade
  // Rating by year/decade
  // Rating by watched date
  // Volume by watched date
  // Rating histogram
  // const allTicks = props.chartData.volumeByYear.map((v: any) => v.year);
  // let ticks: string[] = [];
  // let count = allTicks[0];

  // while(count <= allTicks[allTicks.length - 1]) {
  //   ticks.push(count.toString());
  //   count++;
  // }

  return (
    <div className="charts">
      <div className="chart-title">Volume By Release Year</div>
      <LineChart data={chartData.volumeByYear} width={1400} height={200}>
        <Tooltip payload={chartData.volumeByYear}/>
        <YAxis />
        <XAxis dataKey="year" /*ticks={ticks} tickCount={ticks.length}*//>
        <Line dataKey="count" yAxisId={0} dot={false}/>
      </LineChart>

      <div className="chart-title">Avg Rating By Release Year</div>
      <LineChart data={chartData.ratingAggByYear} width={1400} height={200}>
        <Tooltip payload={chartData.ratingAggByYear}/>
        <YAxis domain={[0, 10]} />
        <XAxis dataKey="year"/>
        <Line dataKey="avg" yAxisId={0} dot={false} />
      </LineChart>

      <div className="chart-title">Volume By Release Decade</div>
      <LineChart data={chartData.volumeByDecade} width={1400} height={200}>
        <Tooltip payload={chartData.volumeByDecade}/>
        <YAxis />
        <XAxis dataKey="decade"/>
        <Line dataKey="count" yAxisId={0} dot={false}/>
      </LineChart>

      <div className="chart-title">Avg Rating By Release Decade</div>
      <LineChart data={chartData.ratingAggByDecade} width={1400} height={200}>
        <Tooltip payload={chartData.ratingAggByDecade}/>
        <YAxis domain={[0, 10]} />
        <XAxis dataKey="decade"/>
        <Line dataKey="avg" yAxisId={0} dot={false}/>
      </LineChart>

      <div className="chart-title">Volume By Watched Date</div>
      <LineChart data={chartData.volumeByWatchDate} width={1400} height={200}>
        <Tooltip />
        <YAxis />
        <XAxis dataKey="date" />
        <Line dataKey="count" dot={false} />
      </LineChart>

      <div className="chart-title">Avg Rating By Watched Date</div>
      <LineChart data={chartData.ratingAggByWatchDate} width={1400} height={200}>
        <Tooltip />
        <YAxis domain={[0, 10]} />
        <XAxis dataKey="date" />
        <Line dataKey="avg" dot={false} />
      </LineChart>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    filteredMovies: state.movieStore?.filteredMovies,
    chartData: state.movieStore?.chartData,
  };
};

export default connect(mapStateToProps)(Charts);
