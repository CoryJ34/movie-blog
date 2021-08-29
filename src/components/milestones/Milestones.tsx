import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@material-ui/core";
import { connect } from "react-redux";
import { Milestone } from "../../models/Milestone";
import ContentElement from "../common/ContentElement";

import "./styles/Milestones.scss";

interface Props {
  milestones: Milestone[];
}

const Milestones = (props: Props) => {
  const { milestones } = props;

  if (!milestones) {
    return <div>Loading...</div>;
  }

  const renderMilestone = (milestone: Milestone) => {
    return (
      <Accordion className="milestone">
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          {/* <Typography> */}
          <div className="header">
            <div className="title">{milestone.title}</div>
            <div className="date">{milestone.date}</div>
          </div>
          {/* </Typography> */}
        </AccordionSummary>
        <AccordionDetails>
          <div className="content">
            {milestone.content.map((c, i) => (
              <ContentElement content={c} index={i} />
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    );
  };

  return <div className="milestones">{milestones.map(renderMilestone)}</div>;
};

const mapStateToProps = (state: any) => {
  return {
    milestones: state.movieStore?.milestones,
  };
};

export default connect(mapStateToProps)(Milestones);
