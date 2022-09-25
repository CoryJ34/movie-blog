import { Filter, FilterType } from "../../../models/Filter";
import DelayedTextInput from "../../common/DelayedTextInput";

interface Props {
  applyFilter: (filter: Filter) => void;
}

const FreeTextSearch = (props: Props) => {
  const { applyFilter } = props;

  return (
    <DelayedTextInput
      onChange={(value: string) => {
        applyFilter({
          type: FilterType.FREE_TEXT,
          value,
        });
      }}
    />
  );
};

export default FreeTextSearch;
