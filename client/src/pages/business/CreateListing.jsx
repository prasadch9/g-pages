import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LocationCascadeFields from '../../components/LocationCascadeFields';

const initialLocation = { state: '', district: '', city: '', area: '' };

const defaultOpeningHours = {
  mon: { open: '', close: '', closed: false },
  tue: { open: '', close: '', closed: false },
  wed: { open: '', close: '', closed: false },
  thu: { open: '', close: '', closed: false },
  fri: { open: '', close: '', closed: false },
  sat: { open: '', close: '', closed: false },
  sun: { open: '', close: '', closed: false },
};

const splitList = (value = '') =>
  String(value)
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

const categoryTypeMap = {
  restaurants: 'restaurant',
  'coffee shops': 'coffee-shop',
  'sweet shops & bakery': 'bakery',
  'catering services': 'catering',
  'food processing': 'food-processing',
};

const foodDiningSubcategoryNames = [
  'Restaurants',
  'Coffee Shops',
  'Sweet Shops & Bakery',
  'Catering Services',
  'Food Processing',
];

const inputClass = 'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-ink/40';

export default function CreateListing({ foodDiningOnly = false, restaurantOnly = false }) {
  const isFoodDiningFlow = foodDiningOnly || restaurantOnly;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [location, setLocation] = useState(initialLocation);
  const [businessType, setBusinessType] = useState('restaurant');
  const [form, setForm] = useState({
    name: '',
    category: '',
    subcategory: '',
    address: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    logo: '',
    coverImage: '',
    gallery: '',
    videos: '',
    googleMapsUrl: '',
    facebook: '',
    instagram: '',
    youtube: '',
    whatsapp: '',
    openingHours: defaultOpeningHours,
    cuisineType: 'Indian',
    priceRange: '',
    foodType: 'Both',
    establishedYear: '',
    services: 'Dine In\nTake Away\nHome Delivery\nOnline Ordering',
    menu: '',
    coffeeType: '',
    beverageCategories: '',
    snacks: '',
    cafeFacilities: '',
    shopType: '',
    products: '',
    specialServices: '',
    eventTypes: '',
    cateringServices: '',
    guestCapacityMin: '',
    guestCapacityMax: '',
    menuTypes: '',
    packageDetails: '',
    serviceArea: '',
    experience: '',
    industryType: '',
    operations: '',
    facilities: '',
    certifications: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get('/categories')
      .then(({ data }) => {
        const all = Array.isArray(data?.data) ? data.data : [];
        const foodParent = all.find((category) => category.name === 'Food & Dining');
        const matchingFoodChildren = all.filter((category) => String(category.parent?._id || category.parent) === String(foodParent?._id)
          || foodDiningSubcategoryNames.includes(category.name));
        const foodChildren = foodDiningSubcategoryNames
          .map((name) => matchingFoodChildren.find((category) => category.name === name))
          .filter(Boolean);
        const visible = isFoodDiningFlow ? [foodParent, ...foodChildren].filter(Boolean) : all;

        setCategories(visible);

        if (foodParent && isFoodDiningFlow) {
          setForm((current) => ({ ...current, category: foodParent._id, subcategory: foodChildren[0]?._id || '' }));
          setBusinessType(categoryTypeMap[(foodChildren[0]?.name || '').toLowerCase()] || 'restaurant');
        }
      })
      .catch(() => setCategories([]));
  }, [isFoodDiningFlow]);

  const selectedCategory = useMemo(
    () => categories.find((item) => item._id === form.category),
    [categories, form.category]
  );

  const categoryName = selectedCategory?.name || '';
  const selectedSubcategory = useMemo(
    () => categories.find((item) => item._id === form.subcategory),
    [categories, form.subcategory]
  );
  const subcategoryName = selectedSubcategory?.name || '';
  const foodParent = useMemo(() => categories.find((item) => item.name === 'Food & Dining'), [categories]);
  const foodSubcategories = useMemo(
    () => categories.filter((item) => String(item.parent?._id || item.parent) === String(foodParent?._id)
      || foodDiningSubcategoryNames.includes(item.name)),
    [categories, foodParent]
  );

  useEffect(() => {
    const resolvedType = categoryTypeMap[(subcategoryName || categoryName || '').toLowerCase()] || 'restaurant';
    setBusinessType(resolvedType);
  }, [categoryName, subcategoryName]);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const updateCategory = (event) => {
    const category = event.target.value;
    setForm((current) => ({ ...current, category, subcategory: category === foodParent?._id ? current.subcategory : '' }));
  };

  const updateOpeningHours = (day, field, value) => {
    setForm((current) => ({
      ...current,
      openingHours: {
        ...current.openingHours,
        [day]: { ...(current.openingHours[day] || {}), [field]: value },
      },
    }));
  };

  const renderTypeSpecificFields = () => {
    switch (businessType) {
      case 'restaurant':
        return (
          <>
            <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">Cuisine Type</label><select value={form.cuisineType} onChange={update('cuisineType')} className={inputClass}><option>Indian</option><option>South Indian</option><option>North Indian</option><option>Chinese</option><option>Italian</option><option>Continental</option><option>Multi Cuisine</option></select></div>
            <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">Price Range</label><select value={form.priceRange} onChange={update('priceRange')} className={inputClass}><option value="">Select</option><option>₹</option><option>₹₹</option><option>₹₹₹</option><option>₹₹₹₹</option></select></div>
            <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">Food Type</label><select value={form.foodType} onChange={update('foodType')} className={inputClass}><option>Both</option><option>Veg</option><option>Non-Veg</option></select></div>
            <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">Established Year</label><input value={form.establishedYear} onChange={update('establishedYear')} className={inputClass} /></div>
            <div className="col-span-2"><label className="text-sm text-ink/70">Restaurant Services</label><textarea rows={4} value={form.services} onChange={update('services')} className={inputClass} /></div>
            <div className="col-span-2"><label className="text-sm text-ink/70">Menu / Signature Dishes</label><textarea rows={3} value={form.menu} onChange={update('menu')} placeholder="Chef specials, menu highlights, signature dishes" className={inputClass} /></div>
          </>
        );
      case 'coffee-shop':
        return (
          <>
            <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">Coffee Type</label><input value={form.coffeeType} onChange={update('coffeeType')} placeholder="Arabica / Cold Brew / Filter" className={inputClass} /></div>
            <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">Price Range</label><select value={form.priceRange} onChange={update('priceRange')} className={inputClass}><option value="">Select</option><option>₹</option><option>₹₹</option><option>₹₹₹</option></select></div>
            <div className="col-span-2"><label className="text-sm text-ink/70">Coffee / Beverage Categories</label><textarea rows={3} value={form.beverageCategories} onChange={update('beverageCategories')} placeholder="Espresso, Cappuccino, Latte, Cold Coffee, Tea, Milkshakes, Smoothies, Juices" className={inputClass} /></div>
            <div className="col-span-2"><label className="text-sm text-ink/70">Food / Snacks</label><textarea rows={3} value={form.snacks} onChange={update('snacks')} placeholder="Sandwiches, Pastries, Cookies, Cakes, Snacks" className={inputClass} /></div>
            <div className="col-span-2"><label className="text-sm text-ink/70">Cafe Facilities</label><textarea rows={3} value={form.cafeFacilities} onChange={update('cafeFacilities')} placeholder="Indoor Seating, Outdoor Seating, Free Wi-Fi, Charging Points, AC, Parking, Work-Friendly, Pet-Friendly" className={inputClass} /></div>
          </>
        );
      case 'bakery':
        return (
          <>
            <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">Shop Type</label><input value={form.shopType} onChange={update('shopType')} placeholder="Bakery / Sweet Shop / Cake Studio" className={inputClass} /></div>
            <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">Established Year</label><input value={form.establishedYear} onChange={update('establishedYear')} className={inputClass} /></div>
            <div className="col-span-2"><label className="text-sm text-ink/70">Products</label><textarea rows={3} value={form.products} onChange={update('products')} placeholder="Traditional Sweets, Cakes, Pastries, Bread, Cookies, Snacks, Desserts, Chocolates" className={inputClass} /></div>
            <div className="col-span-2"><label className="text-sm text-ink/70">Special Services</label><textarea rows={3} value={form.specialServices} onChange={update('specialServices')} placeholder="Custom Cakes, Birthday Cakes, Bulk Orders, Gift Hampers, Home Delivery, Takeaway" className={inputClass} /></div>
          </>
        );
      case 'catering':
        return (
          <>
            <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">Experience</label><input value={form.experience} onChange={update('experience')} placeholder="8+ years" className={inputClass} /></div>
            <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">Service Area</label><input value={form.serviceArea} onChange={update('serviceArea')} placeholder="Hyderabad, Vijayawada, etc." className={inputClass} /></div>
            <div className="col-span-2"><label className="text-sm text-ink/70">Event Types</label><textarea rows={3} value={form.eventTypes} onChange={update('eventTypes')} placeholder="Wedding, Birthday, Corporate Events, Housewarming, Anniversary, Party" className={inputClass} /></div>
            <div className="col-span-2"><label className="text-sm text-ink/70">Catering Services</label><textarea rows={3} value={form.cateringServices} onChange={update('cateringServices')} placeholder="Buffet, Per Plate Catering, Live Counters, Traditional Catering, Corporate Catering, Bulk Food Orders" className={inputClass} /></div>
            <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">Minimum Guests</label><input value={form.guestCapacityMin} onChange={update('guestCapacityMin')} className={inputClass} /></div>
            <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">Maximum Guests</label><input value={form.guestCapacityMax} onChange={update('guestCapacityMax')} className={inputClass} /></div>
            <div className="col-span-2"><label className="text-sm text-ink/70">Menu Types</label><input value={form.menuTypes} onChange={update('menuTypes')} placeholder="Veg / Non-Veg / Both" className={inputClass} /></div>
            <div className="col-span-2"><label className="text-sm text-ink/70">Package Details</label><textarea rows={3} value={form.packageDetails} onChange={update('packageDetails')} placeholder="Price per plate, custom menu, buffet packages, event-specific options" className={inputClass} /></div>
          </>
        );
      case 'food-processing':
        return (
          <>
            <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">Industry Type</label><input value={form.industryType} onChange={update('industryType')} placeholder="Food Processing / Packaged Foods" className={inputClass} /></div>
            <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">Established Year</label><input value={form.establishedYear} onChange={update('establishedYear')} className={inputClass} /></div>
            <div className="col-span-2"><label className="text-sm text-ink/70">Products</label><textarea rows={3} value={form.products} onChange={update('products')} placeholder="Processed Foods, Packaged Foods, Spices, Pickles, Snacks, Frozen Foods, Ready-to-Eat, Beverages" className={inputClass} /></div>
            <div className="col-span-2"><label className="text-sm text-ink/70">Business Operations</label><textarea rows={3} value={form.operations} onChange={update('operations')} placeholder="Manufacturing, Packaging, Wholesale, Distribution, Private Label, Bulk Orders" className={inputClass} /></div>
            <div className="col-span-2"><label className="text-sm text-ink/70">Facilities</label><textarea rows={3} value={form.facilities} onChange={update('facilities')} placeholder="Manufacturing Unit, Packaging Unit, Cold Storage, Warehouse, Quality Control, Delivery / Distribution" className={inputClass} /></div>
            <div className="col-span-2"><label className="text-sm text-ink/70">Certifications</label><textarea rows={3} value={form.certifications} onChange={update('certifications')} placeholder="FSSAI, ISO, Other Certifications" className={inputClass} /></div>
          </>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!location.state || !location.district || !location.city) {
      setError('Please select state, district and city.');
      return;
    }

    if (!form.name.trim() || !form.address.trim() || !form.description.trim()) {
      setError('Business name, address and description are required.');
      return;
    }

    const common = {
      businessName: form.name,
      logo: form.logo,
      phone: form.phone,
      email: form.email,
      website: form.website,
      address: form.address,
      state: location.state,
      district: location.district,
      city: location.city,
      area: location.area,
      googleMapsUrl: form.googleMapsUrl,
      about: form.description,
      openingHours: Object.entries(form.openingHours).map(([day, values]) => ({ day, ...values })),
      socialMedia: {
        facebook: form.facebook,
        instagram: form.instagram,
        youtube: form.youtube,
        whatsapp: form.whatsapp,
      },
      gallery: splitList(form.gallery).slice(0, 10),
      videos: splitList(form.videos).slice(0, 10),
      coverImage: form.coverImage,
    };

    const categorySpecific = {
      restaurant: {
        cuisineType: form.cuisineType,
        priceRange: form.priceRange,
        foodType: form.foodType,
        establishedYear: form.establishedYear,
        services: splitList(form.services),
        menu: form.menu,
      },
      'coffee-shop': {
        coffeeType: form.coffeeType,
        priceRange: form.priceRange,
        beverageCategories: splitList(form.beverageCategories),
        snacks: splitList(form.snacks),
        facilities: splitList(form.cafeFacilities),
      },
      bakery: {
        shopType: form.shopType,
        establishedYear: form.establishedYear,
        products: splitList(form.products),
        specialServices: splitList(form.specialServices),
      },
      catering: {
        experience: form.experience,
        serviceArea: form.serviceArea,
        eventTypes: splitList(form.eventTypes),
        cateringServices: splitList(form.cateringServices),
        guestCapacity: { min: form.guestCapacityMin, max: form.guestCapacityMax },
        menuTypes: form.menuTypes,
        packageDetails: form.packageDetails,
      },
      'food-processing': {
        industryType: form.industryType,
        establishedYear: form.establishedYear,
        products: splitList(form.products),
        operations: splitList(form.operations),
        facilities: splitList(form.facilities),
        certifications: splitList(form.certifications),
      },
    }[businessType] || {};

    setSubmitting(true);

    try {
      const payload = {
        name: form.name,
        category: form.category,
        subcategory: form.subcategory || undefined,
        address: form.address,
        description: form.description,
        phone: form.phone || undefined,
        email: form.email || undefined,
        website: form.website || undefined,
        logo: form.logo || undefined,
        coverImage: form.coverImage || undefined,
        images: splitList(form.gallery).slice(0, 10),
        services: splitList(form.services).slice(0, 20),
        facilities: splitList(form.facilities || form.cafeFacilities || '').slice(0, 20),
        socialLinks: {
          facebook: form.facebook || undefined,
          instagram: form.instagram || undefined,
          youtube: form.youtube || undefined,
          whatsapp: form.whatsapp || undefined,
        },
        attributes: {
          businessProfile: {
            businessType,
            common,
            categorySpecific,
          },
        },
        location: {
          state: location.state,
          district: location.district,
          city: location.city,
          area: location.area || undefined,
        },
      };

      await api.post('/places', payload);
      setSuccess('Listing submitted and sent for approval.');
      setTimeout(() => navigate('/business/dashboard'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to create the listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-2xl font-semibold text-ink">{isFoodDiningFlow ? 'Add Food & Dining business' : 'List your business'}</h1>
        <p className="mt-1 text-sm text-ink/55">Each Food & Dining subtype uses its own form and profile layout while sharing the same common business information.</p>

        {error && <div className="mt-4 rounded border border-vermilion/30 bg-vermilion/10 p-3 text-sm text-vermilion">{error}</div>}
        {success && <div className="mt-4 rounded border border-moss/30 bg-moss/10 p-3 text-sm text-moss">{success}</div>}

        <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">Business category</label>
            <select required value={form.category} onChange={updateCategory} className={inputClass}>
              <option value="">Select category</option>
              {categories.filter((category) => isFoodDiningFlow
                ? category._id === foodParent?._id
                : !category.parent).map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>

          {form.category === foodParent?._id && <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">Business subcategory</label>
            <select required value={form.subcategory} onChange={update('subcategory')} className={inputClass}>
              <option value="">Select subcategory</option>
              {foodSubcategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
              ))}
            </select>
          </div>}

          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">Business type</label>
            <input value={subcategoryName || categoryName || 'Business'} readOnly className={inputClass} />
          </div>

          <div className="col-span-2"><label className="text-sm text-ink/70">Business Name</label><input required value={form.name} onChange={update('name')} className={inputClass} /></div>
          <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">Phone</label><input value={form.phone} onChange={update('phone')} className={inputClass} /></div>
          <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">Email</label><input type="email" value={form.email} onChange={update('email')} className={inputClass} /></div>
          <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">Website</label><input value={form.website} onChange={update('website')} placeholder="https://" className={inputClass} /></div>
          <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">Logo URL</label><input value={form.logo} onChange={update('logo')} placeholder="https://..." className={inputClass} /></div>

          <LocationCascadeFields value={location} onChange={setLocation} />

          <div className="col-span-2"><label className="text-sm text-ink/70">Address</label><input required value={form.address} onChange={update('address')} className={inputClass} /></div>
          <div className="col-span-2"><label className="text-sm text-ink/70">Google Maps Location</label><input value={form.googleMapsUrl} onChange={update('googleMapsUrl')} placeholder="https://maps.google.com/..." className={inputClass} /></div>
          <div className="col-span-2"><label className="text-sm text-ink/70">About</label><textarea required rows={4} value={form.description} onChange={update('description')} className={inputClass} /></div>
          <div className="col-span-2"><label className="text-sm text-ink/70">Gallery image URLs</label><textarea rows={3} value={form.gallery} onChange={update('gallery')} placeholder="https://...\nhttps://..." className={inputClass} /></div>
          <div className="col-span-2"><label className="text-sm text-ink/70">Video URLs</label><textarea rows={3} value={form.videos} onChange={update('videos')} placeholder="https://youtube.com/..\nhttps://..." className={inputClass} /></div>
          <div className="col-span-2"><label className="text-sm text-ink/70">Cover Image URL</label><input value={form.coverImage} onChange={update('coverImage')} placeholder="https://..." className={inputClass} /></div>

          <div className="col-span-2">
            <label className="text-sm text-ink/70">Social Media Links</label>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <input value={form.facebook} onChange={update('facebook')} placeholder="Facebook URL" className={inputClass} />
              <input value={form.instagram} onChange={update('instagram')} placeholder="Instagram URL" className={inputClass} />
              <input value={form.youtube} onChange={update('youtube')} placeholder="YouTube URL" className={inputClass} />
              <input value={form.whatsapp} onChange={update('whatsapp')} placeholder="WhatsApp Number" className={inputClass} />
            </div>
          </div>

          <div className="col-span-2">
            <h2 className="font-display text-lg font-medium text-ink">Opening Hours</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {Object.keys(defaultOpeningHours).map((day) => (
                <div key={day} className="rounded border border-line bg-white p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium capitalize text-ink">{day}</span>
                    <label className="flex items-center gap-2 text-xs text-ink/60"><input type="checkbox" checked={Boolean(form.openingHours[day]?.closed)} onChange={(event) => updateOpeningHours(day, 'closed', event.target.checked)} />Closed</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="time" value={form.openingHours[day]?.open || ''} onChange={(event) => updateOpeningHours(day, 'open', event.target.value)} className={inputClass} />
                    <input type="time" value={form.openingHours[day]?.close || ''} onChange={(event) => updateOpeningHours(day, 'close', event.target.value)} className={inputClass} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2 mt-2 rounded border border-line bg-paper/70 p-4">
            <h2 className="font-display text-lg font-medium text-ink">{subcategoryName || categoryName || 'Business'}-specific details</h2>
            <div className="mt-4 grid grid-cols-2 gap-4">{renderTypeSpecificFields()}</div>
          </div>

          <div className="col-span-2 flex justify-end gap-3 pt-3">
            <button type="button" onClick={() => navigate('/business/dashboard')} className="rounded border border-line px-4 py-2 text-sm text-ink">Cancel</button>
            <button type="submit" disabled={submitting} className="rounded bg-ink px-5 py-2.5 text-sm font-medium text-paper disabled:opacity-60">{submitting ? 'Submitting...' : 'Submit listing'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
