import { Dialog } from "@material-ui/core";
import { useState } from "react";
import { Remark, Remarks } from "../../../models/Category";

interface Props {
  meta?: Remarks;
}

const ListRemarks = (props: Props) => {
  const { meta } = props;

  const [currentRemark, setCurrentRemark] = useState<Remark | undefined>(
    undefined
  );

  if (!meta) {
    return null;
  }

  return (
    <>
      <span className="remarks">
        {meta.opening && (
          <a
            onClick={() => setCurrentRemark(meta.opening)}
            className="remark-link"
          >
            Opening Comments
          </a>
        )}
        {meta.closing && (
          <a
            onClick={() => setCurrentRemark(meta.closing)}
            className="remark-link"
          >
            Closing Comments
          </a>
        )}
      </span>
      <Dialog
        open={!!currentRemark}
        onClose={() => setCurrentRemark(undefined)}
      >
        <div className="list-remark">
          {(currentRemark?.content || []).map((c: string) => (
            <div dangerouslySetInnerHTML={{ __html: c }} />
          ))}
        </div>
      </Dialog>
    </>
  );
};

export default ListRemarks;
