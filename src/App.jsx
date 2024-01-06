import "./App.css";
import MyEditor from "./Editor";

function App() {
  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h5>Demo Editor By Swapnil</h5>
      </div>

      <div
        style={{
          border: "1px solid black",
          height: "500px",
          overflow: "scroll",
        }}
      >
        <MyEditor />
      </div>
    </>
  );
}

export default App;
