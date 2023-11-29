import { FaBars, FaPlus, FaXmark } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useContext, useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { UserContext } from '../App';

import Logo from '../assets/logo.svg';

const Navbar = () => {
  const [user, setUser] = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isPostOpen, setPostOpen] = useState(false);

  const [isAuth, setIsAuth] = useState(user.accesstoken !== '');

  const {
    register,
    handleSubmit,
    resetField,
    getValues,
    control,
    formState: { errors },
  } = useForm();

  useFieldArray({
    control,
    name: 'options',
  });

  const [options, setOptions] = useState([0]);

  const handleAddOption = () => {
    setOptions([...options, options.length + 1]);
  };

  const handleDeleteOption = id => {
    const newOptions = options.filter(option => option !== id);
    resetField(`options.${id}`);
    setOptions(newOptions);
  };

  const onSubmitRegister = data => {
    async function doRegister() {
      const res = await (
        await fetch('http://localhost:5000/register', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ).json();
      if (!res.error) {
        // window.location.reload();
        toast.success('Account created!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
        });
        setRegisterOpen(false);
      } else {
        console.error(res.error);
        toast.error(JSON.stringify(res.error).replaceAll('"', ''), {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
        });
      }
    }
    doRegister();
  };

  const onSubmitLogin = data => {
    async function doLogin() {
      const res = await (
        await fetch('http://localhost:5000/login', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ).json();
      if (res.accesstoken) {
        setUser({
          accesstoken: res.accesstoken,
          email: res.email,
        });
        setLoginOpen(false);
        toast.success('Logged in!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
        });
        // window.location.reload();
      } else {
        console.error(res.message);
        toast.error(JSON.stringify(res.message).replaceAll('"', ''), {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
        });
      }
    }
    doLogin();
  };

  const logoutCallback = async () => {
    await fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser({});
    window.location.reload();
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
          position: 'top-right',
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
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
    }
    doCreatePoll();
  };

  useEffect(() => {
    setIsAuth(user.accesstoken !== '');
  }, [user]);

  return (
    <nav className="relative flex items-center justify-between bg-white p-4 shadow-lg">
      <a href="/">
        <img src={Logo} alt="Logo" className="w-16" />
      </a>
      {!isAuth && (
        <div className="hidden items-center gap-4 sm:flex">
          <button
            onClick={() => setLoginOpen(!isLoginOpen)}
            className="text-lg font-medium text-secondary hover:text-secondary/80"
          >
            Login
          </button>
          <button
            onClick={() => setRegisterOpen(!isRegisterOpen)}
            className="text-lg font-medium text-secondary hover:text-secondary/80"
          >
            Register
          </button>
        </div>
      )}
      {isAuth && (
        <div className="hidden items-center gap-4 sm:flex">
          <button
            onClick={() => setPostOpen(true)}
            className="text-lg font-medium text-secondary hover:text-secondary/80"
          >
            Post
          </button>
          <button
            onClick={logoutCallback}
            className="text-lg font-medium text-secondary hover:text-secondary/80"
          >
            Log Out
          </button>
        </div>
      )}

      <button className="flex sm:hidden" onClick={() => setIsOpen(!isOpen)}>
        {!isOpen ? (
          <FaBars className="text-2xl" />
        ) : (
          <FaXmark className="text-2xl" />
        )}
      </button>
      {isOpen && !isAuth && (
        <div className="absolute right-0 top-0 mt-14 flex w-full flex-col items-end gap-2 bg-white p-4 shadow-lg sm:hidden">
          <button
            onClick={() => {
              setIsOpen(false);
              setLoginOpen(!isLoginOpen);
            }}
            className="text-lg font-medium text-secondary hover:text-secondary/80"
          >
            Login
          </button>
          <button
            onClick={() => setRegisterOpen(!isRegisterOpen)}
            className="text-lg font-medium text-secondary hover:text-secondary/80"
          >
            Register
          </button>
        </div>
      )}

      {isOpen && isAuth && (
        <div className="absolute right-0 top-0 mt-14 flex w-full flex-col items-end gap-2 bg-white p-4 shadow-lg sm:hidden">
          <button
            onClick={() => {
              setIsOpen(false);
              setPostOpen(true);
            }}
            className="text-lg font-medium text-secondary hover:text-secondary/80"
          >
            Post
          </button>
          <button
            onClick={logoutCallback}
            className="text-lg font-medium text-secondary hover:text-secondary/80"
          >
            Log Out
          </button>
        </div>
      )}

      {isLoginOpen && (
        <Transition appear show={isLoginOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setLoginOpen(false)}
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

            <div className="fixed inset-0 overflow-y-auto">
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
                  <Dialog.Panel className="flex w-full max-w-md transform flex-col overflow-hidden rounded-md bg-secondary p-6 text-left align-middle text-white shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="mb-8 flex items-center justify-between text-center text-3xl font-semibold leading-6"
                    >
                      <p>Login</p>
                      <button onClick={() => setLoginOpen(false)}>
                        <FaXmark />
                      </button>
                    </Dialog.Title>

                    <form
                      className="flex flex-col gap-8"
                      autoComplete="off"
                      onSubmit={handleSubmit(onSubmitLogin)}
                    >
                      <div className="flex flex-col gap-2">
                        <input
                          type="email"
                          className="appearance-none rounded-lg bg-transparent p-2 outline-none ring-2 ring-white  focus:ring-2 focus:ring-primary"
                          placeholder="Email address"
                          {...register('email', {
                            required: 'You must provide the email address!',
                            pattern: {
                              value:
                                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                              message: 'Please enter a valid email',
                            },
                          })}
                        />
                        {errors.email ? <p>{errors.email.message}</p> : null}
                      </div>
                      <div className="flex flex-col gap-2">
                        <input
                          type="password"
                          className="appearance-none rounded-lg bg-transparent p-2 outline-none ring-2 ring-white  focus:ring-2 focus:ring-primary"
                          placeholder="Password"
                          {...register('password', {
                            required: 'You must provide a password!',
                            pattern: {
                              value:
                                /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{8,})$/,
                              message:
                                'The password must contain 8 characters, at least one uppercase letter, one lowercase letter and one number',
                            },
                          })}
                        />
                        {errors.password && <p>{errors.password.message}</p>}
                      </div>
                      <input
                        type="submit"
                        value="Login"
                        className="inline-flex justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-blue-900 hover:cursor-pointer hover:bg-gray-100 disabled:opacity-50"
                      />
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}

      {isRegisterOpen && (
        <Transition appear show={isRegisterOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setRegisterOpen(false)}
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

            <div className="fixed inset-0 overflow-y-auto">
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
                  <Dialog.Panel className="flex w-full max-w-md transform flex-col overflow-hidden rounded-md bg-secondary p-6 text-left align-middle text-white shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="mb-8 flex items-center justify-between text-center text-3xl font-semibold leading-6"
                    >
                      <p>Register</p>
                      <button onClick={() => setRegisterOpen(false)}>
                        <FaXmark />
                      </button>
                    </Dialog.Title>

                    <form
                      className="flex flex-col gap-8"
                      autoComplete="off"
                      onSubmit={handleSubmit(onSubmitRegister)}
                    >
                      <div className="flex flex-col gap-2">
                        <input
                          type="email"
                          className="appearance-none rounded-lg bg-transparent p-2 ring-2 ring-white  focus:ring-2 focus:ring-primary"
                          placeholder="Email address"
                          {...register('email', {
                            required: 'You must provide the email address!',
                            pattern: {
                              value:
                                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                              message: 'Please enter a valid email',
                            },
                          })}
                        />
                        {errors.email ? <p>{errors.email.message}</p> : null}
                      </div>
                      <div className="flex flex-col gap-2">
                        <input
                          type="password"
                          className="appearance-none rounded-lg bg-transparent p-2 ring-2 ring-white  focus:ring-2 focus:ring-primary"
                          placeholder="Password"
                          {...register('password', {
                            required: 'You must provide a password!',
                            pattern: {
                              value:
                                /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{8,})$/,
                              message:
                                'The password must contain 8 characters, at least one uppercase letter, one lowercase letter and one number',
                            },
                          })}
                        />
                        {errors.password && <p>{errors.password.message}</p>}
                      </div>
                      {isRegisterOpen && (
                        <div className="flex flex-col gap-2">
                          <input
                            type="password"
                            className="appearance-none rounded-lg bg-transparent p-2 ring-2 ring-white  focus:ring-2 focus:ring-primary"
                            placeholder="Confirm Password"
                            {...register('cpassword', {
                              required:
                                isRegisterOpen &&
                                'You must confirm the password!',
                              validate: {
                                matchesPreviousPassword: value => {
                                  const { password } = getValues();
                                  return (
                                    password === value ||
                                    'Passwords should match!'
                                  );
                                },
                              },
                            })}
                          />
                          {errors.cpassword && (
                            <p>{errors.cpassword.message}</p>
                          )}
                        </div>
                      )}

                      <input
                        type="submit"
                        value="Create Account"
                        className="inline-flex justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-blue-900 hover:cursor-pointer hover:bg-gray-100 disabled:opacity-50"
                      />
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}

      {isPostOpen && (
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
                      {/* TODO: Add option to remove option */}
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
                              disabled={options.length == 1}
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
      )}
    </nav>
  );
};

export default Navbar;
