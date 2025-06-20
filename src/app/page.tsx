"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Song {
  id: number;
  title: string;
  artist: {
    name: string;
  };
  preview: string;
  album: {
    cover: string;
  };
}

interface GameState {
  currentSong: Song | null;
  currentAttempt: number;
  gameStatus: "playing" | "won" | "lost";
  userGuess: string;
  attempts: string[];
  isPlaying: boolean;
  audioDuration: number;
  showAnswer: boolean;
}

const ATTEMPT_DURATIONS = [1, 3, 5, 7, 10]; // duraciones en segundos (máximo 10s)
const MAX_ATTEMPTS = 5;

// Lista de artistas latinos populares para buscar
const LATIN_ARTISTS = [
  "Eladio Carrión",
  "Bad Bunny",
  "J Balvin",
  "Maluma",
  "Ozuna",
  "Anuel AA",
  "Karol G",
  "Natti Natasha",
  "Farruko",
  "Sech",
  "Rauw Alejandro",
  "Myke Towers",
  "Feid",
  "Arcángel",
  "Daddy Yankee",
];

// Datos de canciones de ejemplo para cuando la API no esté disponible
const FALLBACK_SONGS: Song[] = [
  {
    id: 1,
    title: "Tití Me Preguntó",
    artist: { name: "Bad Bunny" },
    preview:
      "https://cdns-preview-6.dzcdn.net/stream/c-6b8c8c8c8c8c8c8c8c8c8c8c8c8c8c8-1.mp3",
    album: {
      cover:
        "https://e-cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/264x264-000000-80-0-0.jpg",
    },
  },
  {
    id: 2,
    title: "Me Porto Bonito",
    artist: { name: "Bad Bunny" },
    preview:
      "https://cdns-preview-7.dzcdn.net/stream/c-7b8c8c8c8c8c8c8c8c8c8c8c8c8c8c8-1.mp3",
    album: {
      cover:
        "https://e-cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/264x264-000000-80-0-0.jpg",
    },
  },
  {
    id: 3,
    title: "Ginza",
    artist: { name: "J Balvin" },
    preview:
      "https://cdns-preview-8.dzcdn.net/stream/c-8b8c8c8c8c8c8c8c8c8c8c8c8c8c8c8-1.mp3",
    album: {
      cover:
        "https://e-cdns-images.dzcdn.net/images/cover/3f018122cb56986277102d2041a592c8/264x264-000000-80-0-0.jpg",
    },
  },
];

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    currentSong: null,
    currentAttempt: 0,
    gameStatus: "playing",
    userGuess: "",
    attempts: [],
    isPlaying: false,
    audioDuration: 0,
    showAnswer: false,
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Función para obtener una canción aleatoria
  const fetchRandomSong = async (): Promise<Song | null> => {
    try {
      // Intentar usar la API de Deezer con diferentes proxies
      const proxies = [
        "https://cors-anywhere.herokuapp.com/",
        "https://api.allorigins.win/raw?url=",
        "https://thingproxy.freeboard.io/fetch/",
      ];

      const randomArtist =
        LATIN_ARTISTS[Math.floor(Math.random() * LATIN_ARTISTS.length)];

      for (const proxy of proxies) {
        try {
          const searchResponse = await fetch(
            `${proxy}https://api.deezer.com/search?q=artist:"${encodeURIComponent(
              randomArtist
            )}"&limit=50`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (searchResponse.ok) {
            const searchData = await searchResponse.json();

            if (searchData.data && searchData.data.length > 0) {
              // Filtrar canciones que tengan preview
              const songsWithPreview = searchData.data.filter(
                (song: any) => song.preview
              );

              if (songsWithPreview.length > 0) {
                // Seleccionar una canción aleatoria
                const randomSong =
                  songsWithPreview[
                    Math.floor(Math.random() * songsWithPreview.length)
                  ];

                return {
                  id: randomSong.id,
                  title: randomSong.title,
                  artist: { name: randomSong.artist.name },
                  preview: randomSong.preview,
                  album: { cover: randomSong.album.cover },
                };
              }
            }
          }
        } catch (error) {
          console.log(`Proxy ${proxy} falló, intentando siguiente...`);
          continue;
        }
      }

      // Si todos los proxies fallan, usar canciones de ejemplo
      console.log("Usando canciones de ejemplo debido a problemas con la API");
      return FALLBACK_SONGS[Math.floor(Math.random() * FALLBACK_SONGS.length)];
    } catch (error) {
      console.error("Error fetching song:", error);
      // Usar canciones de ejemplo como fallback
      return FALLBACK_SONGS[Math.floor(Math.random() * FALLBACK_SONGS.length)];
    }
  };

  // Iniciar nuevo juego
  const startNewGame = async () => {
    setIsLoading(true);
    const song = await fetchRandomSong();

    if (song) {
      setGameState({
        currentSong: song,
        currentAttempt: 0,
        gameStatus: "playing",
        userGuess: "",
        attempts: [],
        isPlaying: false,
        audioDuration: 0,
        showAnswer: false,
      });
    }
    setIsLoading(false);
  };

  // Reproducir audio con duración específica
  const playAudio = (duration: number) => {
    if (!audioRef.current || !gameState.currentSong) return;

    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setGameState((prev) => ({
      ...prev,
      isPlaying: true,
      audioDuration: duration,
    }));

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        setGameState((prev) => ({ ...prev, isPlaying: false }));
      }
    }, duration * 1000);
  };

  // Función para saltar a la siguiente duración
  const skipToNextDuration = () => {
    if (gameState.currentAttempt < MAX_ATTEMPTS - 1) {
      const nextDuration = ATTEMPT_DURATIONS[gameState.currentAttempt + 1];
      playAudio(nextDuration);
      setGameState((prev) => ({
        ...prev,
        currentAttempt: prev.currentAttempt + 1,
      }));
    }
  };

  // Función para mostrar la respuesta
  const showAnswer = () => {
    setGameState((prev) => ({
      ...prev,
      showAnswer: true,
      gameStatus: "lost", // Terminar el juego automáticamente
    }));
  };

  // Función para validación mejorada
  const validateGuess = (guess: string, song: Song): boolean => {
    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedTitle = song.title.toLowerCase();
    const normalizedArtist = song.artist.name.toLowerCase();

    // Verificar si ya se intentó esta respuesta
    const normalizedAttempts = gameState.attempts.map((attempt) =>
      attempt.toLowerCase().trim()
    );
    if (normalizedAttempts.includes(normalizedGuess)) {
      return false;
    }

    // Validación más flexible y precisa
    const titleMatch =
      normalizedTitle.includes(normalizedGuess) ||
      normalizedGuess.includes(normalizedTitle) ||
      normalizedTitle
        .split(" ")
        .some((word) => word.includes(normalizedGuess)) ||
      normalizedGuess.split(" ").some((word) => normalizedTitle.includes(word));

    const artistMatch =
      normalizedArtist.includes(normalizedGuess) ||
      normalizedGuess.includes(normalizedArtist) ||
      normalizedArtist
        .split(" ")
        .some((word) => word.includes(normalizedGuess)) ||
      normalizedGuess
        .split(" ")
        .some((word) => normalizedArtist.includes(word));

    return titleMatch || artistMatch;
  };

  // Manejar intento con validación mejorada
  const handleAttempt = () => {
    if (!gameState.userGuess.trim() || !gameState.currentSong) return;

    const isCorrect = validateGuess(gameState.userGuess, gameState.currentSong);

    const newAttempts = [...gameState.attempts, gameState.userGuess];
    const newAttempt = gameState.currentAttempt + 1;

    if (isCorrect) {
      setGameState((prev) => ({
        ...prev,
        gameStatus: "won",
        attempts: newAttempts,
        currentAttempt: newAttempt,
        userGuess: "",
      }));
    } else if (newAttempt >= MAX_ATTEMPTS) {
      setGameState((prev) => ({
        ...prev,
        gameStatus: "lost",
        attempts: newAttempts,
        currentAttempt: newAttempt,
        userGuess: "",
        showAnswer: true, // Mostrar respuesta automáticamente al perder
      }));
    } else {
      setGameState((prev) => ({
        ...prev,
        attempts: newAttempts,
        currentAttempt: newAttempt,
        userGuess: "",
      }));
    }
  };

  // Efecto para cargar una canción al iniciar
  useEffect(() => {
    startNewGame();
  }, []);

  // Efecto para manejar el teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && gameState.gameStatus === "playing") {
        handleAttempt();
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [gameState.userGuess, gameState.gameStatus]);

  if (isLoading) {
    return (
      <div className="game-container flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando canción...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="game-container flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
            🎵 Songless
          </h1>
          <p className="text-gray-300 text-lg">
            Adivina la canción latina con intentos progresivos
          </p>
        </motion.div>

        {/* Estado del juego */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6"
        >
          <div className="text-center mb-6">
            <div className="flex justify-center items-center gap-2 mb-4">
              {Array.from({ length: MAX_ATTEMPTS }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < gameState.currentAttempt
                      ? "bg-red-500"
                      : i === gameState.currentAttempt
                      ? "bg-yellow-500"
                      : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
            <p className="text-white text-lg">
              Intento {gameState.currentAttempt + 1} de {MAX_ATTEMPTS}
            </p>
          </div>

          {/* Reproductor de audio */}
          {gameState.currentSong && (
            <div className="audio-player p-4 mb-6">
              <audio ref={audioRef} src={gameState.currentSong.preview} />

              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {ATTEMPT_DURATIONS.map((duration, index) => (
                  <motion.button
                    key={duration}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => playAudio(duration)}
                    disabled={
                      gameState.isPlaying || index > gameState.currentAttempt
                    }
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      index > gameState.currentAttempt
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "btn-primary text-white"
                    }`}
                  >
                    {duration}s
                  </motion.button>
                ))}
              </div>

              {/* Botones de control */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
                {/* Botón Skip */}
                {gameState.currentAttempt < MAX_ATTEMPTS - 1 &&
                  !gameState.showAnswer && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={
                        gameState.isPlaying ? {} : { scale: 1.05, y: -2 }
                      }
                      whileTap={{ scale: 0.95 }}
                      onClick={skipToNextDuration}
                      disabled={gameState.isPlaying}
                      className={`flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl font-medium transition-all shadow-lg ${
                        gameState.isPlaying
                          ? "bg-gray-600/50 cursor-not-allowed opacity-60"
                          : "btn-skip"
                      }`}
                    >
                      <span className="text-lg">
                        {gameState.isPlaying ? "⏸️" : "⏭️"}
                      </span>
                      <div className="text-left">
                        <div className="font-semibold">
                          {gameState.isPlaying ? "Playing..." : "Skip"}
                        </div>
                        <div className="text-xs opacity-80">
                          {gameState.isPlaying
                            ? "wait for audio to finish"
                            : `to ${
                                ATTEMPT_DURATIONS[gameState.currentAttempt + 1]
                              }s`}
                        </div>
                      </div>
                    </motion.button>
                  )}

                {/* Botón Show Answer */}
                {!gameState.showAnswer &&
                  gameState.gameStatus === "playing" && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        ...(gameState.currentAttempt >= MAX_ATTEMPTS - 2 && {
                          scale: [1, 1.02, 1],
                        }),
                      }}
                      transition={{
                        ...(gameState.currentAttempt >= MAX_ATTEMPTS - 2 && {
                          scale: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                        }),
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={showAnswer}
                      className={`flex items-center justify-center gap-2 px-6 py-3 btn-show-answer text-white rounded-xl font-medium transition-all shadow-lg relative group ${
                        gameState.currentAttempt >= MAX_ATTEMPTS - 2
                          ? "ring-2 ring-white/30"
                          : ""
                      }`}
                      title="Revelar la respuesta y terminar el juego"
                    >
                      <span className="text-lg">👁️</span>
                      <div className="text-left">
                        <div className="font-semibold">Show Answer</div>
                        <div className="text-xs opacity-80">
                          {gameState.currentAttempt >= MAX_ATTEMPTS - 2
                            ? "last chance!"
                            : "reveal the song"}
                        </div>
                      </div>

                      {/* Tooltip */}
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                        Click to reveal answer and end game
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
                      </div>
                    </motion.button>
                  )}
              </div>

              {/* Mostrar respuesta */}
              {(gameState.showAnswer || gameState.gameStatus !== "playing") &&
                gameState.currentSong && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/20 rounded-lg p-4 mt-4"
                  >
                    <h3 className="text-white font-bold text-lg mb-2 text-center">
                      {gameState.showAnswer
                        ? "👁️ Respuesta revelada:"
                        : "🎵 La respuesta era:"}
                    </h3>
                    <div className="flex items-center gap-4 justify-center">
                      <img
                        src={gameState.currentSong.album.cover}
                        alt="Album cover"
                        className="w-16 h-16 rounded-lg"
                      />
                      <div className="text-center">
                        <p className="text-white font-semibold">
                          {gameState.currentSong.title}
                        </p>
                        <p className="text-gray-300 text-sm">
                          {gameState.currentSong.artist.name}
                        </p>
                      </div>
                    </div>
                    {gameState.showAnswer &&
                      gameState.gameStatus === "lost" && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-gray-400 text-sm text-center mt-3"
                        >
                          💡 Usaste "Show Answer" - ¡Intenta adivinar la próxima
                          vez!
                        </motion.p>
                      )}
                  </motion.div>
                )}
            </div>
          )}

          {/* Input de respuesta */}
          {gameState.gameStatus === "playing" && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="space-y-4"
            >
              <input
                type="text"
                value={gameState.userGuess}
                onChange={(e) => {
                  const value = e.target.value;
                  setGameState((prev) => ({
                    ...prev,
                    userGuess: value,
                  }));
                }}
                placeholder="Escribe el nombre del artista o la canción..."
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAttempt}
                disabled={!gameState.userGuess.trim()}
                className="w-full btn-primary text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Adivinar
              </motion.button>

              {/* Mensaje de ayuda */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <p className="text-gray-400 text-sm">
                  💡 Puedes escribir el nombre del artista o el título de la
                  canción
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Intentos anteriores */}
          {gameState.attempts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6"
            >
              <h3 className="text-white font-medium mb-3">
                Intentos anteriores:
              </h3>
              <div className="space-y-2">
                {gameState.attempts.map((attempt, index) => (
                  <div key={index} className="text-gray-300 text-sm">
                    {index + 1}. "{attempt}"
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Resultado del juego */}
        <AnimatePresence>
          {gameState.gameStatus !== "playing" && gameState.currentSong && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center"
            >
              {gameState.gameStatus === "won" ? (
                <div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-6xl mb-4"
                  >
                    🎉
                  </motion.div>
                  <h2 className="text-2xl font-bold text-green-400 mb-2">
                    ¡Felicitaciones!
                  </h2>
                  <p className="text-white mb-4">
                    Adivinaste la canción en {gameState.currentAttempt} intentos
                  </p>
                </div>
              ) : (
                <div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-6xl mb-4"
                  >
                    😔
                  </motion.div>
                  <h2 className="text-2xl font-bold text-red-400 mb-2">
                    ¡Game Over!
                  </h2>
                  <p className="text-white mb-4">La canción era:</p>
                </div>
              )}

              <div className="bg-white/20 rounded-lg p-4 mb-6">
                <img
                  src={gameState.currentSong.album.cover}
                  alt="Album cover"
                  className="w-24 h-24 rounded-lg mx-auto mb-3"
                />
                <h3 className="text-white font-bold text-lg">
                  {gameState.currentSong.title}
                </h3>
                <p className="text-gray-300">
                  {gameState.currentSong.artist.name}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={startNewGame}
                className="btn-success text-white px-8 py-3 rounded-lg font-medium flex items-center justify-center gap-2 mx-auto"
              >
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  🔁
                </motion.span>
                Jugar otra vez
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
