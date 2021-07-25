import { MenuItem, Select, FormControl, InputLabel, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import react from "react";
import { connect } from "react-redux";

import "./styles/Sort.scss";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

interface Props {
    sortField: string;
    sortDir: string;
    sort: (sortField: string, sortDir: string) => void;
}

const Sort = (props: Props) => {
  const classes = useStyles();

  const onChange = (event: any) => {
    props.sort(event.target.value, props.sortDir);
  }

  const onDirChange = () => {
    if(props.sortDir === 'DESC') {
      props.sort(props.sortField, 'ASC');
    }
    else {
      props.sort(props.sortField, 'DESC');
    }
  }

  return (
    <div className="sorter-container">
      <FormControl className={classes.formControl}>
        <InputLabel id="sorter-label">Sort By...</InputLabel>
        <Select labelId="sorter-label" value={props.sortField} onChange={onChange}>
          <MenuItem value="WatchedDate">Watched Date</MenuItem>
          <MenuItem value="Year">Year</MenuItem>
          <MenuItem value="Rating">Rating</MenuItem>
        </Select>
      </FormControl>
      <IconButton onClick={onDirChange}>
          {props.sortDir === 'DESC' ? <ArrowUpward /> : <ArrowDownward />}
      </IconButton>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    sortField: state.movieStore?.sortField,
    sortDir: state.movieStore?.sortDir,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    sort: (sortField: string, sortDir: string) =>
      dispatch({ type: "movies/sort", sortField, sortDir }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sort);
