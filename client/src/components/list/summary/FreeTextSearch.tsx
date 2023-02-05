import { Category } from "../../../models/Category";
import { Filter, FilterType } from "../../../models/Filter";
import DelayedTextInput from "../../common/DelayedTextInput";

interface Props {
  presetCategory?: Category;
  applyFilter: (filter: Filter) => void;
}

const FreeTextSearch = (props: Props) => {
  const { presetCategory, applyFilter } = props;

  if (presetCategory) {
    return null;
  }

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
