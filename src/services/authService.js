const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const config = require('../config');
const db = require('../db/mysql');

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

async function login(payload) {
  const { email, password } = loginSchema.parse(payload);

  const [rows] = await db.query(
    'SELECT id, email, password_hash, role, full_name FROM users WHERE email = ? LIMIT 1',
    [email]
  );

  const user = rows[0];
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const passwordOk = await bcrypt.compare(password, user.password_hash);
  if (!passwordOk) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { sub: user.id, role: user.role, email: user.email, fullName: user.full_name },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name
    }
  };
}

module.exports = { login };
