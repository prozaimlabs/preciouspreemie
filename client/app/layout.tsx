import Footer from './components/Footer';
import Header from './components/Header';
import SignupModal from './components/modals/SignupModal';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Precious Preemie',
    description: 'A community for premature baby parents',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <SignupModal />
                <Header />
                <Footer />
                <div className="pb-20 pt-28">{children}</div>
            </body>
        </html>
    );
}
