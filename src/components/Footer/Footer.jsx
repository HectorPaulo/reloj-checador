import FacebookIcon from '@mui/icons-material/Facebook';
import RelojFooter from '../RelojFooter/RelojFooter';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
    return (
        <div className="bg-black w-full grid grid-cols-1 md:grid-cols-3 position-relative mt-20 p-8">
            <div className="grid grid-rows-2 md:items-start">
                <div className="flex justify-start">
                    <RelojFooter />
                </div>
                <div className="mt-8 flex flex-col md:flex-row gap-3 text-white ml-20 md:items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                        <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/>
                    </svg>
                    <p>014417517@ulsaoaxaca.edu.mx</p>
                </div>
            </div>
            <div className="flex items-center justify-center mt-4 md:mt-0">
                <p className="text-white text-center">© {new Date().getFullYear()} Hector Paulo. Todos los derechos reservados.</p>
            </div>
            <div className="flex flex-col items-center justify-center text-white mt-4 md:mt-0">
                <p className="font-semibold text-xl">Redes Sociales</p>
                <div className="flex gap-4 mt-2">
                    <a href="https://www.facebook.com/adrian.paulo.56614/?locale=es_LA" target="_blank" rel="noopener noreferrer">
                        <FacebookIcon/>
                    </a>
                    <a href="https://x.com/AdrianPauloV" target="_blank" rel="noopener noreferrer">
                        <XIcon/>
                    </a>
                    <a href="https://www.instagram.com/slimy_h._arbogast/" target="_blank" rel="noopener noreferrer">
                        <InstagramIcon/>
                    </a>
                    <a href="https://github.com/HectorPaulo" target="_blank" rel="noopener noreferrer">
                        <GitHubIcon/>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Footer;
