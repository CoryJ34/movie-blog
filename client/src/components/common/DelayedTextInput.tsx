const DELAY_MS = 500;

interface Props {
  onChange: (value: string) => void;
}

const DelayedTextInput = (props: Props) => {
  let timeout: any = null;
  return (
    <input
      type="text"
      onChange={(e) => {
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
          props.onChange(e.target.value);
        }, DELAY_MS);
      }}
    />
  );
};

export default DelayedTextInput;
