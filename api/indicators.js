import { generateIndicators } from './_data.js';

const indicators = generateIndicators(500);

export default function handler(req, res) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const severity = req.query.severity?.toLowerCase();
  const type = req.query.type?.toLowerCase();
  const search = req.query.search?.toLowerCase();
  const source = req.query.source?.toLowerCase();

  let filtered = [...indicators];

  if (severity && ['critical', 'high', 'medium', 'low'].includes(severity)) {
    filtered = filtered.filter((i) => i.severity === severity);
  }

  if (type && ['ip', 'domain', 'hash', 'url'].includes(type)) {
    filtered = filtered.filter((i) => i.type === type);
  }

  if (source) {
    filtered = filtered.filter((i) => i.source.toLowerCase() === source);
  }

  if (search) {
    filtered = filtered.filter(
      (i) =>
        i.value.toLowerCase().includes(search) ||
        i.source.toLowerCase().includes(search) ||
        i.tags.some((t) => t.toLowerCase().includes(search))
    );
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  res.json({ data, total, page, totalPages });
}
