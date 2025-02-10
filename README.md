# React + Vite

Este proyecto proporciona una configuración mínima para que React funcione en Vite con HMR y algunas reglas de ESLint.

## Plugins Oficiales

Actualmente, hay dos plugins oficiales disponibles:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) utiliza [Babel](https://babeljs.io/) para Fast Refresh.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) utiliza [SWC](https://swc.rs/) para Fast Refresh.

## Estructura del Proyecto

El proyecto está estructurado de la siguiente manera:

```
/src
    /components
        - App.jsx
        - Header.jsx
        - Footer.jsx
    /assets
        - logo.png
    index.html
    main.jsx
/vite.config.js
/package.json
/README.md
```

### Componentes

- **App.jsx**: El componente principal que envuelve toda la aplicación.
- **Header.jsx**: Componente que representa el encabezado de la aplicación.
- **Footer.jsx**: Componente que representa el pie de página de la aplicación.

### Configuración de Vite

El archivo `vite.config.js` contiene la configuración necesaria para que Vite funcione con React y los plugins mencionados.

### Scripts Disponibles

En el archivo `package.json`, se encuentran los siguientes scripts:

- `dev`: Inicia el servidor de desarrollo.
- `build`: Construye la aplicación para producción.
- `serve`: Sirve la aplicación construida.

## Cómo Empezar

1. Clona el repositorio.
2. Instala las dependencias con `npm install`.
3. Inicia el servidor de desarrollo con `npm run dev`.

## Contribuir

Si deseas contribuir a este proyecto, por favor sigue los siguientes pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añadir nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

¡Gracias por contribuir!

