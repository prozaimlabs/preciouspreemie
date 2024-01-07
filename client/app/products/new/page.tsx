'use client';

import Button from '@/app/components/Button';
import Input from '@/app/components/inputs/Input';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const CreateProduct = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [backendErrors, setBackendErrors] = useState<BackendError[]>([]);

    const router = useRouter();

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
            .post('/api/products', data)
            .then((response) => {
                toast.success('Success!');
                router.push('/products');
            })
            .catch((error) => {
                setBackendErrors(error.response.data.errors);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="relative p-6 flex-auto">
            <div className="flex flex-col gap-4">
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
                    id="price"
                    label="Price"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
                <div className="flex flex-col gap-2 p-6">
                    <div className="flex flex-row items-center gap-4 w-full">
                        <Button
                            disabled={isLoading}
                            label="Save"
                            onClick={handleSubmit(onSubmit)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProduct;
