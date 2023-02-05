import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useState } from "react";
import { FORMATS, LABELS, TAGS } from "../common/constants";
import "./styles/Migrater.scss";

const Migrater = () => {
  const [content, setContent] = useState("");
  const [label, setLabel] = useState("");
  const [format, setFormat] = useState("");
  const [tags, setTags] = useState("");

  return (
    <Grid container justify="center" spacing={2} className="migrater">
      <div style={{ width: "100%", padding: "20px" }}>
        <div style={{ width: "100%" }}>
          <textarea
            onChange={(e) => {
              setContent(e.target.value);
            }}
            style={{ width: "100%", height: "600px" }}
          />
        </div>
        <div>
          <Grid container spacing={2} justify="center">
            <Grid item>
              <FormControl style={{ margin: "1px", minWidth: "120px" }}>
                <InputLabel>Tags...</InputLabel>
                <Select
                  value={tags}
                  label="Tags"
                  onChange={(event: any) => setTags(event.target.value)}
                >
                  {Object.keys(TAGS)
                    .sort()
                    .map((t: string) => (
                      <MenuItem value={TAGS[t]}>{TAGS[t]}</MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl style={{ margin: "1px", minWidth: "120px" }}>
                <InputLabel>Label...</InputLabel>
                <Select
                  value={label}
                  label="Label"
                  onChange={(event: any) => setLabel(event.target.value)}
                >
                  {Object.keys(LABELS)
                    .sort()
                    .map((l: string) => (
                      <MenuItem value={LABELS[l]}>{LABELS[l]}</MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl style={{ margin: "1px", minWidth: "120px" }}>
                <InputLabel>Format...</InputLabel>
                <Select
                  value={format}
                  label="Format"
                  onChange={(event: any) => setFormat(event.target.value)}
                >
                  {Object.keys(FORMATS)
                    .sort()
                    .map((f: string) => (
                      <MenuItem value={FORMATS[f]}>{FORMATS[f]}</MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </div>
        <Button
          style={{ background: "#49A", width: "100%" }}
          onClick={() => {
            fetch("/migrate", {
              method: "POST",
              body: JSON.stringify({
                content,
                tags,
                label,
                format,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });
          }}
        >
          Migrate
        </Button>
        <Button
          style={{ background: "#49A", width: "100%" }}
          onClick={() => {
            fetch("/convert", {
              method: "POST",
              body: JSON.stringify({
                content,
                tags,
                label,
                format,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });
          }}
        >
          LBOX Convert
        </Button>
      </div>
    </Grid>
  );
};

export default Migrater;
