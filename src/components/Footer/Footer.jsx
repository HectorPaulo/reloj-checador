import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
    return (
        <div className="bg-black w-full grid grid-cols-3 position-relative mt-20 p-6">
            <div className="grid grid-rows-2">
                <img className="my-4 mx-20 w-16 h-auto" src="/public/favicon.png" alt="Logo" />
                <div className="mt-8 flex flex-row gap-3 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>
                    <p>014417517@ulsaoaxaca.edu.mx</p>
                </div>
            </div>
            <div className="flex items-center justify-center">
                <p className="text-white">© {new Date().getFullYear()} Hector Paulo. Todos los derechos reservados.</p>
            </div>
            <div className="flex flex-col items-center justify-center text-white">
                <p className="font-semibold text-xl">Redes Sociales</p>
                <div className="flex gap-4 mt-2">
                    <a href="https://www.facebook.com/adrian.paulo.56614/?locale=es_LA" target="_blank" rel="noopener noreferrer"><FacebookIcon/></a>
                    <a href="https://x.com/AdrianPauloV" target="_blank" rel="noopener noreferrer"><XIcon/></a>
                    <a href="https://www.instagram.com/slimy_h._arbogast/" target="_blank" rel="noopener noreferrer"><InstagramIcon/></a>
                    <a href="https://github.com/HectorPaulo" target="_blank" rel="noopener noreferrer"><GitHubIcon/></a>
                </div>
            </div>
        </div>
    );
};

export default Footer;
