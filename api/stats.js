import { generateIndicators } from './_data.js';

const indicators = generateIndicators(500);

export default function handler(_req, res) {
  const stats = {
    total: indicators.length,
    critical: indicators.filter((i) => i.severity === 'critical').length,
    high: indicators.filter((i) => i.severity === 'high').length,
    medium: indicators.filter((i) => i.severity === 'medium').length,
    low: indicators.filter((i) => i.severity === 'low').length,
    byType: {
      ip: indicators.filter((i) => i.type === 'ip').length,
      domain: indicators.filter((i) => i.type === 'domain').length,
      hash: indicators.filter((i) => i.type === 'hash').length,
      url: indicators.filter((i) => i.type === 'url').length,
    },
  };
  res.json(stats);
}
