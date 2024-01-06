import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, Modifier, SelectionState } from "draft-js";
import "draft-js/dist/Draft.css";

function MyEditor() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const onEditorStateChange = (editorState) => {
    const contentState = editorState.getCurrentContent();

    const selection = editorState.getSelection();
    const key = selection.getStartKey();
    const block = contentState.getBlockForKey(key);

    const headerType = block.getText().split("# ").length === 2;
    const boldType = block.getText().split("* ").length === 2;

    if (headerType) {
      const makeHeader = block.set("type", "header-one");
      const newBlock = makeHeader.set("text", block.getText().split("# ")[1]);

      const newContentState = contentState.merge({
        blockMap: contentState.getBlockMap().set(key, newBlock),
      });

      setEditorState(
        EditorState.push(editorState, newContentState, "change-block-type")
      );
    } else if (boldType) {
      const newBlock = block.set("text", block.getText().split("* ")[1]);
      const newContentState = Modifier.applyInlineStyle(
        contentState.merge({
          blockMap: contentState.getBlockMap().set(key, newBlock),
        }),
        selection.merge({
          anchorOffset: 0,
          focusOffset: block.getLength(),
        }),
        "BOLD"
      );

      // Create a new EditorState with the modified content
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "bold-current-block"
      );

      // Update the state with the new EditorState
      setEditorState(newEditorState);
    } else {
      setEditorState(editorState);
    }
  };

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
    />
  );
}

export default MyEditor;
