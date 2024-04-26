import React, { useEffect } from "react";
import "./index.css";
import Pages from "./Pages";
import { devtools } from "valtio/utils";
import { actions, state } from "./state";
import Loader from "./components/ui/Loader";
import { useSnapshot } from "valtio";
import { getTokenPayload } from "./util";
import SnackBar from "./components/ui/SnackBar";

devtools(state, "app state");
const App: React.FC = () => {
  const currentState = useSnapshot(state);

  useEffect(() => {
    console.log(" App use effect - check token and send it to server");
    actions.startLoading();

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      actions.stopLoading();
      return;
    }

    const { exp: tokenExp } = getTokenPayload(accessToken!);
    const currentTimeInSeconds = Date.now() / 1000;

    if (tokenExp < currentTimeInSeconds - 10) {
      localStorage.removeItem("accessToken");
      actions.stopLoading();
      return;
    }
    // reconnect to poll
    actions.setPollAccessToken(accessToken!);
    actions.initializeSocket();
  }, []);

  useEffect(() => {
    console.log("App use effect - check current participant");

    const myID = currentState.me?.id;

    if (
      myID &&
      currentState.socket?.connected &&
      !currentState.poll?.participants[myID]
    ) {
      actions.startOver();
    }
  }, [
    currentState.poll?.participants,
    currentState.me?.id,
    currentState.socket,
  ]);

  return (
    <>
      <Loader isLoading={currentState.isLoading} color="orange" width={120} />
      {currentState.wsErrors.map((error) => (
        <SnackBar
          key={error.id}
          type="error"
          title={error.type}
          message={error.message}
          show={true}
          onClose={() => actions.removeWsError(error.id)}
          autoCloseDuration={5000}
        />
      ))}
      <Pages />
    </>
  );
};

export default App;
