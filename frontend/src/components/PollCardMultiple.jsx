import { Fragment, useContext } from 'react';
import { UserContext } from '../App';

const PollCardMultiple = () => {
  const uuid = () => Math.random().toString(36).slice(-10);
  const [user] = useContext(UserContext);
  const isAuth = user.accesstoken !== '';

  return (
    <div className="flex min-h-[22rem] flex-col gap-4 rounded-md bg-white p-4 text-black shadow lg:p-6">
      <h1 className="font-semibold lg:text-lg">
        Lorem ipsum dolor sit amet consectetur adipisicing?
      </h1>
      <form className="flex h-full flex-col justify-between">
        <div className="flex flex-col items-start justify-center gap-4">
          {[...Array(4)].map((_, i) => (
            <Fragment key={i}>
              <label className="flex items-center gap-2">
                <input
                  className="h-5 w-5 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 "
                  id={uuid()}
                  type="checkbox"
                  name="option"
                  value={`option${i + 1}`}
                  defaultChecked={i === 0}
                />
                Option {i + 1}
              </label>
            </Fragment>
          ))}
        </div>
        {isAuth && (
          <button className="inline-flex w-1/4 justify-center self-end rounded-md border border-transparent bg-secondary px-4 py-2 text-sm font-medium text-white hover:cursor-pointer hover:bg-secondary/80 disabled:opacity-50 sm:w-1/5">
            Vote
          </button>
        )}
      </form>
    </div>
  );
};

export default PollCardMultiple;
