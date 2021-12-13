import { Button, Grid } from "@material-ui/core";
import { useState } from "react";

const Migrater = () => {
  const [content, setContent] = useState("");

  return (
    <Grid container justify="center" spacing={2}>
      <div style={{ padding: "20px" }}>
        <div>
          <textarea
            onChange={(e) => {
              setContent(e.target.value);
            }}
            style={{ width: "400px", height: "600px" }}
          />
        </div>
        <Button
          style={{ background: "#49A", width: "406px" }}
          onClick={() => {
            fetch("/migrate", {
              method: "POST",
              body: JSON.stringify({
                content,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });
          }}
        >
          Migrate
        </Button>
      </div>
    </Grid>
  );
};

export default Migrater;
