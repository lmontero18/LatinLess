# 🎵 Songless - Adivina la Canción Latina

Un juego interactivo para adivinar canciones latinas con intentos progresivos. Escucha fragmentos de música y adivina el artista o la canción.

## 🎮 Cómo Jugar

1. **Escucha la música**: Usa los botones para reproducir fragmentos de la canción

   - 1 segundo (primer intento)
   - 3 segundos (segundo intento)
   - 5 segundos (tercer intento)
   - 7 segundos (cuarto intento)
   - 10 segundos (último intento)

2. **Adivina**: Escribe el nombre del artista o el título de la canción
3. **Opciones adicionales**:
   - Usa el botón "Skip" para saltar a la siguiente duración
   - Usa "Show Answer" para revelar la respuesta en cualquier momento
4. **Gana**: Si aciertas, ¡felicitaciones! Si fallas 5 veces, se revela la canción

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
