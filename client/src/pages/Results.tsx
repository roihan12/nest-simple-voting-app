import React, { useState } from "react";
import { useSnapshot } from "valtio";
import { actions, state } from "../state";
import ResultCard from "../components/ui/ResultCard";
import ConfirmationDialog from "../components/ui/ConfirmationDialog";

const Results: React.FC = () => {
  const { poll, isAdmin, participantCount, rangkingCount } = useSnapshot(state);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);

  return (
    <>
      <div className="mx-auto flex flex-col w-full justify-between items-center h-full max-w-sm">
        <div className="w-full">
          <h1 className="text-center mt-12 mb-4">Results</h1>
          {poll?.results.length ? (
            <ResultCard results={poll?.results} />
          ) : (
            <p className="text-center text-xl">
              <span className="text-orange-600">{rangkingCount}</span> of
              <span className="text-purple-600">{participantCount}</span>{" "}
              participant have votes
            </p>
          )}
        </div>
        <div className="flex flex-col justify-center">
          {isAdmin && !poll?.results.length && (
            <>
              <button
                className="box btn-orange my-2"
                onClick={() => setIsConfirmationOpen(true)}
              >
                End Poll
              </button>
            </>
          )}
          {!isAdmin && !poll?.results.length && (
            <div className="my-2 italic">
              {" "}
              Waiting for admin,{" "}
              <span className="font-semibold">
                {poll?.participants[poll?.adminID]}
              </span>
              , to finalize the poll
            </div>
          )}
          {!!poll?.results.length && (
            <button
              className="box btn-purple my-2"
              onClick={() => setIsLeaveOpen(true)}
            >
              Leave Poll
            </button>
          )}
        </div>
      </div>

      {isAdmin && (
        <ConfirmationDialog
          message="Are you sure you want to end the poll and calculate the results?"
          showDialog={isConfirmationOpen}
          onCancel={() => setIsConfirmationOpen(false)}
          onConfirm={() => {
            actions.closePoll();
            setIsConfirmationOpen(false);
          }}
        />
      )}
      {isLeaveOpen && (
        <ConfirmationDialog
          message="You will be kicked out of the poll"
          showDialog={isLeaveOpen}
          onCancel={() => setIsLeaveOpen(false)}
          onConfirm={() => actions.startOver()}
        />
      )}
    </>
  );
};

export default Results;
