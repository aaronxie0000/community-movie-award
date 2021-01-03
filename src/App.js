import Content from "./components/Content.js";
import { createGlobalStyle, ThemeProvider } from "styled-components";



const DefStyleChange = createGlobalStyle`
  :root {
    font-size:13px;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
  }


  * {
    margin: 0;
    padding: 0;
  }


`;

const theme = {
  mainColor: '#084E8A',
  tchColor: '#5C6AC4',
}

function App() {
  return (
    <div className="App">
      <DefStyleChange />
      <ThemeProvider theme={theme}>
        <Content></Content>
      </ThemeProvider>
    </div>
  );
}

export default App;
