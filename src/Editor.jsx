import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";

function MyEditor() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const onEditorStateChange = (editorState) => {
    console.log(convertToRaw(editorState.getCurrentContent()));

    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const key = selection.getStartKey();
    const block = contentState.getBlockForKey(key);

    console.log(block.getText());

    const newBlock = block.set("type", "header-one");
    const newContentState = contentState.merge({
      blockMap: contentState.getBlockMap().set(key, newBlock),
    });

    setEditorState(
      EditorState.push(editorState, newContentState, "change-block-type")
    );
  };

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
    />
  );
}

export default MyEditor;
