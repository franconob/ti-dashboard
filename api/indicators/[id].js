import { generateIndicators } from '../_data.js';

const indicators = generateIndicators(500);

export default function handler(req, res) {
  const { id } = req.query;
  const indicator = indicators.find((i) => i.id === id);

  if (!indicator) {
    return res.status(404).json({ error: 'Indicator not found' });
  }

  res.json(indicator);
}
