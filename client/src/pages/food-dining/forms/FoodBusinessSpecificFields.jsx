import React from 'react';

const configs = {
  restaurant: {
    title: 'Restaurant details',
    fields: [['cuisineType', 'Cuisine Type'], ['foodType', 'Food Type'], ['priceRange', 'Price Range'], ['establishedYear', 'Established Year'], ['fssaiLicenseNumber', 'FSSAI License Number (optional)']],
    facilities: ['Dine-in', 'Takeaway', 'Delivery', 'Online Ordering', 'Table Reservation', 'Party Hall', 'Birthday Parties', 'Catering', 'Parking', 'AC', 'Wi-Fi', 'Family Dining', 'Outdoor Dining', 'Private Dining', 'Kids Area', 'Live Kitchen'],
    services: ['Takeaway', 'Delivery', 'Online Ordering', 'Table Reservation', 'Catering'],
    itemTitle: 'Menu Items', itemName: 'Dish Name', offers: true,
  },
  'coffee-shop': {
    title: 'Coffee Shop details',
    fields: [['coffeeTypes', 'Coffee Types'], ['beverages', 'Beverages'], ['tea', 'Tea'], ['snacks', 'Snacks'], ['desserts', 'Desserts'], ['signatureDrinks', 'Signature Drinks']],
    facilities: ['Wi-Fi', 'Charging', 'AC', 'Parking', 'Pet Friendly', 'Work/Study Friendly'],
    seating: ['Indoor Seating', 'Outdoor Seating', 'Private Seating'],
    services: ['Takeaway', 'Delivery', 'Online Ordering'],
    itemTitle: 'Coffee Menu', itemName: 'Item Name', offers: true,
  },
  bakery: {
    title: 'Bakery details',
    fields: [['shopType', 'Shop Type'], ['sweets', 'Sweets'], ['cakes', 'Cakes'], ['bakeryItems', 'Bakery Items'], ['pastries', 'Pastries'], ['snacks', 'Snacks'], ['specialItems', 'Special Items'], ['seasonalProducts', 'Seasonal Products']],
    services: ['Online Orders', 'Delivery', 'Takeaway', 'Custom Orders'],
    itemTitle: 'Products', itemName: 'Product Name', offers: true,
  },
  catering: {
    title: 'Catering Service details',
    fields: [['cateringServices', 'Catering Services'], ['cuisineTypes', 'Cuisine Types'], ['eventTypes', 'Event Types'], ['serviceArea', 'Service Areas'], ['guestCapacityMin', 'Minimum Guests'], ['guestCapacityMax', 'Maximum Guests']],
    services: ['Wedding Catering', 'Corporate Catering', 'Party Catering', 'Outdoor / Event Catering', 'Buffet', 'Live Counters', 'Traditional Catering'],
    itemTitle: 'Catering Menu', itemName: 'Menu Name', offers: true,
  },
  'food-processing': {
    title: 'Food Processing details',
    fields: [['industryType', 'Industry Type'], ['products', 'Products'], ['productCategories', 'Product Categories'], ['processingTypes', 'Processing Types'], ['manufacturingInformation', 'Manufacturing Information'], ['productionCapacity', 'Production Capacity'], ['certifications', 'Certifications'], ['qualityStandards', 'Quality Standards'], ['distribution', 'Distribution'], ['serviceAreas', 'Service Areas']],
    services: ['Wholesale', 'Distribution', 'Private Label', 'Bulk Orders'],
    itemTitle: 'Products', itemName: 'Product Name', offers: false,
  },
};

const inputClass = 'mt-1 w-full rounded-lg border border-[#e7dcd7] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#a83f32]';
const split = (value) => Array.isArray(value) ? value : String(value || '').split(/\n|,/).map((item) => item.trim()).filter(Boolean);

function ChoiceGroup({ title, options, values = [], onChange }) {
  if (!options?.length) return null;
  return <fieldset><legend className="text-sm font-semibold text-[#4b3d3b]">{title}</legend><div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{options.map((option) => <label key={option} className="flex items-center gap-2 rounded-lg border border-[#ebded8] bg-[#fffaf8] px-3 py-2 text-sm"><input type="checkbox" checked={values.includes(option)} onChange={() => onChange(values.includes(option) ? values.filter((value) => value !== option) : [...values, option])} />{option}</label>)}</div></fieldset>;
}

function ListEditor({ title, nameLabel, items = [], onChange }) {
  const update = (index, key, value) => onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  return <div><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-semibold text-[#4b3d3b]">{title}</h3><button type="button" onClick={() => onChange([...items, { name: '', category: '', description: '', price: '', dietary: '' }])} className="rounded-lg bg-[#a83f32] px-3 py-2 text-xs font-semibold text-white">+ Add {nameLabel}</button></div>{items.map((item, index) => <div key={`item-${index}`} className="mt-3 grid gap-3 rounded-lg border border-[#ebded8] bg-[#fffaf8] p-3 sm:grid-cols-2">{[[ 'name', nameLabel ], ['category', 'Category'], ['price', 'Price'], ['dietary', 'Veg / Non-Veg / Both']].map(([key, label]) => <label key={key} className="text-sm text-[#4b3d3b]">{label}<input value={item[key] || ''} onChange={(event) => update(index, key, event.target.value)} className={inputClass} /></label>)}<label className="text-sm text-[#4b3d3b] sm:col-span-2">Description<textarea rows={2} value={item.description || ''} onChange={(event) => update(index, 'description', event.target.value)} className={inputClass} /></label><button type="button" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} className="text-left text-xs font-semibold text-red-600">Remove</button></div>)}</div>;
}

function OfferList({ offers = [], onChange }) {
  const update = (index, key, value) => onChange(offers.map((offer, offerIndex) => offerIndex === index ? { ...offer, [key]: value } : offer));
  return <div><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-semibold text-[#4b3d3b]">Special Offers</h3><button type="button" onClick={() => onChange([...offers, { title: '', description: '', validity: '', discount: '' }])} className="rounded-lg bg-[#a83f32] px-3 py-2 text-xs font-semibold text-white">+ Add Offer</button></div>{offers.map((offer, index) => <div key={`offer-${index}`} className="mt-3 grid gap-3 rounded-lg border border-[#ebded8] bg-[#fffaf8] p-3 sm:grid-cols-2">{[['title', 'Offer Title'], ['validity', 'Validity'], ['discount', 'Price / Discount']].map(([key, label]) => <label key={key} className="text-sm text-[#4b3d3b]">{label}<input value={offer[key] || ''} onChange={(event) => update(index, key, event.target.value)} className={inputClass} /></label>)}<label className="text-sm text-[#4b3d3b] sm:col-span-2">Description<textarea rows={2} value={offer.description || ''} onChange={(event) => update(index, 'description', event.target.value)} className={inputClass} /></label><button type="button" onClick={() => onChange(offers.filter((_, offerIndex) => offerIndex !== index))} className="text-left text-xs font-semibold text-red-600">Remove</button></div>)}</div>;
}

export default function FoodBusinessSpecificFields({ businessType, values = {}, onChange }) {
  const config = configs[businessType] || configs.restaurant;
  const setField = (key, value) => onChange({ ...values, [key]: value });
  const choices = (key, legacyKey) => Array.isArray(values[key]) ? values[key] : split(values[legacyKey]);
  return <section className="rounded-xl border border-[#f2d9d3] bg-[#fff7f4] p-5 sm:p-7">
    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a83f32]">{config.title}</p>
    <div className="mt-4 grid gap-4 sm:grid-cols-2">{config.fields.map(([key, label]) => <label key={key} className="text-sm font-medium text-[#4b3d3b]">{label}<textarea rows={2} value={Array.isArray(values[key]) ? values[key].join('\n') : values[key] || ''} onChange={(event) => setField(key, event.target.value)} className={inputClass} /></label>)}</div>
    <div className="mt-6 space-y-6">
      <ChoiceGroup title="Facilities" options={config.facilities} values={choices('infrastructure', 'facilities')} onChange={(items) => onChange({ ...values, facilities: items, infrastructure: items })} />
      <ChoiceGroup title="Seating Options" options={config.seating} values={choices('seating')} onChange={(items) => setField('seating', items)} />
      <ChoiceGroup title="Services" options={config.services} values={choices('services')} onChange={(items) => setField('services', items)} />
      {config.itemTitle && <ListEditor title={config.itemTitle} nameLabel={config.itemName} items={values.menuItems || values.productsList || []} onChange={(items) => setField('menuItems', items)} />}
      {config.offers && <OfferList offers={values.offers || values.specialOffersList || []} onChange={(items) => setField('offers', items)} />}
    </div>
  </section>;
}
