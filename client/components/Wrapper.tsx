import Menu from './Menu';
import MenuBar from './navbar/MenuBar';

interface WrapperProps {
    children: React.ReactNode;
    classname?: string;
}

const Wrapper: React.FC<WrapperProps> = ({ children, classname }) => {
    return (
        <div
            className={`w-full max-w-[1280px] px-5 md:px-10 mx-auto ${
                classname || ''
            }`}
        >
            {children}
        </div>
    );
};

export default Wrapper;
