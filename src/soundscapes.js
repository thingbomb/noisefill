/**
 * A list of soundscapes, each represented as an object with the following properties:
 * - name: the name of the soundscape
 * - emoji: an emoji representing the soundscape
 * - url: the URL of the audio file representing the soundscape
 * - volume: the volume of the soundscape, ranging from 0 (silent) to 1 (full volume)
 * - attribution: a list of strings representing the attribution for the soundscape
 * - image: the URL of an image representing the soundscape
 * - index: the index of the soundscape in the list, used for sorting and identification
 */
let soundscapes = [
  {
    name: "Ocean",
    emoji: "🌊",
    url: "https://utfs.io/f/VU8He2t54NdYu8EVsK5tgWb3e9PanFUMzSxQm0HhV1XofujB",
    volume: 1,
    attribution: [
      "Seawash (calm)  by craiggroshek -- https://freesound.org/s/176617/ -- License: Creative Commons 0",
    ],
    image: "https://utfs.io/f/VU8He2t54NdYnavqSh6Uydx5HzbJtTENYqUwVaPOXZCnAiK2",
    index: 0,
    categories: ["water", "chill", "focus", "relax"],
  },
  {
    name: "Forest",
    emoji: "🌴",
    url: "https://utfs.io/f/VU8He2t54NdYuNACgha5tgWb3e9PanFUMzSxQm0HhV1Xofuj",
    volume: 1,
    attribution: [
      "Birds In Spring (Scotland) by BurghRecords -- https://freesound.org/s/463903/ -- License: Creative Commons 0",
    ],
    image: "https://utfs.io/f/VU8He2t54NdYpgBC9am76CiVAS4EwQty3arMPfHR1bxgdkZD",
    index: 1,
    categories: ["nature", "ambience"],
  },
  {
    name: "Rain",
    emoji: "💦",
    url: "https://utfs.io/f/VU8He2t54NdY9vI0WdS2OVPpzlUIsm50S3eRo4JLb68vxBYA",
    volume: 1,
    attribution: [
      "Rain.wav by idomusics -- https://freesound.org/s/518863/ -- License: Creative Commons 0",
    ],
    image: "https://utfs.io/f/VU8He2t54NdYOYYMxdZ45tUV7W1K4ESdzvZfN8Pr2yCwGuTi",
    index: 2,
    categories: ["favorites", "nature", "ambience", "sleep", "chill", "relax"],
  },
  {
    name: "River",
    emoji: "🪨",
    url: "https://utfs.io/f/VU8He2t54NdYd9CJeYhMOCr41owzn9sPYh5cNKJQFBEtaWu0",
    volume: 0.8,
    attribution: [
      "river small brook stream with rolling splashy good detail.flac by kyles -- https://freesound.org/s/454155/ -- License: Creative Commons 0",
    ],
    image: "https://utfs.io/f/VU8He2t54NdYK6sDVKYu2OlbUPXGzdjtJ5iT6AaRH0yZuqD8",
    index: 3,
    categories: ["favorites", "nature", "ambience", "sleep", "chill", "relax"],
  },
  {
    name: "Wind",
    emoji: "💨",
    url: "https://utfs.io/f/VU8He2t54NdYhES01SIQ6Taob8Wf0SXDOuUA1VKkE9IHx4qd",
    volume: 1,
    attribution: [
      "wind.ogg by sleepCircle -- https://freesound.org/s/22331/ -- License: Creative Commons 0",
    ],
    image: "https://utfs.io/f/VU8He2t54NdYvQshHTaHAWjPnCZrtxmV56SkaM3oO0qw4huf",
    index: 4,
    categories: ["nature", "ambience"],
  },
  {
    name: "Fire",
    emoji: "🔥",
    url: "https://utfs.io/f/VU8He2t54NdYGNe8h39BnItq9LXQlVPu4jNzU1xdaYCM0pF8",
    volume: 1,
    attribution: [
      "Bonfire by forfie -- https://freesound.org/s/364992/ -- License: Creative Commons 0",
    ],
    image: "https://utfs.io/f/VU8He2t54NdYpRQh5Mcm76CiVAS4EwQty3arMPfHR1bxgdkZ",
    index: 5,
    categories: ["natural", "ambience"],
  },
  {
    name: "Desert",
    emoji: "🌵",
    url: "https://utfs.io/f/VU8He2t54NdYHpvbBvYhmu5O2LJfYdtvzgw0s3nbQXlkZDFS",
    volume: 1,
    attribution: [
      "Desert Simple.wav by Proxima4 -- https://freesound.org/s/104320/ -- License: Creative Commons 0",
    ],
    image: "https://utfs.io/f/VU8He2t54NdYOYYMxdZ45tUV7W1K4ESdzvZfN8Pr2yCwGuTi",
    index: 6,
    categories: ["chill", "natural", "ambience"],
  },
  {
    name: "Arctic",
    emoji: "❄️",
    url: "https://utfs.io/f/VU8He2t54NdY6fCCfMVNjR9Nmtg7h50VGWKc8AQoryMUblvI",
    volume: 0.6,
    image: "https://utfs.io/f/VU8He2t54NdYxIBXaQ0DONIyCht8a6ZwdKgqEQSTLR51sMYB",
    attribution: [
      "Wind__Artic__Cold.wav by cobratronik -- https://freesound.org/s/117136/ -- License: Creative Commons 0",
    ],
    index: 7,
    categories: ["sleep", "chill", "nature", "ambience"],
  },
  {
    name: "Kettle",
    emoji: "☕️",
    url: "https://utfs.io/f/VU8He2t54NdY59NfzQ6fcCLQl6pk53zFgINtnv9PqHDjbRJy",
    volume: 1,
    image: "https://utfs.io/f/VU8He2t54NdYH7NV0ddYhmu5O2LJfYdtvzgw0s3nbQXlkZDF",
    attribution: [
      "water boil.wav by fryzu82 -- https://freesound.org/s/142333/ -- License: Creative Commons 0",
    ],
    index: 8,
    categories: ["chill", "appliance", "relax"],
  },
  {
    name: "Crickets",
    emoji: "🦗",
    url: "https://utfs.io/f/VU8He2t54NdYOGnYUk45tUV7W1K4ESdzvZfN8Pr2yCwGuTiB",
    volume: 0.2,
    image: "https://utfs.io/f/VU8He2t54NdYDAOUVo88fqOGlaboRgjxshLUcB5MT4ZS2iE1",
    attribution: [
      "crickets by FreethinkerAnon -- https://freesound.org/s/129678/ -- License: Creative Commons 0",
    ],
    index: 9,
    categories: ["natural", "nature"],
  },
  {
    name: "Underwater",
    emoji: "🐠",
    url: "https://utfs.io/f/VU8He2t54NdYrTIK1A7PtLG5Y82xDew0Ncpqo6IhCjBQRZOn",
    volume: 0.6,
    image: "https://utfs.io/f/VU8He2t54NdYI934tMkGS15s7ymktfMgw0zeF4dO2HlKZXbu",
    attribution: [
      "Underwater Ambience by Fission9 -- https://freesound.org/s/504641/ -- License: Creative Commons 0",
    ],
    index: 10,
    categories: ["sleep", "chill", "ambience", "relax"],
  },
  {
    name: "Groovy lofi",
    emoji: "🎸",
    url: "https://cdn.noisefill.com/655615__seth_makes_sounds__happy-hip-hop-beat.flac",
    volume: 1,
    image: "https://utfs.io/f/VU8He2t54NdYOyCeyq45tUV7W1K4ESdzvZfN8Pr2yCwGuTiB",
    attribution: [
      "Happy Hip Hop Beat by Seth_Makes_Sounds -- https://freesound.org/s/655615/ -- License: Creative Commons 0",
    ],
    index: 11,
    categories: ["focus"],
  },
  {
    name: "Upbeat lofi",
    emoji: "〰︎",
    url: "https://utfs.io/f/VU8He2t54NdYWxde6fRPgldB5noR0bZyKHC7642sSQYmDu9p",
    volume: 1,
    image: "https://utfs.io/f/VU8He2t54NdY0hdPQXceJ6f3Z4TpvBeOdMNrhcGIj8VYSotn",
    attribution: [
      "Lofi Guitar Beat 70bpm by Seth_Makes_Sounds -- https://freesound.org/s/659278/ -- License: Creative Commons 0",
    ],
    index: 12,
    categories: ["focus", "chill", "relax"],
  },
  {
    name: "Chill lofi",
    emoji: "🌌",
    url: "https://utfs.io/f/VU8He2t54NdYFwWRLZn976miCUOgPKZV5akqTMfu2ondGzWH",
    volume: 1,
    image: "https://utfs.io/f/VU8He2t54NdYrTIK1A7PtLG5Y82xDew0Ncpqo6IhCjBQRZOn",
    attribution: [
      "Chill Lofi - lost stars.wav by noel0319 -- https://freesound.org/s/680400/ -- License: Creative Commons 0",
    ],
    index: 13,
    categories: ["focus", "chill", "relax"],
  },
  {
    name: "Retro lofi",
    emoji: "🕹️",
    url: "https://cdn.noisefill.com/655516__seth_makes_sounds__lofi-fusion-background-music.flac",
    volume: 1,
    image: "https://cdn.noisefill.com/Retro_lofi.png",
    attribution: [
      "Lofi Fusion Background Music by Seth_Makes_Sounds -- https://freesound.org/s/655516/ -- License: Creative Commons 0",
    ],
    index: 14,
    categories: ["focus", "chill", "relax"],
  },
  {
    name: "Classic lofi",
    emoji: "🎩",
    url: "https://cdn.noisefill.com/660390__seth_makes_sounds__cute-lofi-instrumental.flac",
    volume: 1,
    image: "https://cdn.noisefill.com/Classic_lofi.png",
    attribution: [
      "Cute Lofi Instrumental by Seth_Makes_Sounds -- https://freesound.org/s/660390/ -- License: Creative Commons 0",
    ],
    index: 15,
    categories: ["upbeat", "focus"],
  },
  {
    name: "Piano lofi",
    emoji: "🎹",
    url: "https://cdn.noisefill.com/Piano.flac",
    volume: 1,
    image: "https://cdn.noisefill.com/Piano_lofi.png",
    attribution: [
      "Chill Lofi Piano Beat by Seth_Makes_Sounds -- https://freesound.org/s/709779/ -- License: Creative Commons 0",
    ],
    index: 16,
    categories: ["upbeat", "focus", "relax"],
  },
  {
    name: "Rising lofi",
    emoji: "🎶",
    url: "https://cdn.noisefill.com/Rising.flac",
    volume: 1,
    image: "https://cdn.noisefill.com/Rising_lofi.png",
    attribution: [
      "Tranquil Lofi Beat by Seth_Makes_Sounds -- https://freesound.org/s/688285/ -- License: Creative Commons 0",
    ],
    index: 17,
    categories: ["upbeat", "focus", "relax"],
  },
  {
    name: "Deep lofi",
    emoji: "🕳️",
    url: "https://cdn.noisefill.com/Deep.flac",
    volume: 1,
    image: "https://cdn.noisefill.com/Deep_lofi.png",
    attribution: [
      "Vanilla Lofi Beat by Seth_Makes_Sounds -- https://freesound.org/s/691510/ -- License: Creative Commons 0",
    ],
    index: 18,
    categories: ["upbeat", "focus"],
  },
  {
    name: "Vibe lofi",
    emoji: "✌️",
    url: "https://cdn.noisefill.com/Vibe.flac",
    volume: 1,
    image: "https://cdn.noisefill.com/Vibe_lofi.png",
    attribution: [
      "Good Vibe Background Music by Seth_Makes_Sounds -- https://freesound.org/s/661782/ -- License: Creative Commons 0",
    ],
    index: 19,
    categories: ["upbeat", "focus"],
  },
];

export const savePlaylist = (name, description, items, existingId = null) => {
  const playlist = {
    id: existingId || name.toLowerCase().replace(/\s+/g, "-"),
    name,
    description,
    items: items.map((item) => ({
      soundscapeIndex: item.soundscapeIndex,
      duration: item.duration,
    })),
    createdAt: new Date().toISOString(),
  };

  const existingPlaylists = JSON.parse(
    localStorage.getItem("soundscapePlaylists") || "[]"
  );
  const existingIndex = existingPlaylists.findIndex(
    (p) => p.id === playlist.id
  );

  if (existingIndex !== -1) {
    existingPlaylists[existingIndex] = playlist;
  } else {
    existingPlaylists.push(playlist);
  }

  localStorage.setItem(
    "soundscapePlaylists",
    JSON.stringify(existingPlaylists)
  );
  return playlist;
};

export const getPlaylists = () => {
  return JSON.parse(localStorage.getItem("soundscapePlaylists") || "[]");
};

export const deletePlaylist = (playlistName) => {
  const playlists = getPlaylists();
  const filteredPlaylists = playlists.filter((p) => p.name !== playlistName);
  localStorage.setItem(
    "soundscapePlaylists",
    JSON.stringify(filteredPlaylists)
  );
};

export { soundscapes };
