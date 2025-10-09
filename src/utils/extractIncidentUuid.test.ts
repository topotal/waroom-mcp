import { describe, it, expect } from '@jest/globals';
import { extractIncidentUuid } from './extractIncidentUuid.js';

describe('extractIncidentUuid', () => {
  it('UUID をそのまま返す', () => {
    const uuid = '12345678-1234-1234-1234-123456789abc';
    expect(extractIncidentUuid(uuid)).toBe(uuid);
  });

  it('完全な Waroom URL から UUID を抽出', () => {
    const url = 'https://app.waroom.com/incidents/12345678-1234-1234-1234-123456789abc';
    expect(extractIncidentUuid(url)).toBe('12345678-1234-1234-1234-123456789abc');
  });

  it('パス部分だけの URL から UUID を抽出', () => {
    const url = '/incidents/12345678-1234-1234-1234-123456789abc';
    expect(extractIncidentUuid(url)).toBe('12345678-1234-1234-1234-123456789abc');
  });

  it('クエリパラメータ付き URL から UUID を抽出', () => {
    const url =
      'https://app.waroom.com/incidents/12345678-1234-1234-1234-123456789abc?tab=details';
    expect(extractIncidentUuid(url)).toBe('12345678-1234-1234-1234-123456789abc');
  });

  it('大文字の UUID を含む URL から抽出', () => {
    const url = 'https://app.waroom.com/incidents/12345678-1234-1234-1234-123456789ABC';
    expect(extractIncidentUuid(url)).toBe('12345678-1234-1234-1234-123456789ABC');
  });

  it('大文字の UUID をそのまま返す', () => {
    const uuid = '12345678-1234-1234-1234-123456789ABC';
    expect(extractIncidentUuid(uuid)).toBe(uuid);
  });

  it('マッチしない文字列はそのまま返す', () => {
    const input = 'not-a-valid-uuid';
    expect(extractIncidentUuid(input)).toBe(input);
  });
});
