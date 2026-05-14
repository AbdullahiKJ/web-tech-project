import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type Props = {
    name: string;
    placeholder: string;
};

export default function PasswordInput({ name, placeholder }: Props) {
    const [show, setShow] = useState(false);

    return (
        <div className="form-control">
            <div className="input-bordered input flex items-center gap-2">
                <input
                    type={show ? 'text' : 'password'}
                    name={name}
                    className="grow"
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="btn btn-ghost btn-sm"
                >
                    {show ? <EyeOff /> : <Eye />}
                </button>
            </div>
        </div>
    );
}
