import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminPanel from "./admin";
import Login from "./login";
import { useSelector, useDispatch } from "react-redux";
import {
  login,
  setRole,
  isInsuranceCompany,
  isAppraisalCompany,
} from "./redux/reducer";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  let token = JSON.parse(
    localStorage.getItem("admin-panel-token-insure-x") ?? "{}"
  );

  React.useEffect(() => {
    const ClearTimeOut = () =>
      setInterval(() => {
        console.clear();
      }, 3000);
    return clearInterval(ClearTimeOut());
  }, []);

  React.useInsertionEffect(() => {
    if (!user?.auth) {
      if (token?.auth) {
        dispatch(login(token?.auth));
        dispatch(setRole(token?.role));
        dispatch(isInsuranceCompany(token?.insurance_company));
        dispatch(isAppraisalCompany(token?.appraisal_company));
      }
    }
  }, [user?.auth, token]);
  return (
    <Routes>
      {user?.auth ? (
        <Route path="/*" element={<AdminPanel />} />
      ) : (
        <Route path="/*" element={<Login />} />
      )}
    </Routes>
  );
}

export default App;
