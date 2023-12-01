/* eslint-disable react/prop-types */
import { FaXmark } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { UserContext } from '../../App';

const LoginModal = ({ isLoginOpen, setLoginOpen }) => {
  const [setUser] = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  return (
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
  );
};

export default LoginModal;
