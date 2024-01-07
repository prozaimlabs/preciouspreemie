import { data } from 'autoprefixer';
import axios, { AxiosRequestConfig } from 'axios';
import { JSXElementConstructor, useState } from 'react';

interface RequestProps {
    url: string;
    method: 'post' | 'get' | 'patch';
    body: any;
}

interface Error {
    message: string;
}

export const useRequest = ({ url, method, body }: RequestProps) => {
    const [backendErrors, setBackendErrors] = useState<any>(<div></div>);

    console.log('form data: ', data);
    const doRequest = async () => {
        try {
            let config: AxiosRequestConfig = {
                url: url,
                method: method,
                data: body,
            };

            const response = await axios.request(config);
            return response.data;
        } catch (err: any) {
            setBackendErrors(
                <div className="bg-rose-200 rounded px-1 border-red-800 text-red-800 font-semibold">
                    <h4>Oooops....</h4>
                    <ul className="my-0">
                        {err.response.data.errors.map((error: Error) => (
                            <li key={error.message}>{error.message}</li>
                        ))}
                    </ul>
                </div>
            );
        }
    };

    return { doRequest, backendErrors };
};
