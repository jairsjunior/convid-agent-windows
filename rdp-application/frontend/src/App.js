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
  const [machineInfo, setMachineInfo] = React.useState("")

  const enroll = (address, machineID) => {
    setBusy(true)
    window.backend.doRegister(address, machineID).then(ret => {
      if (!ret.error) {
        setMachineInfo(ret)
        setError(false)
      } else {
        setMachineInfo(null)
        if (ret["error"].indexOf("such host") !== -1 || ret["error"].indexOf("refused") !== -1) {
          setError("Unreachable host")
        } else if (ret["error"].indexOf("404") !== -1) {
          setError(t("Machine not found with ID") + " " + machineID)
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
    machineInfo,
    enroll
  }
}

function App() {

  const { t } = useTranslation()

  const {
    error, setError,
    busy,
    machineInfo,
    enroll
  } = AppModel()

  const remoteMachineAddress = machineInfo ? "127.0.0.1:" + machineInfo.tunnelPort : ""

  return (
    <div id="app" className="App">
      <div>
        <img src={logo} alt="BB" className="logo" />
      </div>
      {!busy && <>
        <div className="content-area">
          {!machineInfo && !error && <EnrollmentForm enroll={enroll} />}
          {machineInfo && <div className="machineid-area">
            <div>{t("Successfully connected")}</div>
            <h1>{remoteMachineAddress} <img src={copyIcon} alt="Copy" onClick={_ => copyTextToClipboard(remoteMachineAddress)} className="copy-button" title={t("Copy to clipboard")} /></h1>
            <div>{t("Open your Remote Desktop Application and use the following address to connect")}: {remoteMachineAddress}</div>
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
          <h1>{t("Connecting to RDP gateway")}...</h1>
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
