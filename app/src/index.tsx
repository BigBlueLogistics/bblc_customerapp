import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "App";

// Context Provider
import { MaterialUIControllerProvider } from "context";

// redux store
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import configStore from "redux/store";

const { store, persistor } = configStore();
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename="/portal/">
      <PersistGate loading={null} persistor={persistor}>
        <MaterialUIControllerProvider>
          <App />
        </MaterialUIControllerProvider>
      </PersistGate>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
