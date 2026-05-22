const express = require('express');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const MEMORY = {
  started: new Date().toISOString(),
  requests: 0,
  subscriptions: [],
  tickets: []
};

app.use((req, res, next) => {
  MEMORY.requests++;
  next();
});

app.get('/health', async (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Lucy Ω',
    uptime_requests: MEMORY.requests,
    started: MEMORY.started,
    now: new Date().toISOString()
  });
});

app.get('/lucy', async (req, res) => {
  const ref = req.query.ref || 'direct';

  res.json({
    status: 'live',
    referral_link: `https://experience-lucy.online/?ref=${ref}`,
    ref,
    realtime: true,
    timestamp: new Date().toISOString()
  });
});

app.post('/subscribe', async (req, res) => {
  const body = req.body || {};

  MEMORY.subscriptions.push({
    ...body,
    created: new Date().toISOString()
  });

  res.json({
    success: true,
    subscribed: body.email || 'unknown',
    total_subscriptions: MEMORY.subscriptions.length
  });
});

app.post('/ticket', async (req, res) => {
  const body = req.body || {};

  const ticket = {
    id: `TKT-${Math.random().toString(36).substring(2,8).toUpperCase()}`,
    created: new Date().toISOString(),
    ...body
  };

  MEMORY.tickets.push(ticket);

  res.json({
    success: true,
    ticket
  });
});

app.get('/memory', async (req, res) => {
  res.json(MEMORY);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Lucy Ω production server running on port ${PORT}`);
});
