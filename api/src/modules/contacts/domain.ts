import { createHash } from 'node:crypto';
import {
  CONTACT_GENDERS,
  CONTACT_TAGS,
  type ContactGender,
  type ContactTagCode,
} from '../../contracts/contact-directory.js';

export interface NormalizedContactRequest {
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  birthDate: string | null;
  gender: ContactGender | null;
  notes: string | null;
  tags: ContactTagCode[];
}

const keys = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'birthDate',
  'gender',
  'notes',
  'tags',
] as const;
const controls = /\p{Cc}/u;
const normalizeText = (value: unknown, max: number, collapse = false) => {
  if (value == null || typeof value !== 'string')
    return value == null ? null : undefined;
  const normalized = collapse
    ? value.trim().replace(/\p{White_Space}+/gu, ' ')
    : value.trim();
  return normalized.length <= max && !controls.test(normalized)
    ? normalized || null
    : undefined;
};

export function normalizeContactRequest(
  value: unknown,
  today: Date,
): NormalizedContactRequest | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const body = value as Record<string, unknown>;
  if (
    Object.keys(body).some(
      (key) => !keys.includes(key as (typeof keys)[number]),
    )
  )
    return null;
  const firstName = normalizeText(body.firstName, 80, true);
  const lastName = normalizeText(body.lastName, 80, true);
  const rawEmail = normalizeText(body.email, 254);
  const rawPhone = normalizeText(body.phone, 16);
  const notes = normalizeText(body.notes, 4000);
  if (
    typeof firstName !== 'string' ||
    typeof lastName !== 'string' ||
    rawEmail === undefined ||
    rawPhone === undefined ||
    notes === undefined
  )
    return null;
  const email = rawEmail?.toLowerCase() ?? null;
  if (email && !/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/u.test(email)) return null;
  const phone =
    rawPhone && /^\d{10}$/.test(rawPhone) ? `+1${rawPhone}` : rawPhone;
  if (phone && !/^\+\d{8,15}$/.test(phone)) return null;
  if (!email && !phone) return null;
  const birthDate = normalizeText(body.birthDate, 10);
  if (birthDate === undefined) return null;
  if (birthDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return null;
    const parsed = new Date(`${birthDate}T00:00:00.000Z`);
    if (
      Number.isNaN(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== birthDate ||
      birthDate < '1900-01-01' ||
      birthDate > today.toISOString().slice(0, 10)
    )
      return null;
  }
  const gender = normalizeText(body.gender, 32);
  if (
    gender === undefined ||
    (gender !== null && !CONTACT_GENDERS.includes(gender as ContactGender))
  )
    return null;
  const rawTags = body.tags == null ? [] : body.tags;
  if (!Array.isArray(rawTags) || rawTags.some((tag) => typeof tag !== 'string'))
    return null;
  const requested = new Set(rawTags.map((tag) => tag.trim().toLowerCase()));
  if (
    requested.size > 3 ||
    [...requested].some((tag) => !CONTACT_TAGS.includes(tag as ContactTagCode))
  )
    return null;
  return {
    firstName,
    lastName,
    email,
    phone,
    birthDate,
    gender: gender as ContactGender | null,
    notes,
    tags: CONTACT_TAGS.filter((tag) => requested.has(tag)),
  };
}

export const canonicalContactPayload = (value: NormalizedContactRequest) =>
  JSON.stringify({
    firstName: value.firstName,
    lastName: value.lastName,
    email: value.email,
    phone: value.phone,
    birthDate: value.birthDate,
    gender: value.gender,
    notes: value.notes,
    tags: value.tags,
  });

export const contactPayloadHash = (value: NormalizedContactRequest) =>
  createHash('sha256').update(canonicalContactPayload(value)).digest('hex');
