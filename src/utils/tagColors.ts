type TagColor = 'red' | 'blue' | 'purple' | 'teal' | 'gray';

const TAG_MAP: Record<string, TagColor> = {
  // Red — destructive / malicious
  'tor-exit': 'red',
  'botnet': 'red',
  'malware': 'red',
  'ransomware': 'red',
  'ddos': 'red',
  'trojan': 'red',
  'rootkit': 'red',
  'exploit': 'red',
  'worm': 'red',

  // Blue — reconnaissance / scanning
  'scanner': 'blue',
  'brute-force': 'blue',
  'ssh-attack': 'blue',
  'smtp-spam': 'blue',
  'credential': 'blue',

  // Purple — infrastructure / tooling
  'c2': 'purple',
  'dropper': 'purple',
  'backdoor': 'purple',
  'rat': 'purple',
  'infostealer': 'purple',
  'exploit-kit': 'purple',

  // Teal — deception / social engineering
  'phishing': 'teal',
  'typosquat': 'teal',
  'dga': 'teal',
  'fast-flux': 'teal',
  'drive-by': 'teal',
  'watering-hole': 'teal',
  'redirect': 'teal',
  'scam': 'teal',

  // Gray — informational / passive
  'proxy': 'gray',
  'vpn': 'gray',
  'mining': 'gray',
  'cryptominer': 'gray',
  'sinkhole': 'gray',
  'parking': 'gray',
  'payload': 'gray',
};

export function getTagColor(tag: string): TagColor {
  return TAG_MAP[tag] ?? 'gray';
}
