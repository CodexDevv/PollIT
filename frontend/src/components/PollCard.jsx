/* eslint-disable react/prop-types */
import { Fragment, useContext } from 'react';
import { PollsContext, UserContext } from '../App';
import { toast } from 'react-toastify';

const PollCard = ({ data }) => {
  const uuid = () => Math.random().toString(36).slice(-10);
  const { user } = useContext(UserContext);
  const { fetchPolls } = useContext(PollsContext);
  const isAuth = user.accesstoken !== '';

  const isCreator = user.email === data.creator;
  const hasVoted = data.votes.some(vote => vote.email === user.email);

  const voteForPoll = async () => {
    const doVote = async () => {
      const checkedOption = document.querySelector(
        `input[name="option${data._id}"]:checked`,
      ).value;
      const optionIndex = data.options.indexOf(checkedOption);
      const res = await (
        await fetch('http://localhost:5000/vote_poll', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accesstoken}`,
          },
          body: JSON.stringify({
            id: data._id,
            option: optionIndex,
            email: user.email,
          }),
        })
      ).json();
      if (res.error) console.log(res.error);
      else {
        toast.success('Successfully voted!', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
          toastId: 'success-vote',
        });
      }
    };
    doVote();
  };

  const deletePoll = async () => {
    const doDelete = async () => {
      const res = await (
        await fetch('http://localhost:5000/delete_poll', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accesstoken}`,
          },
          body: JSON.stringify({
            id: data._id,
          }),
        })
      ).json();
      if (res.error) console.log(res.error);
      else {
        await fetchPolls();
        toast.info('Deleted!', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
          toastId: 'success-delete',
        });
      }
    };
    doDelete();
  };

  return (
    <div className="flex min-h-[22rem] flex-col gap-4 rounded-md bg-white p-4 text-black shadow lg:p-6">
      <h1 className="font-semibold lg:text-lg">{data.question}</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          voteForPoll();
        }}
        className="flex h-full flex-col justify-between"
      >
        <div className="flex flex-col items-start justify-center gap-4">
          {data.options.map((option, i) => (
            <Fragment key={i}>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  id={uuid()}
                  name={`option${data._id}`}
                  value={option}
                  className="h-5 w-5 border-gray-300 bg-gray-100 text-blue-600 focus:outline-none"
                  defaultChecked={i === 0}
                />
                {option}
              </label>
            </Fragment>
          ))}
        </div>
        {isAuth && !hasVoted && !isCreator && (
          <button
            type="submit"
            className="inline-flex w-1/4 justify-center self-end rounded-md border border-transparent bg-secondary px-4 py-2 text-sm font-medium text-white hover:cursor-pointer hover:bg-secondary/80 disabled:opacity-50 sm:w-1/5"
          >
            Vote
          </button>
        )}
        {isAuth && hasVoted && (
          <p className="self-end text-sm font-medium text-gray-500">
            You have already voted
          </p>
        )}
        {isAuth && isCreator && (
          <button
            onClick={e => {
              e.preventDefault();
              deletePoll();
            }}
            className="inline-flex w-1/3 justify-center self-start rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:cursor-pointer hover:bg-red-600/80 disabled:opacity-50"
          >
            Delete Poll
          </button>
        )}
      </form>
    </div>
  );
};

export default PollCard;
