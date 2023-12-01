/* eslint-disable react/prop-types */
import { FaXmark } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';

const RegisterModal = ({ isRegisterOpen, setRegisterOpen }) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

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
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
          toastId: 'success-register',
        });
        setRegisterOpen(false);
      } else {
        console.error(res.error);
        toast.error(JSON.stringify(res.error).replaceAll('"', ''), {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
          toastId: 'error-register',
        });
      }
    }
    doRegister();
  };

  return (
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
                            isRegisterOpen && 'You must confirm the password!',
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
  );
};

export default RegisterModal;
