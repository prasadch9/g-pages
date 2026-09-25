import { CATEGORY_GROUPS } from '../../data/categoryGroups';

const normalize = (value) => String(value || '').trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');

export const BUSINESS_GROUPS = CATEGORY_GROUPS;

export const findCategoryByName = (categories, name) => {
  const target = normalize(name);
  return categories.find((category) => normalize(category.name) === target || normalize(category.slug) === target);
};

export const getGroupForCategoryName = (name) => BUSINESS_GROUPS.find((group) => group.children.some((child) => normalize(child) === normalize(name)));

export const getGroupForPlace = (place) => {
  const name = place?.subcategory?.name || place?.subcategory?.slug || place?.category?.name || place?.category?.slug;
  return getGroupForCategoryName(name);
};

export const getSubcategoriesForGroup = (categories, group) => {
  if (!group) return [];
  return group.children.map((name) => findCategoryByName(categories, name)).filter(Boolean);
};

export const getStoredCategoryValues = (categories, group, subcategoryName) => {
  const parent = findCategoryByName(categories, group?.name);
  const child = findCategoryByName(categories, subcategoryName);
  if (parent && child && String(child.parent?._id || child.parent) === String(parent._id)) {
    return { category: parent, subcategory: child };
  }
  return { category: child || parent, subcategory: null };
};

export const getBusinessType = (categoryName, subcategoryName) => {
  const name = normalize(subcategoryName || categoryName);
  const types = {
    restaurant: 'restaurant',
    restaurants: 'restaurant',
    'coffee shops': 'coffee-shop',
    'sweet shops & bakery': 'bakery',
    'catering services': 'catering',
    'food processing': 'food-processing',
  };
  return types[name] || `category-${name.replace(/\s+/g, '-')}`;
};

export const getBusinessForm = (groupName) => {
  const group = BUSINESS_GROUPS.find((item) => item.name === groupName);
  return group ? group.name : null;
};
