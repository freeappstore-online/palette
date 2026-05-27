/** 30 curated palettes for the Explore tab. */

export interface CuratedPalette {
  name: string;
  colors: string[]; // hex without #
}

export const curatedPalettes: CuratedPalette[] = [
  { name: "Sunset", colors: ["ff6b35", "f7c59f", "efefd0", "004e89", "1a659e"] },
  { name: "Ocean", colors: ["05668d", "028090", "00a896", "02c39a", "f0f3bd"] },
  { name: "Forest", colors: ["2d6a4f", "40916c", "52b788", "74c69d", "b7e4c7"] },
  { name: "Candy", colors: ["ff006e", "fb5607", "ff006e", "8338ec", "3a86ff"] },
  { name: "Neon", colors: ["ff00ff", "00ffff", "39ff14", "ff3131", "ffff00"] },
  { name: "Pastel", colors: ["ffd6ff", "e7c6ff", "c8b6ff", "b8c0ff", "bbd0ff"] },
  { name: "Earth", colors: ["5f0f40", "9a031e", "cb793a", "e6c229", "0f4c5c"] },
  { name: "Midnight", colors: ["10002b", "240046", "3c096c", "5a189a", "7b2cbf"] },
  { name: "Autumn", colors: ["582f0e", "7f4f24", "936639", "a68a64", "b6ad90"] },
  { name: "Cherry Blossom", colors: ["ffccd5", "ffb3c1", "ff8fa3", "ff758f", "ff4d6d"] },
  { name: "Nordic", colors: ["264653", "2a9d8f", "e9c46a", "f4a261", "e76f51"] },
  { name: "Cyberpunk", colors: ["0d0221", "0f084b", "26408b", "a6cfd5", "c2e7d9"] },
  { name: "Lavender", colors: ["e0aaff", "c77dff", "9d4edd", "7b2cbf", "5a189a"] },
  { name: "Coral Reef", colors: ["ff9f1c", "ffbf69", "ffffff", "cbf3f0", "2ec4b6"] },
  { name: "Vintage", colors: ["6b705c", "a5a58d", "b7b7a4", "ffe8d6", "ddbea9"] },
  { name: "Mint", colors: ["d8f3dc", "b7e4c7", "95d5b2", "74c69d", "52b788"] },
  { name: "Fire", colors: ["370617", "6a040f", "9d0208", "d00000", "e85d04"] },
  { name: "Ice", colors: ["caf0f8", "ade8f4", "90e0ef", "48cae4", "00b4d8"] },
  { name: "Terracotta", colors: ["bb9457", "99582a", "6f1d1b", "432818", "ffe6a7"] },
  { name: "Sapphire", colors: ["03045e", "023e8a", "0077b6", "0096c7", "00b4d8"] },
  { name: "Blush", colors: ["ffcdb2", "ffb4a2", "e5989b", "b5838d", "6d6875"] },
  { name: "Jungle", colors: ["004b23", "006400", "007200", "008000", "38b000"] },
  { name: "Peach", colors: ["fec89a", "ffd7ba", "ffe5d9", "ffe8d6", "d8e2dc"] },
  { name: "Stormy", colors: ["495057", "6c757d", "adb5bd", "ced4da", "dee2e6"] },
  { name: "Royal", colors: ["3f0d12", "602437", "a13d63", "d93a96", "e30b5c"] },
  { name: "Meadow", colors: ["606c38", "283618", "fefae0", "dda15e", "bc6c25"] },
  { name: "Cotton Candy", colors: ["f72585", "b5179e", "7209b7", "560bad", "480ca8"] },
  { name: "Desert", colors: ["edede9", "d6ccc2", "f5ebe0", "d5bdaf", "e3d5ca"] },
  { name: "Aurora", colors: ["2b2d42", "8d99ae", "edf2f4", "ef233c", "d90429"] },
  { name: "Tropical", colors: ["006d77", "83c5be", "edf6f9", "ffddd2", "e29578"] },
];
