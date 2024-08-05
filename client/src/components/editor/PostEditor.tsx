import { createReactEditorJS } from "react-editor-js";
// @ts-ignore
import CheckList from "@editorjs/checklist";
// @ts-ignore
import Paragraph from "@editorjs/paragraph";
import { Button } from "@material-ui/core";
import { useCallback, useRef } from "react";

interface Props {}

const PostEditor = (props: Props) => {
  const editorCore = useRef(null);

  const handleInitialize = useCallback((instance) => {
    editorCore.current = instance;
  }, []);

  const handleSave = useCallback(async () => {
    // @ts-ignore
    const savedData = await editorCore.current.save();

    console.log(savedData);
  }, []);

  const ReactEditorJS = createReactEditorJS();

  return (
    <>
      <ReactEditorJS
        // @ts-ignore
        defaultValue={[]}
        onInitialize={handleInitialize}
        tools={{ checkList: CheckList, paragraph: Paragraph }}
      />
      <Button onClick={handleSave}>Save</Button>
    </>
  );
};

export default PostEditor;
