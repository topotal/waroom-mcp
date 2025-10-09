/**
 * URL からインシデント UUID を抽出する関数
 * @param input インシデント UUID または URL
 * @returns インシデント UUID
 */
export const extractIncidentUuid = (input: string): string => {
  // URL の場合は UUID 部分を抽出
  const urlMatch = input.match(
    /\/incidents\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
  );
  if (urlMatch) {
    return urlMatch[1];
  }
  // UUID の場合はそのまま返す
  return input;
};
