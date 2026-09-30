import assert from 'node:assert/strict';
import test from 'node:test';
import { getParentBusinessGroup, isAmbiguousBusinessSubcategory, selectCategoryForGroup } from './categoryRouting.js';

test('resolves duplicate Furniture Shops subcategories using their explicit parent', () => {
  assert.equal(getParentBusinessGroup({ categoryGroup: 'Shopping & Retail', subcategory: 'Furniture Shops' }), 'shopping retail');
  assert.equal(getParentBusinessGroup({ categoryGroup: 'Real Estate & Construction', subcategory: 'Furniture Shops' }), 'real estate construction');
});

test('does not guess a parent from ambiguous legacy businessGroup values', () => {
  const place = { businessGroup: 'Shopping & Retail', subcategory: 'Furniture Shops' };
  assert.equal(isAmbiguousBusinessSubcategory(place), true);
  assert.equal(getParentBusinessGroup(place), '');
});

test('retains unambiguous legacy business groups', () => {
  assert.equal(getParentBusinessGroup({ businessGroup: 'Shopping & Retail', subcategory: 'Boutique' }), 'shopping retail');
});

test('selects a duplicate subcategory by parent ID and falls back to the selected parent', () => {
  const categories = [
    { _id: 'food', name: 'Food & Dining' },
    { _id: 'wedding', name: 'Marriage & Wedding' },
    { _id: 'shopping', name: 'Shopping & Retail' },
    { _id: 'real-estate', name: 'Real Estate & Construction' },
    { _id: 'catering', name: 'Catering Services', group: 'Marriage & Wedding', parent: { _id: 'food', name: 'Food & Dining' } },
    { _id: 'furniture', name: 'Furniture Shops', group: 'Real Estate & Construction', parent: null },
  ];

  assert.equal(selectCategoryForGroup(categories, 'Food & Dining', 'Catering Services')?._id, 'catering');
  assert.equal(selectCategoryForGroup(categories, 'Marriage & Wedding', 'Catering Services')?._id, 'wedding');
  assert.equal(selectCategoryForGroup(categories, 'Real Estate & Construction', 'Furniture Shops')?._id, 'furniture');
  assert.equal(selectCategoryForGroup(categories, 'Shopping & Retail', 'Furniture Shops')?._id, 'shopping');
  assert.equal(selectCategoryForGroup(categories.filter((category) => category.name !== 'Shopping & Retail'), 'Shopping & Retail', 'Furniture Shops')?._id, 'furniture');
  assert.equal(selectCategoryForGroup(categories.filter((category) => category.name !== 'Marriage & Wedding'), 'Marriage & Wedding', 'Catering Services')?._id, 'catering');
});