import FacebookIcon from '@mui/icons-material/Facebook'; // Importa el ícono de Facebook desde Material UI
import InstagramIcon from '@mui/icons-material/Instagram'; // Importa el ícono de Instagram desde Material UI
import XIcon from '@mui/icons-material/X'; // Importa el ícono de X (anteriormente Twitter) desde Material UI
import GitHubIcon from '@mui/icons-material/GitHub'; // Importa el ícono de GitHub desde Material UI

const Footer = () => {
    return (
        <div className="bg-gray-950 w-full grid grid-cols-1 md:grid-cols-3 position-relative mt-20 p-6">
            {/* Contenedor principal del pie de página con estilos de fondo, ancho, grid y padding */}
            <div className="grid grid-rows-2 items-center md:items-start">
                {/* Contenedor para la imagen y el correo electrónico */}
                <img className="my-4 mx-auto md:mx-20 w-16 h-auto" src="/public/favicon.png" alt="Logo" />
                {/* Imagen del logo con estilos de margen y tamaño */}
                <div className="mt-8 flex flex-col md:flex-row gap-3 text-white items-center md:items-start">
                    {/* Contenedor para el ícono de correo y el texto del correo */}
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                        <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/>
                    </svg>
                    {/* SVG del ícono de correo */}
                    <p>014417517@ulsaoaxaca.edu.mx</p>
                    {/* Texto del correo electrónico */}
                </div>
            </div>
            <div className="flex items-center justify-center mt-4 md:mt-0">
                {/* Contenedor para el texto de derechos reservados */}
                <p className="text-white text-center">© {new Date().getFullYear()} Hector Paulo. Todos los derechos reservados.</p>
                {/* Texto de derechos reservados con el año actual */}
            </div>
            <div className="flex flex-col items-center justify-center text-white mt-4 md:mt-0">
                {/* Contenedor para los enlaces de redes sociales */}
                <p className="font-semibold text-xl">Redes Sociales</p>
                {/* Título de la sección de redes sociales */}
                <div className="flex gap-4 mt-2">
                    {/* Contenedor para los íconos de redes sociales */}
                    <a href="https://www.facebook.com/adrian.paulo.56614/?locale=es_LA" target="_blank" rel="noopener noreferrer">
                        <FacebookIcon/>
                    </a>
                    {/* Enlace a Facebook con el ícono correspondiente */}
                    <a href="https://x.com/AdrianPauloV" target="_blank" rel="noopener noreferrer">
                        <XIcon/>
                    </a>
                    {/* Enlace a X (anteriormente Twitter) con el ícono correspondiente */}
                    <a href="https://www.instagram.com/slimy_h._arbogast/" target="_blank" rel="noopener noreferrer">
                        <InstagramIcon/>
                    </a>
                    {/* Enlace a Instagram con el ícono correspondiente */}
                    <a href="https://github.com/HectorPaulo" target="_blank" rel="noopener noreferrer">
                        <GitHubIcon/>
                    </a>
                    {/* Enlace a GitHub con el ícono correspondiente */}
                </div>
            </div>
        </div>
    );
};

export default Footer; // Exporta el componente Footer para su uso en otras partes de la aplicación
