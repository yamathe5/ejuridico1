# Estudio jurídico — Demo

Web responsive de demostración para Valdés & Asociados, desarrollada con HTML, CSS y JavaScript, sin compilación ni dependencias de código.

## Vista local

Abra `index.html` en el navegador o ejecute desde esta carpeta:

```sh
python -m http.server 8000
```

Luego visite http://localhost:8000.

## Publicar en Netlify

Importe este repositorio desde GitHub en Netlify y seleccione la rama `main`.
El archivo `netlify.toml` configura la publicación desde la raíz, sin compilación.

- Directorio base: dejar vacío.
- Comando de compilación: dejar vacío.
- Directorio de publicación: `.`
- Variables de entorno: ninguna.

El formulario usa enlaces de WhatsApp y no requiere Netlify Forms ni un servidor.

## Contenido

- Diseño azul oscuro, dorado y blanco; paleta documentada en `PALETA.md`.
- Menú móvil, especialidades desplegables y animaciones al desplazarse.
- Formulario y botón flotante que abren WhatsApp al número de demostración `+51 999 999 999`. El envío se confirma dentro de WhatsApp.
- Mapa referencial de Miraflores, Lima.
- Testimonios, identidad y datos de contacto ficticios, identificados como demostración.

Google Fonts, las fotografías de Pexels y Unsplash y el mapa requieren conexión a internet. Los créditos de las fotografías están en la web y en `PALETA.md`.

Antes de usar el sitio para un estudio real, reemplace el nombre, el número de WhatsApp, los datos de contacto, los enlaces sociales y los testimonios por información auténtica y autorizada.
