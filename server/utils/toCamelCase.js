const toCamelCase = (str) => {
  return str.replace(/([-_]\w)/g, (match) => match[1].toUpperCase());
};

export const toCamelCaseDeep = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCaseDeep(v));
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        toCamelCase(key),
        toCamelCaseDeep(value),
      ])
    );
  }
  return obj;
};
