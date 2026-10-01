# BioLens Pro: Identificación Botánica Precisa

Esta versión ha sido completamente reestructurada para ofrecer una **precisión científica real**. En lugar de usar modelos genéricos o simulaciones, esta aplicación se conecta directamente a **Pl@ntNet API**, la base de datos botánica de reconocimiento de imágenes más grande e importante del mundo.

## ¿Qué resolvió esta versión definitiva?
* **Precisión Absoluta:** Las versiones anteriores dependían de simuladores o de un modelo genérico (`MobileNet`) que reconocía "plantas" o "macetas", pero no especies botánicas específicas. 
* **Base de datos real:** Al conectarse a *Pl@ntNet*, la aplicación ahora compara la imagen capturada con millones de imágenes de especies vegetales a nivel global, devolviendo el Nombre Científico, el Nombre Común, la Familia botánica y el porcentaje de precisión real.

## Arquitectura de la Aplicación
* **Autenticación Vía UI:** Para evitar exponer claves privadas en GitHub, la aplicación integra un modal de configuración (⚙️) donde el estudiante o profesor puede ingresar su propia API Key gratuita. Esta clave se guarda de forma segura en el almacenamiento local del teléfono (`localStorage`).
* **Formatos Nativos:** Sigue empleando `capture="environment"` para compatibilidad perfecta con la cámara del iPhone y Android sin problemas de permisos de navegador.

## Instrucciones: ¿Cómo usarla y publicarla?

1. **Subir a GitHub Pages:**
   - Crea un repositorio nuevo (ej: `biolens-pro`).
   - Sube los archivos `index.html`, `style.css` y `app.js`.
   - Activa *GitHub Pages* desde la pestaña Settings -> Pages seleccionando la rama principal.

2. **Obtener la Clave API Gratuita (Pl@ntNet):**
   Para que la aplicación funcione, necesitas registrarte como desarrollador (es gratis y toma 1 minuto):
   - Ve a [my.plantnet.org](https://my.plantnet.org/)
   - Regístrate y crea una nueva aplicación en tu panel.
   - Copia la **API Key** generada.

3. **Uso en clase:**
   - Comparte el enlace de GitHub Pages con tus estudiantes.
   - Pídeles que hagan clic en el ícono de engranaje (⚙️) en la parte superior derecha.
   - Deben pegar la API Key ahí. (Puedes compartirles la tuya o crear una para el grupo).
   - ¡Listo! Al tomar una foto de una hoja o flor, recibirán la taxonomía botánica exacta con sus probabilidades.

---
**Diseñado para:** Ciencias Naturales
**Institución:** The Lighthouse School
**Docente:** Prof. Cristian David Ayazo
