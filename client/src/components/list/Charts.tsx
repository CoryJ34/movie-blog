import { Tab, Tabs } from "@material-ui/core";
import React from "react";
import react, { useState } from "react";
import { connect } from "react-redux";
import {
  LineChart,
  XAxis,
  Line,
  Tooltip,
  YAxis,
  BarChart,
  Bar,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import { Movie } from "../../models/Movie";
import "./styles/Charts.scss";

interface Props {
  filteredMovies: Movie[];
  chartData: any;
  watchListRanges: any[];
}

const CHARTS = {
  VOL_BY_RELEASE_YEAR: "volByReleaseYear",
  RATING_BY_RELEASE_YEAR: "ratingByReleaseYear",
  VOL_BY_DECADE: "volByDecade",
  RATING_BY_DECADE: "ratingByDecade",
  VOL_BY_WATCHED_DATE: "volByWatchedDate",
  RATING_BY_WATCHED_DATE: "ratingByWatchedDate",
  CUMULATIVE_BY_WATCHED_DATE: "cumulativeByWatchedDate",
  RATING_HISTOGRAM: "ratingHistogram",
  RATING_DIFF_BY_ORDER: "ratingDiffByOrder",
  WEIGHTED_RATING_DIFF_BY_ORDER: "weightedRatingDiffByOrder",
};

const Charts = (props: Props) => {
  const [chartTab, setChartTab] = useState(CHARTS.VOL_BY_RELEASE_YEAR);

  if (!props.chartData) {
    return null;
  }

  // const renderCustomBarLabel =
  //   (label: string) =>
  //   // @ts-ignore
  //   ({ payload, x, y, width, height, value }) => {
  //     return (
  //       <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>
  //         {label}
  //       </text>
  //     );
  //   };

  const refArea = (x1: string | number, x2: string | number, label: string) => {
    return (
      <ReferenceArea
        x1={x1}
        x2={x2}
        y1={0}
        stroke="#CCEE99"
        opacity={0.2}
        label={label}
      />
    );
  };

  const { chartData } = props;
  // const allTicks = props.chartData.volumeByYear.map((v: any) => v.year);
  // let ticks: string[] = [];
  // let count = allTicks[0];

  // while(count <= allTicks[allTicks.length - 1]) {
  //   ticks.push(count.toString());
  //   count++;
  // }

  const renderSelectedChart = () => {
    if (chartTab === CHARTS.VOL_BY_RELEASE_YEAR) {
      return (
        <BarChart data={chartData.volumeByYear}>
          <Tooltip payload={chartData.volumeByYear} />
          <YAxis />
          <XAxis dataKey="year" /*ticks={ticks} tickCount={ticks.length}*/ />
          <Bar dataKey="count" yAxisId={0} fill="#5566AA" />
        </BarChart>
      );
    } else if (chartTab === CHARTS.RATING_BY_RELEASE_YEAR) {
      return (
        <BarChart data={chartData.ratingAggByYear}>
          <Tooltip payload={chartData.ratingAggByYear} />
          <YAxis domain={[0, 10]} />
          <XAxis dataKey="year" />
          <Bar dataKey="avg" yAxisId={0} fill="#5566AA" />
        </BarChart>
      );
    } else if (chartTab === CHARTS.VOL_BY_DECADE) {
      return (
        <LineChart data={chartData.volumeByDecade}>
          <Tooltip payload={chartData.volumeByDecade} />
          <YAxis />
          <XAxis dataKey="decade" />
          <Line dataKey="count" yAxisId={0} dot={false} />
        </LineChart>
      );
    } else if (chartTab === CHARTS.RATING_BY_DECADE) {
      return (
        <LineChart data={chartData.ratingAggByDecade}>
          <Tooltip payload={chartData.ratingAggByDecade} />
          <YAxis domain={[0, 10]} />
          <XAxis dataKey="decade" />
          <Line dataKey="avg" yAxisId={0} dot={false} />
        </LineChart>
      );
    } else if (chartTab === CHARTS.VOL_BY_WATCHED_DATE) {
      return (
        <BarChart data={chartData.volumeByWatchDate}>
          <Tooltip />
          <YAxis />
          <XAxis dataKey="date" />
          <Bar dataKey="count" fill="#5566AA" />
          {props.watchListRanges.map((range: any) =>
            refArea(range.firstDate, range.lastDate, range.title)
          )}
        </BarChart>
      );
    } else if (chartTab === CHARTS.RATING_BY_WATCHED_DATE) {
      return (
        <BarChart data={chartData.ratingAggByWatchDate}>
          <Tooltip />
          <YAxis domain={[0, 10]} />
          <XAxis dataKey="date" />
          <Bar dataKey="avg" fill="#5566AA" />
          {props.watchListRanges.map((range: any) =>
            refArea(range.firstDate, range.lastDate, range.title)
          )}
        </BarChart>
      );
    } else if (chartTab === CHARTS.CUMULATIVE_BY_WATCHED_DATE) {
      return (
        <LineChart data={chartData.aggVolumeByWatchDate}>
          <Tooltip />
          <YAxis />
          <XAxis dataKey="date" />
          <Line dataKey="count" dot={false} />
          {props.watchListRanges.map((range: any) =>
            refArea(range.firstDate, range.lastDate, range.title)
          )}
        </LineChart>
      );
    } else if (chartTab === CHARTS.RATING_HISTOGRAM) {
      return (
        <BarChart data={chartData.ratingsHistogram}>
          <Tooltip />
          <YAxis />
          <XAxis dataKey="rating" />
          <Bar dataKey="count" fill="#5566AA" />
          {refArea(0, 2.0, "Woah..")}
          {refArea(2.5, 3.0, "Awful")}
          {refArea(3.5, 4.0, "Bad")}
          {refArea(4.5, 5.5, "Average")}
          {refArea(6.0, 6.5, "Decent")}
          {refArea(7.0, 7.5, "Good")}
          {refArea(8.0, 8.5, "Great")}
          {refArea(9.0, 10.0, "Amazing")}
        </BarChart>
      );
      // } else if (chartTab === CHARTS.RATING_HISTOGRAM_COMPARISON) {
      //   return (
      //     <LineChart data={chartData.ratingsHistogram}>
      //       <Tooltip />
      //       <YAxis />
      //       <XAxis dataKey="rating" />
      //       <Line dataKey="count" dot={false} />
      //       {refArea(0, 2.0, "Woah..")}
      //       {refArea(2.0, 3.0, "Awful")}
      //       {refArea(3.0, 4.0, "Bad")}
      //       {refArea(4.0, 5.5, "Average")}
      //       {refArea(5.5, 6.5, "Decent")}
      //       {refArea(6.5, 7.5, "Good")}
      //       {refArea(7.5, 8.5, "Great")}
      //       {refArea(8.5, 10.0, "Amazing")}
      //     </LineChart>
      //   );
    } else if (chartTab === CHARTS.RATING_DIFF_BY_ORDER) {
      return (
        <LineChart data={chartData.ratingDiffByOrder}>
          <Tooltip />
          <YAxis />
          <XAxis dataKey="order" />
          <Line dataKey="diff" dot={false} />
          {props.watchListRanges.map((range: any) =>
            refArea(range.firstID, range.lastID, range.title)
          )}
        </LineChart>
      );
    } else if (chartTab === CHARTS.WEIGHTED_RATING_DIFF_BY_ORDER) {
      return (
        <LineChart data={chartData.weightedRatingDiffByOrder}>
          <Tooltip />
          <YAxis />
          <XAxis dataKey="order" />
          <Line dataKey="diff" dot={false} />
          {props.watchListRanges.map((range: any) =>
            refArea(range.firstID, range.lastID, range.title)
          )}
        </LineChart>
      );
    }

    return <div>No chart selected</div>;
  };

  return (
    <div className="charts">
      <Tabs
        value={chartTab}
        onChange={(e, newVal) => setChartTab(newVal)}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab value={CHARTS.VOL_BY_RELEASE_YEAR} label="Vol By Release Year" />
        <Tab
          value={CHARTS.RATING_BY_RELEASE_YEAR}
          label="Rating By Release Year"
        />
        <Tab value={CHARTS.VOL_BY_DECADE} label="Volume By Decade" />
        <Tab value={CHARTS.RATING_BY_DECADE} label="Rating By Decade" />
        <Tab value={CHARTS.VOL_BY_WATCHED_DATE} label="Volume By Watch Date" />
        <Tab
          value={CHARTS.RATING_BY_WATCHED_DATE}
          label="Rating By Watch Date"
        />
        <Tab
          value={CHARTS.CUMULATIVE_BY_WATCHED_DATE}
          label="Cumulative By Watch Date"
        />
        <Tab value={CHARTS.RATING_HISTOGRAM} label="Rating Histogram" />
        <Tab value={CHARTS.RATING_DIFF_BY_ORDER} label="Rating Diff By Order" />
        <Tab
          value={CHARTS.WEIGHTED_RATING_DIFF_BY_ORDER}
          label="Weighted Diff"
        />
      </Tabs>
      <div className="chart-content">
        <ResponsiveContainer width="100%" height="100%">
          {renderSelectedChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    filteredMovies: state.movieStore?.filteredMovies,
    chartData: state.movieStore?.chartData,
    watchListRanges: state.movieStore?.watchListRanges,
  };
};

export default connect(mapStateToProps)(Charts);
