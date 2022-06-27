import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "App";

// Context Provider
import { MaterialUIControllerProvider } from "context";

// redux store
import { Provider } from "react-redux";
import store from "redux/store";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <MaterialUIControllerProvider>
        <App />
      </MaterialUIControllerProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
