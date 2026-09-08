import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  canonicalContactPayload,
  contactPayloadHash,
  normalizeContactRequest,
} from '../src/modules/contacts/domain.js';

const today = new Date('2026-09-08T23:59:59.999Z');
const valid = { firstName: 'Ada', lastName: 'Test', email: 'a@b.example' };

describe('contact intake normalization', () => {
  it('retains every normalized field and hashes the exact ordered JSON bytes', () => {
    const value = normalizeContactRequest(
      {
        firstName: '  Ada\u2003Mae ',
        lastName: ' Lovelace ',
        email: ' ADA@EXAMPLE.COM ',
        phone: '2025550199',
        birthDate: '1900-01-01',
        gender: 'female',
        notes: '  Synthetic note  ',
        tags: ['client', ' NEW_LEAD ', 'client'],
      },
      today,
    );

    expect(value).toEqual({
      firstName: 'Ada Mae',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      phone: '+12025550199',
      birthDate: '1900-01-01',
      gender: 'female',
      notes: 'Synthetic note',
      tags: ['new_lead', 'client'],
    });
    if (!value) throw new Error('Expected normalized contact');
    const canonical = canonicalContactPayload(value);
    expect(canonical).toBe(
      '{"firstName":"Ada Mae","lastName":"Lovelace","email":"ada@example.com","phone":"+12025550199","birthDate":"1900-01-01","gender":"female","notes":"Synthetic note","tags":["new_lead","client"]}',
    );
    const independentlyDerivedHash = createHash('sha256')
      .update(Buffer.from(canonical, 'utf8'))
      .digest('hex');
    expect(independentlyDerivedHash).toBe(
      '9abe626e0dd73db80a90d02316541219c8cef9671eae720549520fd15459e2b4',
    );
    expect(contactPayloadHash(value)).toBe(independentlyDerivedHash);
  });

  it.each([
    ['blank first name', { ...valid, firstName: ' ' }],
    ['missing last name', { firstName: 'Ada', email: valid.email }],
    ['81-character name', { ...valid, firstName: 'A'.repeat(81) }],
    ['control in name', { ...valid, lastName: 'Te\u0000st' }],
  ])('rejects %s', (_case, body) => {
    expect(normalizeContactRequest(body, today)).toBeNull();
  });

  it('accepts 80-character names and collapses Unicode whitespace', () => {
    expect(
      normalizeContactRequest(
        { ...valid, firstName: 'A'.repeat(80), lastName: 'Test\t Name' },
        today,
      ),
    ).toMatchObject({ firstName: 'A'.repeat(80), lastName: 'Test Name' });
  });

  it.each([
    [
      'trimmed lowercase email',
      { ...valid, email: ' ADA@B.EXAMPLE ' },
      'ada@b.example',
    ],
    [
      '254-character email',
      { ...valid, email: `${'a'.repeat(244)}@b.example` },
      `${'a'.repeat(244)}@b.example`,
    ],
    [
      'ten-digit phone',
      { ...valid, email: null, phone: '2025550199' },
      '+12025550199',
    ],
    [
      'short international phone',
      { ...valid, email: null, phone: '+12345678' },
      '+12345678',
    ],
    [
      'long international phone',
      { ...valid, email: null, phone: `+${'1'.repeat(15)}` },
      `+${'1'.repeat(15)}`,
    ],
  ])('normalizes %s', (_case, body, expected) => {
    const result = normalizeContactRequest(body, today);
    expect(result?.email ?? result?.phone).toBe(expected);
  });

  it.each([
    ['missing channels', { firstName: 'Ada', lastName: 'Test' }],
    ['missing at sign', { ...valid, email: 'ab.example' }],
    ['undotted domain', { ...valid, email: 'a@localhost' }],
    ['two at signs', { ...valid, email: 'a@@b.example' }],
    [
      '255-character email',
      { ...valid, email: `${'a'.repeat(245)}@b.example` },
    ],
    ['short phone', { ...valid, email: null, phone: '+1234567' }],
    ['long phone', { ...valid, email: null, phone: `+${'1'.repeat(16)}` }],
    ['numeric phone', { ...valid, email: null, phone: 2025550199 }],
  ])('rejects %s', (_case, body) => {
    expect(normalizeContactRequest(body, today)).toBeNull();
  });

  it('normalizes omitted, null, and blank optional values', () => {
    expect(normalizeContactRequest(valid, today)).toEqual({
      firstName: 'Ada',
      lastName: 'Test',
      email: 'a@b.example',
      phone: null,
      birthDate: null,
      gender: null,
      notes: null,
      tags: [],
    });
    expect(
      normalizeContactRequest(
        {
          ...valid,
          phone: null,
          birthDate: ' ',
          gender: ' ',
          notes: ' ',
          tags: null,
        },
        today,
      ),
    ).toMatchObject({
      phone: null,
      birthDate: null,
      gender: null,
      notes: null,
      tags: [],
    });
  });

  it.each([
    ['numeric notes', { ...valid, notes: 1 }],
    ['long notes', { ...valid, notes: 'N'.repeat(4001) }],
    ['control in notes', { ...valid, notes: 'note\u0000' }],
    ['numeric birth date', { ...valid, birthDate: 20260908 }],
    ['numeric gender', { ...valid, gender: 1 }],
    ['scalar tags', { ...valid, tags: 'client' }],
  ])('rejects unsupported optional value: %s', (_case, body) => {
    expect(normalizeContactRequest(body, today)).toBeNull();
  });

  it.each(['1900-01-01', '2000-02-29', '2026-09-08'])(
    'accepts real in-range birth date %s',
    (birthDate) => {
      expect(
        normalizeContactRequest({ ...valid, birthDate }, today)?.birthDate,
      ).toBe(birthDate);
    },
  );

  it.each(['1899-12-31', '1900-02-29', '2026-02-30', '2026-09-09'])(
    'rejects out-of-range or unreal birth date %s',
    (birthDate) => {
      expect(
        normalizeContactRequest({ ...valid, birthDate }, today),
      ).toBeNull();
    },
  );

  it.each(['female', 'male', 'non_binary', 'prefer_not_to_say'])(
    'accepts gender %s',
    (gender) => {
      expect(normalizeContactRequest({ ...valid, gender }, today)?.gender).toBe(
        gender,
      );
    },
  );

  it('canonicalizes tags in catalog order and rejects unsupported tags', () => {
    expect(
      normalizeContactRequest(
        { ...valid, tags: [' CLIENT ', 'follow_up', 'new_lead', 'client'] },
        today,
      )?.tags,
    ).toEqual(['new_lead', 'follow_up', 'client']);
    expect(
      normalizeContactRequest({ ...valid, tags: ['vip'] }, today),
    ).toBeNull();
    expect(
      normalizeContactRequest({ ...valid, tags: ['client', 1] }, today),
    ).toBeNull();
  });

  it.each([null, [], 'text', { ...valid, extra: true }])(
    'rejects non-request input %#',
    (body) => {
      expect(normalizeContactRequest(body, today)).toBeNull();
    },
  );
});
