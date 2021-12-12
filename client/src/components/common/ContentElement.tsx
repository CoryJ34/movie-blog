import { RATING_REGEX } from "../../common/constants";

interface Props {
  content: string;
  index: number;
}

const ContentElement = (props: Props) => {
  const { content, index } = props;

  if (content.trim().match(RATING_REGEX)) {
    return null;
  }

  let cls = "content-block";
  if (content.indexOf("<") === 0) {
    cls += " complex";
  }

  return (
    <div
      className={cls}
      key={index}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default ContentElement;
