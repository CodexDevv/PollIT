import { FaBars, FaXmark } from 'react-icons/fa6';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';

import Logo from '../assets/logo.svg';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <nav className="relative flex items-center justify-between bg-white p-4 shadow-lg">
      <a href="/">
        <img src={Logo} alt="Logo" className="w-16" />
      </a>
      <div className="hidden items-center gap-4 sm:flex">
        <button
          onClick={() => setLoginOpen(!isLoginOpen)}
          className="text-secondary hover:text-secondary/80 text-lg font-medium"
        >
          Login
        </button>
        <button
          onClick={() => setRegisterOpen(!isRegisterOpen)}
          className="text-secondary hover:text-secondary/80 text-lg font-medium"
        >
          Register
        </button>
      </div>
      <button className="flex sm:hidden" onClick={() => setIsOpen(!isOpen)}>
        {!isOpen ? (
          <FaBars className="text-2xl" />
        ) : (
          <FaXmark className="text-2xl" />
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 top-0 mt-14 flex w-full flex-col items-end gap-2 bg-white p-4 shadow-lg sm:hidden">
          <button
            onClick={() => {
              setIsOpen(false);
              setLoginOpen(!isLoginOpen);
            }}
            className="text-secondary hover:text-secondary/80 text-lg font-medium"
          >
            Login
          </button>
          <button
            onClick={() => setRegisterOpen(!isRegisterOpen)}
            className="text-secondary hover:text-secondary/80 text-lg font-medium"
          >
            Register
          </button>
        </div>
      )}

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
            <div className="fixed inset-0 bg-black/50" />
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
                <Dialog.Panel className="bg-secondary flex w-full max-w-md transform flex-col overflow-hidden rounded-md p-6 text-left align-middle text-white shadow-xl transition-all">
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
                    onSubmit={e => e.preventDefault()}
                  >
                    <div className="flex flex-col gap-2">
                      <input
                        type="email"
                        className="focus:ring-primary appearance-none rounded-lg bg-transparent p-2 outline-none ring-2 ring-white focus:outline-none focus:ring-2"
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
                        className="focus:ring-primary appearance-none rounded-lg bg-transparent p-2 outline-none ring-2 ring-white focus:outline-none focus:ring-2"
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
                      className="focus:ring-primary focus-visible:ring-primary inline-flex justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-blue-900 outline-none hover:cursor-pointer hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50"
                      onClick={handleSubmit(onSubmit)}
                    />
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

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
            <div className="fixed inset-0 bg-black/50" />
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
                <Dialog.Panel className="bg-secondary flex w-full max-w-md transform flex-col overflow-hidden rounded-md p-6 text-left align-middle text-white shadow-xl transition-all">
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
                    onSubmit={e => e.preventDefault()}
                  >
                    <div className="flex flex-col gap-2">
                      <input
                        type="email"
                        className="focus:ring-primary appearance-none rounded-lg bg-transparent p-2 ring-2 ring-white focus:outline-none focus:ring-2"
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
                        className="focus:ring-primary appearance-none rounded-lg bg-transparent p-2 ring-2 ring-white focus:outline-none focus:ring-2"
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
                    <div className="flex flex-col gap-2">
                      <input
                        type="password"
                        className="focus:ring-primary appearance-none rounded-lg bg-transparent p-2 ring-2 ring-white focus:outline-none focus:ring-2"
                        placeholder="Confirm Password"
                        {...register('cpassword', {
                          required: 'You must confirm the password!',
                          validate: {
                            matchesPreviousPassword: value => {
                              const { password } = getValues();
                              return (
                                password === value || 'Passwords should match!'
                              );
                            },
                          },
                        })}
                      />
                      {errors.cpassword && <p>{errors.cpassword.message}</p>}
                    </div>
                    <input
                      type="submit"
                      value="Create Account"
                      className="inline-flex justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-blue-900 hover:cursor-pointer hover:bg-gray-100 focus:outline-none disabled:opacity-50"
                      onClick={handleSubmit(onSubmit)}
                    />
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </nav>
  );
};

export default Navbar;
