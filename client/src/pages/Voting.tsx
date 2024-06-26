import React, { useState } from "react";
import { useSnapshot } from "valtio";
import { actions, state } from "../state";
import RankedCheckBox from "../components/ui/RankedCheckBox";
import ConfirmationDialog from "../components/ui/ConfirmationDialog";

const Voting: React.FC = () => {
  const currentState = useSnapshot(state);
  const [rankings, setRankings] = useState<string[]>([]);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmVotes, setConfirmVotes] = useState(false);

  const toggleNomination = (id: string) => {
    const positions = rankings.findIndex((rank) => rank === id);
    const hasVotesRemaining =
      currentState.poll?.votesPerVoter || 0 - rankings.length > 0;

    if (positions < 0 && hasVotesRemaining) {
      setRankings([...rankings, id]);
    } else {
      setRankings([
        ...rankings.slice(0, positions),
        ...rankings.slice(positions + 1, rankings.length),
      ]);
    }
  };

  const getRank = (id: string) => {
    const position = rankings.findIndex((rank) => rank === id);
    return position < 0 ? undefined : position + 1;
  };

  return (
    <div className="mx-auto flex flex-col w-full justify-between items-center h-full max-w-sm">
      <div className="w-full">
        <h1 className="text-center">Voting Page</h1>
      </div>
      <div className="w-full">
        {currentState.poll && (
          <>
            <div className="text-center text-xl font-semibold mb-6">
              Select Your Top {currentState.poll?.votesPerVoter} Choices
            </div>
            <div className="text-center text-lg font-semibold mb-6 text-indigo-800">
              {currentState.poll?.votesPerVoter - rankings.length} Votes
              Reamining
            </div>
          </>
        )}
        <div className="px-2">
          {Object.entries(currentState.poll?.nominations || {}).map(
            ([id, nomination]) => (
              <RankedCheckBox
                key={id}
                value={nomination.text}
                rank={getRank(id)}
                onSelect={() => toggleNomination(id)}
              />
            )
          )}
        </div>
      </div>
      <div className="mx-auto flex flex-col items-center">
        <button
          disabled={rankings.length < (currentState.poll?.votesPerVoter ?? 100)}
          className="box btn-purple my-2 w-36"
          onClick={() => setConfirmVotes(true)}
        >
          Submit Votes
        </button>

        <ConfirmationDialog
          message="You Cannot change your vote after submitting"
          showDialog={confirmVotes}
          onCancel={() => setConfirmVotes(false)}
          onConfirm={() => actions.submitRangkings(rankings)}
        />
        {currentState.isAdmin && (
          <>
            <button
              className="box btn-orange my-2 w-36"
              onClick={() => setConfirmCancel(true)}
            >
              Cancel Poll
            </button>

            <ConfirmationDialog
              message="This will end the poll and kick everyone out"
              showDialog={confirmCancel}
              onCancel={() => setConfirmCancel(false)}
              onConfirm={() => actions.cancelPoll()}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Voting;
