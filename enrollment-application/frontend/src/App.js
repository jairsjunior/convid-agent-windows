import React from 'react';

import { useTranslation } from 'react-i18next';

import { copyTextToClipboard } from "./helpers";

import logo from './logo.png';
import logoBB from './logo-bb.png';
import iconHeart from './iconHeart.png';
import loadingIcon from './loading.gif'
import copyIcon from './copy.png';

import { Button } from "@material-ui/core";
import EnrollmentForm from "./components/EnrollmentForm";
import './App.css';

function AppModel() {

  const { t } = useTranslation()

  const [error, setError] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const [machineId, setMachineId] = React.useState("")

  const enroll = (address, accountId) => {
    setBusy(true)
    window.backend.doRegister(address, accountId).then(ret => {
      if (!ret.error) {
        setMachineId(ret.machineId)
        setError(false)
      } else {
        setMachineId("")

        if (ret["error"].indexOf("such host") !== -1 || ret["error"].indexOf("refused") !== -1) {
          setError("Unreachable host")
        } else if (ret["error"].indexOf("404") !== -1) {
          setError(t("Company not found with ID") + " " + accountId)
        } else {
          setError(ret["error"])
        }
      }
      setBusy(false)
    });
  }
  return {
    error, setError,
    busy,
    machineId,
    enroll
  }
}

function App() {

  const { t } = useTranslation()

  const {
    error, setError,
    busy,
    machineId,
    enroll
  } = AppModel()

  return (
    <div id="app" className="App">
      <div>
        <img src={logo} alt="BB" className="logo" />
      </div>
      {!busy && <>
        <div className="content-area">
          {!machineId && !error && <EnrollmentForm enroll={enroll} />}
          {machineId && <div className="machineid-area">
            <div>{t("Machine successfully registered")}</div>
            <h1>{machineId} <img src={copyIcon} alt="Copy" onClick={_ => copyTextToClipboard(machineId)} className="copy-button" title={t("Copy to clipboard")} /></h1>
            <div>{t("Take a picture or write down a note of the above code because it will be requested when remotely accessing this machine")}</div>
          </div>}
          {error && <div className="machineid-area">
            <h1>{t("Error registering")}</h1>
            <div>{t(error)}</div>
            <div style={{ marginTop: "1rem" }}><Button onClick={_ => setError(false)} variant="outlined">{t("Try again")}</Button></div>
          </div>}
        </div>
      </>}
      {busy && <>
        <div className="loading-area">
          <h1>{t("Your machine is being registered")}...</h1>
          <img src={loadingIcon} alt="Loading" className="loadingIcon" />
        </div>
      </>}
      <footer>
        {t("Handcrafted with")} <img src={iconHeart} alt="Love" className="heartIcon" /> by <img src={logoBB} alt="Banco do Brasil" className="logoFooter" />
      </footer>
    </div>
  );
}

export default App;
