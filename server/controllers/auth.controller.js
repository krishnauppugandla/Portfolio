const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// TODO: this Map grows forever if someone hammers the endpoint from tons of IPs.
// Fine for a personal portfolio, but worth switching to Redis if this ever scales.
// TODO: this Map grows forever if someone hammers from tons of IPs.
// Fine for a personal portfolio, but worth switching to Redis if this ever scales.
const loginAttempts = new Map();

const login = async (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip;
  const key = `${ip}:${username}`;

  const attempts = loginAttempts.get(key) || { count: 0, lockedUntil: null };

  if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
    const secs = Math.ceil((attempts.lockedUntil - Date.now()) / 1000);
    return res.status(429).json({ error: `Too many attempts. Try again in ${secs}s.` });
  }

  if (
    username !== process.env.ADMIN_USERNAME ||
    !(await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH))
  ) {
    attempts.count += 1;
    if (attempts.count >= 5) {
      attempts.lockedUntil = Date.now() + 60 * 1000;
      attempts.count = 0;
    }
    loginAttempts.set(key, attempts);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  loginAttempts.delete(key);

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
};

const verify = (req, res) => {
  res.json({ valid: true, username: req.admin.username });
};

module.exports = { login, verify };
