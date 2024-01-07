'use client';

import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import { useCallback, useState } from 'react';
import Modal from './Modal';
import Input from '../inputs/Input';
import { toast } from 'react-hot-toast';
import Button from '../Button';
import { signIn } from 'next-auth/react';
import useSignupModal from '@/app/hooks/useSignupModal';
import useSigninModal from '@/app/hooks/useSigninModal';

interface BackendError {
    field: string;
    message: string;
}

const RegisterModal = () => {
    const signupModal = useSignupModal();
    const signinModal = useSigninModal();
    const [isLoading, setIsLoading] = useState(false);
    const [backendErrors, setBackendErrors] = useState<BackendError[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: { name: '', email: '', password: '' },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);

        axios
            .post('/api/users/signup', data)
            .then((response) => {
                toast.success('Success!');
                signupModal.onClose();
                signinModal.onOpen();
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
        signupModal.onClose();
        signinModal.onOpen();
    }, [signinModal, signupModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
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
                <div className="bg-rose-200 rounded px-1 border-red-800">
                    <h4 className="text-red-800 font-semibold">Error!</h4>
                    <ul className="my-0 text-red-800">
                        {backendErrors.map((error) => (
                            <li key={error.message}>{error.message}</li>
                        ))}
                    </ul>
                </div>
            )}
            <Input
                id="name"
                label="Name"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
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
                    <div>Already have an account?</div>
                    <div
                        onClick={toogleSigninSignupModal}
                        className="text-neutral-800 cursor-pointer hover:underline"
                    >
                        Sign in
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Modal
            disabled={isLoading}
            isOpen={signupModal.isOpen}
            title="Sign up"
            actionLabel="Continue"
            onClose={signupModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
};

export default RegisterModal;
