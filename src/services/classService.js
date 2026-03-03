const crypto = require('crypto');
const { z } = require('zod');
const db = require('../db/mysql');

const createClassSchema = z.object({
  title: z.string().min(3).max(190)
});

const joinByCodeSchema = z.object({
  code: z.string().min(6).max(16)
});

function generateJoinCode(length = 8) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const randomBytes = crypto.randomBytes(length);
  return Array.from(randomBytes)
    .map((byte) => alphabet[byte % alphabet.length])
    .join('');
}

async function createClass({ teacherId, payload }) {
  const { title } = createClassSchema.parse(payload);
  const joinCode = generateJoinCode(8);

  const [result] = await db.query(
    'INSERT INTO classes (teacher_id, title, join_code) VALUES (?, ?, ?)',
    [teacherId, title, joinCode]
  );

  return {
    id: result.insertId,
    teacherId,
    title,
    joinCode
  };
}

async function joinClassByCode({ studentId, payload }) {
  const { code } = joinByCodeSchema.parse(payload);

  const [classRows] = await db.query(
    'SELECT id, teacher_id, title, join_code FROM classes WHERE join_code = ? LIMIT 1',
    [code.toUpperCase()]
  );

  const classItem = classRows[0];
  if (!classItem) {
    throw new Error('Invalid class join code');
  }

  await db.query(
    'INSERT IGNORE INTO enrollments (class_id, student_id) VALUES (?, ?)',
    [classItem.id, studentId]
  );

  return {
    classId: classItem.id,
    classTitle: classItem.title,
    teacherId: classItem.teacher_id,
    joinCode: classItem.join_code
  };
}

module.exports = { createClass, joinClassByCode };
