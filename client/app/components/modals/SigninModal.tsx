'use client';

import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useCallback, useState } from 'react';
import Modal from './Modal';
import Input from '../inputs/Input';
import { toast } from 'react-hot-toast';
import Button from '../Button';
import Heading from './Heading';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import useSignupModal from '@/app/hooks/useSignupModal';
import useSigninModal from '@/app/hooks/useSigninModal';
import axios from 'axios';

interface BackendError {
    field: string;
    message: string;
}

const SigninModal = () => {
    const signupModal = useSignupModal();
    const signinModal = useSigninModal();
    const [isLoading, setIsLoading] = useState(false);
    const [backendErrors, setBackendErrors] = useState<BackendError[]>([]);

    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: { email: '', password: '' },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        // signIn('credentials', { ...data, redirect: false })
        //     .then((callback) => {
        //         setIsLoading(false);

        //         if (callback?.error) {
        //             toast.error(callback.error);
        //         }

        //         if (callback?.ok && !callback.error) {
        //             toast.success('Logged in');

        //             signinModal.onClose();
        //             router.refresh();
        //         }
        //     })
        //     .catch((error) => {
        //         setBackendErrors(error.response.data.errors);
        //     })
        //     .finally(() => setIsLoading(false));

        axios
            .post('/api/users/signin', data)
            .then((response) => {
                toast.success('Logged in!');
                signinModal.onClose();
                router.refresh();
                console.log(response.data);
            })
            .catch((error) => {
                setBackendErrors(error.response.data.errors);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const toogleSigninSignupModal = useCallback(() => {
        signinModal.onClose();
        signupModal.onOpen();
    }, [signinModal, signupModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome Back!" subtitle="Sign into you account" />
            <div className="justify-center flex flex-row gap-4">
                <Button
                    outline
                    label="Google"
                    icon={FcGoogle}
                    onClick={() => signIn('google')}
                />
            </div>
            <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-gray-400"></div>
                <span className="flex-shrink mx-4 text-gray-400">or</span>
                <div className="flex-grow border-t border-gray-400"></div>
            </div>

            {backendErrors.length > 0 && (
                <div className="bg-rose-200 rounded px-1 border-red-800 text-red-800 font-semibold">
                    <h4>Oooops....</h4>
                    <ul className="my-0">
                        {backendErrors.map((error) => (
                            <li key={error.message}>{error.message}</li>
                        ))}
                    </ul>
                </div>
            )}
            <Input
                id="email"
                label="Email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id="password"
                label="Password"
                type="password"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    );

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <div className="text-neutral-500 text-center mt-4 font-light">
                <div className="justify-center flex flex-row items-center gap-2">
                    <div>Do not have an account?</div>
                    <div
                        onClick={toogleSigninSignupModal}
                        className="text-neutral-800 cursor-pointer hover:underline"
                    >
                        Create one
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Modal
            disabled={isLoading}
            isOpen={signinModal.isOpen}
            title="Sign in"
            actionLabel="Continue"
            onClose={signinModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
};

export default SigninModal;
