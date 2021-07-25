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
};

interface RefLabelProps {
  text: string;
  x: number;
  y: number;
}

const customLabel = (props: RefLabelProps) => {
  return (
    <g>
      <foreignObject x={props.x} y={props.y} width={100} height={100}>
        <div>Label</div>
      </foreignObject>
    </g>
  );
};

const Charts = (props: Props) => {
  const [chartTab, setChartTab] = useState(CHARTS.VOL_BY_RELEASE_YEAR);

  if (!props.chartData) {
    return null;
  }

  const { chartData } = props;
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

  const renderSelectedChart = () => {
    if (chartTab === CHARTS.VOL_BY_RELEASE_YEAR) {
      return (
        <BarChart data={chartData.volumeByYear} width={1400} height={200}>
          <Tooltip payload={chartData.volumeByYear} />
          <YAxis />
          <XAxis dataKey="year" /*ticks={ticks} tickCount={ticks.length}*/ />
          <Bar dataKey="count" yAxisId={0} fill="#5566AA" />
        </BarChart>
      );
    } else if (chartTab === CHARTS.RATING_BY_RELEASE_YEAR) {
      return (
        <BarChart data={chartData.ratingAggByYear} width={1400} height={200}>
          <Tooltip payload={chartData.ratingAggByYear} />
          <YAxis domain={[0, 10]} />
          <XAxis dataKey="year" />
          <Bar dataKey="avg" yAxisId={0} fill="#5566AA" />
        </BarChart>
      );
    } else if (chartTab === CHARTS.VOL_BY_DECADE) {
      return (
        <LineChart data={chartData.volumeByDecade} width={1400} height={200}>
          <Tooltip payload={chartData.volumeByDecade} />
          <YAxis />
          <XAxis dataKey="decade" />
          <Line dataKey="count" yAxisId={0} dot={false} />
        </LineChart>
      );
    } else if (chartTab === CHARTS.RATING_BY_DECADE) {
      return (
        <LineChart data={chartData.ratingAggByDecade} width={1400} height={200}>
          <Tooltip payload={chartData.ratingAggByDecade} />
          <YAxis domain={[0, 10]} />
          <XAxis dataKey="decade" />
          <Line dataKey="avg" yAxisId={0} dot={false} />
        </LineChart>
      );
    } else if (chartTab === CHARTS.VOL_BY_WATCHED_DATE) {
      return (
        <BarChart data={chartData.volumeByWatchDate} width={1400} height={200}>
          <Tooltip />
          <YAxis />
          <XAxis dataKey="date" />
          <Bar dataKey="count" fill="#5566AA" />
          {props.watchListRanges.map((range: any) => (
            <ReferenceArea
              x1={range.firstDate}
              x2={range.lastDate}
              y1={0}
              stroke="#CCEE99"
              opacity={0.2}
              label={range.title}
            />
          ))}
        </BarChart>
      );
    } else if (chartTab === CHARTS.RATING_BY_WATCHED_DATE) {
      return (
        <BarChart
          data={chartData.ratingAggByWatchDate}
          width={1400}
          height={200}
        >
          <Tooltip />
          <YAxis domain={[0, 10]} />
          <XAxis dataKey="date" />
          <Bar dataKey="avg" fill="#5566AA" />
          {props.watchListRanges.map((range: any) => (
            <ReferenceArea
              x1={range.firstDate}
              x2={range.lastDate}
              y1={0}
              stroke="#CCEE99"
              opacity={0.2}
              label={range.title}
            />
          ))}
        </BarChart>
      );
    } else if (chartTab === CHARTS.CUMULATIVE_BY_WATCHED_DATE) {
      return (
        <LineChart
          data={chartData.aggVolumeByWatchDate}
          width={1400}
          height={200}
        >
          <Tooltip />
          <YAxis />
          <XAxis dataKey="date" />
          <Line dataKey="count" dot={false} />
          {props.watchListRanges.map((range: any) => (
            <ReferenceArea
              x1={range.firstDate}
              x2={range.lastDate}
              y1={0}
              stroke="#CCEE99"
              opacity={0.2}
              label={range.title}
            />
          ))}
        </LineChart>
      );
    } else if (chartTab === CHARTS.RATING_HISTOGRAM) {
      return (
        <BarChart data={chartData.ratingsHistogram} width={1400} height={200}>
          <Tooltip />
          <YAxis />
          <XAxis dataKey="rating" />
          <Bar dataKey="count" fill="#5566AA" />
          <ReferenceArea
            x1={0}
            x2={2.0}
            y1={0}
            stroke="#CCEE99"
            opacity={0.2}
            label="Woah.."
          />
          <ReferenceArea
            x1={2.5}
            x2={3.0}
            y1={0}
            stroke="#CCEE99"
            opacity={0.2}
            label="Awful"
          />
          <ReferenceArea
            x1={3.5}
            x2={4.0}
            y1={0}
            stroke="#CCEE99"
            opacity={0.2}
            label="Bad"
          />
          <ReferenceArea
            x1={4.5}
            x2={5.5}
            y1={0}
            stroke="#CCEE99"
            opacity={0.2}
            label="Average"
          />
          <ReferenceArea
            x1={6.0}
            x2={6.5}
            y1={0}
            stroke="#CCEE99"
            opacity={0.2}
            label="Decent"
          />
          <ReferenceArea
            x1={7.0}
            x2={7.5}
            y1={0}
            stroke="#CCEE99"
            opacity={0.2}
            label="Good"
          />
          <ReferenceArea
            x1={8.0}
            x2={8.5}
            y1={0}
            stroke="#CCEE99"
            opacity={0.2}
            label="Great"
          />
          <ReferenceArea
            x1={9.0}
            x2={10.0}
            y1={0}
            stroke="#99EEAA"
            opacity={0.2}
            label={"Amazing"}
          />
        </BarChart>
      );
    }
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
      </Tabs>
      <div className="chart-content">{renderSelectedChart()}</div>
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
