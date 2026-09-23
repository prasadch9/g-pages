const HEALTHCARE_CATEGORY_NAMES = new Set([
  'hospitals',
  'multispeciality hospitals',
  'cardiology',
  'ent',
  'dental',
  'hearing solutions',
  'fitness centres',
]);

const normalizeText = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    return normalizeText(value.name || value.slug || value.label || '');
  }
  return String(value).trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
};

const getTaxonomyValues = (value) => {
  if (!value) return [];
  if (typeof value === 'object') {
    return [value.name, value.slug, value.label].map(normalizeText).filter(Boolean);
  }
  return [normalizeText(value)].filter(Boolean);
};

export function getHealthcareSubcategory(place) {
  const values = [place?.subcategory, place?.category]
    .flatMap(getTaxonomyValues);
  return values.find((value) => HEALTHCARE_CATEGORY_NAMES.has(value)) || '';
}

export function isHealthcareBusiness(place) {
  if (!place) return false;

  const taxonomyValues = [
    ...getTaxonomyValues(place.category),
    ...getTaxonomyValues(place.subcategory),
  ];

  return taxonomyValues.some((value) => HEALTHCARE_CATEGORY_NAMES.has(value));
}

export function getLocationText(value) {
  if (!value) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'object') return getLocationText(value.name || value.label || value.slug || '');
  return String(value).trim();
}

export function getWebsiteUrl(value) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function getWhatsAppUrl(value) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : null;
}

export function normalizeList(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.filter((item) => item !== null && item !== undefined && String(item).trim()).map((item) => String(item).trim());
  }

  if (typeof value === 'string') {
    return value
      .split(/\n|,/) 
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function getPlainDescription(value) {
  if (!value) return '';
  return String(value).trim();
}

export default {
  isHealthcareBusiness,
  getHealthcareSubcategory,
  getLocationText,
  getWebsiteUrl,
  getWhatsAppUrl,
  normalizeList,
  getPlainDescription,
};
