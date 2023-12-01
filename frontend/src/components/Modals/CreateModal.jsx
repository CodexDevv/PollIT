/* eslint-disable react/prop-types */
import { FaPlus, FaXmark } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useContext, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { UserContext, PollsContext } from '../../App';

const CreateModal = ({ isPostOpen, setPostOpen }) => {
  const { register, handleSubmit, resetField, control } = useForm();
  const { user } = useContext(UserContext);
  const { fetchPolls } = useContext(PollsContext);

  useFieldArray({
    control,
    name: 'options',
  });

  const [options, setOptions] = useState([0, 1]);

  const handleAddOption = () => {
    setOptions([...options, options.length + 1]);
  };

  const handleDeleteOption = id => {
    const newOptions = options.filter(option => option !== id);
    resetField(`options.${id}`);
    setOptions(newOptions);
  };

  const createPoll = data => {
    async function doCreatePoll() {
      let newOptions = options.map(option => data.options[option]);
      const res = await (
        await fetch('http://localhost:5000/create_poll', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({
            question: data.question,
            pollType: data.votingtype,
            options: newOptions,
            email: user.email,
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accesstoken}`,
          },
        })
      ).json();

      if (res.error) {
        console.error(res.error);
        toast.error(JSON.stringify(res.error).replaceAll('"', ''), {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
        });
      } else {
        setPostOpen(false);
        // window.location.reload();
        toast.success('Post created!', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          toastId: 'success-create',
        });
        fetchPolls();
      }
    }
    doCreatePoll();
  };

  return (
    <Transition appear show={isPostOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setPostOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-scroll">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex w-full max-w-lg transform flex-col overflow-hidden rounded-md bg-secondary p-6 text-left align-middle text-white shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="mb-8 flex items-center justify-between text-center text-3xl font-semibold leading-6"
                >
                  <p>Create a poll</p>
                  <button
                    onClick={() => setPostOpen(false)}
                    className="hover:cursor-pointer"
                  >
                    <FaXmark />
                  </button>
                </Dialog.Title>
                <form
                  onSubmit={handleSubmit(createPoll)}
                  className="flex flex-col gap-8"
                >
                  <div className="flex flex-col gap-2">
                    <p>Question</p>
                    <input
                      type="text"
                      className="w-full rounded rounded-t-none border-t-4 border-primary bg-white/40 p-2 text-white placeholder-white/80 outline-none transition-all focus:border-primary focus:ring-0"
                      placeholder="Type your question here"
                      {...register('question')}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <p className="-mb-2">Voting Type</p>
                    <label className="flex items-center gap-2">
                      <input
                        className="h-5 w-5 border-gray-300 bg-gray-100 text-blue-600"
                        id="single"
                        type="radio"
                        name="votingtype"
                        value="single"
                        {...register('votingtype')}
                        defaultChecked
                      />
                      Single Choice
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        className="h-5 w-5 border-gray-300 bg-gray-100 text-blue-600"
                        id="multiple"
                        type="radio"
                        name="votingtype"
                        value="multiple"
                        {...register('votingtype')}
                      />
                      Multiple Choice
                    </label>
                  </div>
                  <div className="flex flex-col gap-4">
                    <p className="-mb-2">Answer Options</p>
                    {options.map((option, i) => (
                      <div
                        key={i}
                        className="flex w-full items-center justify-between rounded rounded-t-none border-t-4 border-primary bg-white/40 p-2 text-white outline-none transition-all focus:border-primary focus:ring-0"
                      >
                        <input
                          type="text"
                          className="w-full border-none bg-transparent placeholder-white/80 outline-none"
                          placeholder={`Option ${i + 1}`}
                          {...register(`options.${option}`)}
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteOption(option)}
                          disabled={options.length <= 2}
                        >
                          <FaXmark />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={e => {
                        e.preventDefault();
                        handleAddOption();
                      }}
                      disabled={options.length == 8}
                      className="flex w-1/3 items-center justify-center gap-2 rounded-md border border-transparent bg-white/50 px-4 py-2 text-sm font-medium text-white hover:cursor-pointer hover:bg-white/40 focus:rounded-md disabled:opacity-50"
                    >
                      <FaPlus />
                      <span>Add option</span>
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-blue-900 hover:cursor-pointer hover:bg-gray-100 focus:rounded-md disabled:opacity-50"
                  >
                    Create Poll
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateModal;
