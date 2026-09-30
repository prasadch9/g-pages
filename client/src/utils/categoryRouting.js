const normalize = (value) => String(value?.name || value?.slug || value || '')
  .trim()
  .toLowerCase()
  .replace(/\band\b/g, ' ')
  .replace(/[_&-]+/g, ' ')
  .replace(/\s+/g, ' ');

const ambiguousSubcategories = new Set(['furniture shops', 'catering services', 'food processing']);

export const selectCategoryForGroup = (categories, groupName, subcategoryName) => {
  const normalizedGroup = normalize(groupName);
  const normalizedSubcategory = normalize(subcategoryName);
  const groupCategory = categories.find((category) => normalize(category.name) === normalizedGroup);
  const subcategoryMatches = categories.filter((category) => normalize(category.name) === normalizedSubcategory);
  if (!normalizedGroup) return subcategoryMatches[0] || null;

  const groupId = String(groupCategory?._id || '');
  const matchingParent = subcategoryMatches.find((category) => {
    const parentId = String(category.parent?._id || category.parent || '');
    const parentName = normalize(category.parent?.name || category.parent?.slug || '');
    return (groupId && parentId === groupId) || parentName === normalizedGroup;
  });
  if (matchingParent) return matchingParent;

  const unparentedGroupMatch = subcategoryMatches.find((category) => (
    !category.parent && normalize(category.group) === normalizedGroup
  ));
  return unparentedGroupMatch || groupCategory || subcategoryMatches[0] || null;
};

export const isAmbiguousBusinessSubcategory = (place) => ambiguousSubcategories.has(normalize(
  place?.subcategory?.name
    || place?.subcategory?.slug
    || place?.subcategory
    || place?.attributes?.subCategory
    || place?.category?.name
    || place?.category?.slug,
));

export const getParentBusinessGroup = (place) => {
  const explicitGroup = place?.categoryGroup
    || place?.category?.group
    || place?.category?.parent?.name
    || place?.category?.parent?.slug
    || place?.subcategory?.parent?.name
    || place?.subcategory?.parent?.slug;
  if (explicitGroup) return normalize(explicitGroup);
  if (isAmbiguousBusinessSubcategory(place)) return '';
  return normalize(place?.businessGroup);
};