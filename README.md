# LatinLess

LatinLess es un juego web para adivinar canciones latinas, construido con Next.js, React, TypeScript y TailwindCSS. Los jugadores escuchan fragmentos de canciones cada vez más largos y deben adivinar el título o el artista.

## Cómo Jugar

1.  Visita la página del juego.
2.  Presiona el botón de play para escuchar el primer segundo de una canción.
3.  Escribe tu respuesta (título o artista) en el campo de texto.
4.  Si no aciertas, puedes escuchar un fragmento más largo.
5.  Tienes 5 intentos para adivinar la canción.

## ✨ Características

- 🎵 **Reproducción de audio**: Fragmentos de hasta 10 segundos de canciones latinas
- 🎨 **Diseño moderno**: Interfaz elegante con fondo negro y efectos visuales
- 📱 **Responsive**: Se adapta perfectamente a móviles y tablets
- 🎭 **Animaciones**: Transiciones suaves con Framer Motion
- 🎯 **5 intentos progresivos**: Cada intento te da más tiempo para escuchar (1s, 3s, 5s, 7s, 10s)
- 🏆 **Sistema de puntuación**: Visualización de intentos restantes
- ⏭️ **Botón Skip**: Salta directamente a la siguiente duración de audio
- 👁️ **Show Answer**: Revela la respuesta en cualquier momento
- 🔍 **Autocompletado**: Sugerencias inteligentes mientras escribes
- 🎯 **Validación flexible**: Acepta nombres aproximados de artistas y canciones

## 🛠️ Tecnologías

- **Next.js 15** con App Router
- **React 19** con hooks modernos
- **TypeScript** para type safety
- **TailwindCSS** para estilos
- **Framer Motion** para animaciones
- **API de Deezer** para obtener canciones

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd latin-songless

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## 🎵 API de Música

La aplicación utiliza la API pública de Deezer para obtener canciones latinas de artistas populares como:

- Eladio Carrión
- Bad Bunny
- J Balvin
- Maluma
- Ozuna
- Y muchos más...

## 🎨 Diseño

- **Fondo**: Gradiente negro con efectos de blur
- **Colores**: Blanco para texto, azul/verde para botones
- **Efectos**: Hover animations y transiciones suaves
- **Tipografía**: Inter font para mejor legibilidad

## 📱 Responsive Design

La aplicación está optimizada para:

- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)

## 🎯 Funcionalidades

- ✅ Reproducción de audio con controles de duración
- ✅ Sistema de intentos progresivos
- ✅ Validación de respuestas (artista o canción)
- ✅ Historial de intentos
- ✅ Pantallas de victoria/derrota
- ✅ Botón para jugar de nuevo
- ✅ Soporte para teclado (Enter para adivinar)
- ✅ Loading states y manejo de errores

## 🔧 Configuración

La aplicación funciona completamente en el frontend sin necesidad de backend. Los datos de las canciones se obtienen de la API de Deezer a través de proxies públicos para evitar problemas de CORS.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

¡Disfruta adivinando canciones latinas! 🎵🇪🇸
