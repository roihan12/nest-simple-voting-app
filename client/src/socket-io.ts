import { io } from "socket.io-client";
import { AppActions, AppState } from "./state";

export const socketIOUrl = `http://${import.meta.env.VITE_API_HOST}:${
  import.meta.env.VITE_API_PORT
}/${import.meta.env.VITE_POLLS_NAMESPACE}`;
export const socketIOUrlQuiz = `http://${import.meta.env.VITE_API_HOST}:${
  import.meta.env.VITE_API_PORT
}/${import.meta.env.VITE_QUIZS_NAMESPACE}`;

type CreateSocketOptions = {
  socketIOUrl: string;
  state: AppState;
  actions: AppActions;
};

export const createSocketWithHandlers = ({
  socketIOUrl,
  state,
  actions,
}: CreateSocketOptions) => {
  console.log(`Creating socket with access token ${state.accessToken}`);

  const socket = io(socketIOUrl, {
    auth: {
      token: state.accessToken,
    },
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log(
      `Connected to socket ID: ${socket.id} userID: ${state.me?.id} will join room: ${state.poll?.id}`
    );
    actions.stopLoading();
  });

  socket.on("connect_error", () => {
    console.log(`Failed to connect to socket ID: ${socket.id}`);
    actions.addWsError({
      type: "Connection error",
      message: "Failed to connect to the poll",
    });
    actions.stopLoading();
  });

  socket.on("exception", (error) => {
    console.log(`Exception: ${JSON.stringify(error)}`);
    actions.addWsError(error);
  });

  socket.on("poll_updated", (poll) => {
    console.log(`event: poll_updated, payload: ${JSON.stringify(poll)}`);
    actions.updatedPoll(poll);
  });

  socket.on("quiz_updated", (quiz) => {
    console.log(`event: poll_updated, payload: ${JSON.stringify(quiz)}`);
    actions.updatedQuiz(quiz);
  });

  return socket;
};

type CreateSocketQuizOptions = {
  socketIOUrlQuiz: string;
  state: AppState;
  actions: AppActions;
};

export const createSocketQuizWithHandlers = ({
  socketIOUrlQuiz,
  state,
  actions,
}: CreateSocketQuizOptions) => {
  console.log(`Creating socket with access token ${state.accessToken}`);

  const socket = io(socketIOUrlQuiz, {
    auth: {
      token: state.accessQuizToken,
    },
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log(
      `Connected to socket ID: ${socket.id} userID: ${state.me?.id} will join room: ${state.quiz?.id}`
    );
    actions.stopLoading();
  });

  socket.on("connect_error", () => {
    console.log(`Failed to connect to socket ID: ${socket.id}`);
    actions.addWsError({
      type: "Connection error",
      message: "Failed to connect to the quiz",
    });
    actions.stopLoading();
  });

  socket.on("exception", (error) => {
    console.log(`Exception: ${JSON.stringify(error)}`);
    actions.addWsError(error);
  });

  socket.on("quiz_updated", (quiz) => {
    console.log(`event: quiz_updated, payload: ${JSON.stringify(quiz)}`);
    actions.updatedQuiz(quiz);
  });

  return socket;
};
