import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Chat from "./views/Chat";
import Register from "./views/Register";
import Login from "./views/Login";
import { Provider } from "react-redux";
import { userStore } from "./stores/user/userStore";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={userStore}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Chat />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
