// Generate customer ID based on city name
// Format: XX123456 (2 letters from city + 6 random digits)

export function getCityCode(address: string): string {
  if (!address) return 'XX';
  
  // Extract city name from address (assuming format includes city)
  const words = address.trim().split(/[\s,]+/);
  
  // Common German city mappings
  const cityMappings: { [key: string]: string } = {
    'warendorf': 'WD',
    'münster': 'MS',
    'berlin': 'BE',
    'hamburg': 'HH',
    'munich': 'MU',
    'münchen': 'MU',
    'cologne': 'CO',
    'köln': 'CO',
    'frankfurt': 'FR',
    'stuttgart': 'ST',
    'düsseldorf': 'DU',
    'dortmund': 'DO',
    'essen': 'ES',
    'leipzig': 'LE',
    'bremen': 'BR',
    'dresden': 'DR',
    'hannover': 'HA',
    'nuremberg': 'NU',
    'nürnberg': 'NU',
    'duisburg': 'DB',
    'bochum': 'BO',
    'wuppertal': 'WU',
    'bielefeld': 'BI',
    'bonn': 'BN',
    'mannheim': 'MA',
  };
  
  // Check if any word matches a known city
  for (const word of words) {
    const normalizedWord = word.toLowerCase().replace(/[^a-zäöüß]/g, '');
    if (cityMappings[normalizedWord]) {
      return cityMappings[normalizedWord];
    }
  }
  
  // If no match found, use first 2 letters of the first word
  const firstWord = words.find(w => w.length >= 2);
  if (firstWord) {
    return firstWord.substring(0, 2).toUpperCase().replace(/[^A-Z]/g, 'X');
  }
  
  return 'XX';
}

export function generateCustomerId(address: string): string {
  const cityCode = getCityCode(address);
  const randomDigits = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
  return `${cityCode}${randomDigits}`;
}
