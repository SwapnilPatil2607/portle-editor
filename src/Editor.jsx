import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertFromRaw, convertToRaw, EditorState, Modifier } from "draft-js";
import "draft-js/dist/Draft.css";

function MyEditor() {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem("draftContent");
    return savedContent
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
      : EditorState.createEmpty();
  });

  const onEditorStateChange = (editorState) => {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const key = selection.getStartKey();
    const block = contentState.getBlockForKey(key);

    const headerType =
      block.getText().split(" ")[0] === "#" &&
      block.getText().split(" ").length >= 2;
    const boldType =
      block.getText().split(" ")[0] === "*" &&
      block.getText().split(" ").length >= 2;
    const colorRedText =
      block.getText().split(" ")[0] === "**" &&
      block.getText().split(" ").length >= 2;
    const underline =
      block.getText().split(" ")[0] === "***" &&
      block.getText().split(" ").length >= 2;

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
      const newContentState = Modifier.applyInlineStyle(
        contentState.merge({
          blockMap: contentState.getBlockMap().set(key, block),
        }),
        selection.merge({
          anchorOffset: 0,
          focusOffset: block.getLength(),
        }),
        "BOLD"
      );

      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "bold-current-block"
      );

      setEditorState(newEditorState);
    } else if (underline) {
      const newContentState = Modifier.applyInlineStyle(
        contentState.merge({
          blockMap: contentState.getBlockMap().set(key, block),
        }),
        selection.merge({
          anchorOffset: 0,
          focusOffset: block.getLength(),
        }),
        "UNDERLINE"
      );

      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "underline-current-block"
      );

      setEditorState(newEditorState);
    } else if (colorRedText) {
      const newContentState = Modifier.applyInlineStyle(
        contentState.merge({
          blockMap: contentState.getBlockMap().set(key, block),
        }),
        selection.merge({
          anchorOffset: 0,
          focusOffset: block.getLength(),
        }),
        "COLOR_RED"
      );

      const newEditorStateWithRedText = EditorState.push(
        editorState,
        newContentState,
        "red-text-current-block"
      );

      setEditorState(newEditorStateWithRedText);
    } else {
      setEditorState(editorState);
    }
  };

  const customStyleMap = {
    COLOR_RED: {
      color: "red",
    },
  };

  const saveState = () => {
    const contentState = editorState.getCurrentContent();
    const serializedContent = JSON.stringify(convertToRaw(contentState));
    localStorage.setItem("draftContent", serializedContent);
  };

  const onClear = () => {
    setEditorState(EditorState.createEmpty());
    const contentState = editorState.getCurrentContent();
    const serializedContent = JSON.stringify(convertToRaw(contentState));
    localStorage.setItem("draftContent", serializedContent);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          padding: "10px",
        }}
      >
        <button
          onClick={() => saveState()}
          style={{ padding: "10px 40px", marginRight: "10px" }}
        >
          Save
        </button>
        <button onClick={() => onClear()} style={{ padding: "10px 40px" }}>
          Clear
        </button>
      </div>
      <Editor
        editorState={editorState}
        customStyleMap={customStyleMap}
        onEditorStateChange={onEditorStateChange}
      />
    </>
  );
}

export default MyEditor;
