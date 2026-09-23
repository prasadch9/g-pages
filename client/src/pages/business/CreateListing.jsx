import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import LocationCascadeFields from '../../components/LocationCascadeFields';

const CATEGORY_GROUPS = [
  { name: 'Education & Learning', children: ['Schools', 'Colleges', 'Universities', 'Training Institutes', 'Academies', 'Sports Academies'] },
  { name: 'Healthcare & Medical', children: ['Hospitals', 'Multispeciality Hospitals', 'Cardiology', 'ENT', 'Dental', 'Hearing Solutions', 'Fitness Centres'] },
  { name: 'Religious & Social', children: ['Temples', 'Churches', 'Trusts', 'NGOs', 'Associations'] },
  { name: 'Marriage & Wedding', children: ['Marriage Bureaus', 'Function Halls', 'Event Organizers', 'Catering Services', 'Flower Decoration', 'Fashion Designers', 'Beauty Parlours', 'Saloon & Spa'] },
  { name: 'Travel & Hospitality', children: ['Tours & Travels', 'Hotels & Residencies', 'Resorts', 'Party Zones'] },
  { name: 'Real Estate & Construction', children: ['Real Estate', 'Construction', 'Roofing', 'Interiors & Decorations', 'Tiles Shops', 'Furniture Shops'] },
  { name: 'Food & Dining', children: ['Restaurants', 'Coffee Shops', 'Sweet Shops & Bakery', 'Catering Services', 'Food Processing'] },
  { name: 'Shopping & Retail', children: ['Shopping Malls', 'Boutique', 'Home Appliances', 'Furniture Shops', 'Mattress Shops', 'Nurseries'] },
  { name: 'Automotive', children: ['Car Showrooms', 'Auto Service Centers', 'Tyre Shops', 'Car Accessories', 'Vehicle Detailing', 'Car Wash'] },
  { name: 'Industries & Manufacturing', children: ['Small Scale Industries', 'Food Processing', 'Trading Businesses'] },
  { name: 'Business & Professional Services', children: ['Consultancies', 'Agencies', 'Manpower Agencies', 'Professions'] },
  { name: 'Logistics & Moving', children: ['Packers & Movers'] },
  { name: 'Arts & Creative', children: ['Sculptures (Arts)'] },
];

const initialLocation = { state: '', district: '', city: '', area: '', areaText: '' };
const MALL_DAYS = [['mon', 'Monday'], ['tue', 'Tuesday'], ['wed', 'Wednesday'], ['thu', 'Thursday'], ['fri', 'Friday'], ['sat', 'Saturday'], ['sun', 'Sunday']];
const initialForm = {
  name: '',
  category: '',
  subcategory: '',
  address: '',
  description: '',
  phone: '',
  email: '',
  website: '',
  services: '',
  facebook: '',
  instagram: '',
  youtube: '',
  whatsapp: '',
  chatSupport: '',
  videoUrls: '',
};

const SHOPPING_DETAILS = {
  'Shopping Malls': [['facilities', 'Facilities', 'Parking, Food Court, Cinema, Kids Play Area, ATM, Restrooms, Wheelchair Access, Security, Wi-Fi'], ['featuredBrands', 'Featured brands', 'Brand names, comma separated']],
  Boutique: [['collections', 'Featured collections', 'Sarees, Kurtis, Lehengas, Western Wear, Party Wear, Bridal Wear, Kids Wear, Accessories'], ['specialtyServices', 'Boutique services', 'Custom Stitching, Alterations, Bridal Styling, Personal Styling'], ['featuredBrands', 'Featured brands', 'Brand names, comma separated']],
  'Home Appliances': [['productCategories', 'Product categories', 'Refrigerators, Washing Machines, Air Conditioners, TVs, Microwaves, Kitchen Appliances, Water Purifiers, Fans'], ['featuredBrands', 'Popular brands', 'LG, Samsung, Sony, Whirlpool'], ['specialtyServices', 'Store services', 'Home Delivery, Installation, Repair, Warranty Support, EMI Available'], ['offer', 'Current offer', 'Example: Up to 20% off on selected appliances']],
  'Furniture Shops': [['productCategories', 'Furniture categories', 'Sofas, Beds, Dining Tables, Chairs, Wardrobes, Office Furniture, TV Units, Modular Furniture'], ['materials', 'Materials & customization', 'Wood, Engineered Wood, Metal, Glass, Leather'], ['specialtyServices', 'Store services', 'Custom Furniture, Home Delivery, Installation, Interior Consultation'], ['featuredBrands', 'Featured brands', 'Brand names, comma separated']],
  'Mattress Shops': [['productCategories', 'Mattress types', 'Memory Foam, Spring, Latex, Coir, Orthopedic, Hybrid'], ['sizes', 'Available sizes', 'Single, Double, Queen, King, Custom Size'], ['featuredBrands', 'Popular brands', 'Brand names, comma separated'], ['specialtyServices', 'Store services', 'Home Delivery, Custom Size, Trial Available, Installation'], ['offer', 'Current offer', 'Example: Flat 15% off on orthopedic mattresses']],
  Nurseries: [['productCategories', 'Plant categories', 'Indoor Plants, Outdoor Plants, Flowering Plants, Fruit Plants, Medicinal Plants, Succulents, Ornamental Plants, Trees'], ['gardenProducts', 'Gardening products', 'Pots, Seeds, Soil, Fertilizers, Gardening Tools, Plant Accessories'], ['specialtyServices', 'Nursery services', 'Landscaping, Garden Maintenance, Plant Delivery, Gardening Consultation']],
};

Object.values(SHOPPING_DETAILS).forEach((fields) => {
  const offerField = fields.find(([key]) => key === 'offer');
  if (offerField) {
    offerField[1] = "Offer happening today";
    offerField[2] = 'Example: Today only, 20% off selected items';
  } else {
    fields.push(['offer', "Offer happening today", 'Example: Today only, 20% off selected items']);
  }
});

const splitList = (value) => String(value || '').split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      const maxDimension = 2000;
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    image.onerror = () => reject(new Error('Unable to process the selected file.'));
    image.src = String(reader.result);
  };
  reader.onerror = () => reject(new Error('Unable to read the selected file.'));
  reader.readAsDataURL(file);
});

const dataUrlToBlob = (dataUrl) => {
  const [header, encoded] = dataUrl.split(',');
  const mime = header.match(/data:(.*?);base64/)?.[1] || 'image/jpeg';
  const binary = window.atob(encoded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new Blob([bytes], { type: mime });
};

export default function CreateListing() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [location, setLocation] = useState(initialLocation);
  const [form, setForm] = useState(initialForm);
  const [shoppingDetails, setShoppingDetails] = useState({});
  const [mallCollectionDetails, setMallCollectionDetails] = useState([]);
  const [mallVideos, setMallVideos] = useState([]);
  const [mallVideoUrl, setMallVideoUrl] = useState('');
  const [mallVideoCaption, setMallVideoCaption] = useState('');
  const [workingHours, setWorkingHours] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({ logo: '', coverImage: '', aboutImage: '', galleryImages: [] });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.data)).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!id) return;
    api.get(`/places/${id}`).then(({ data }) => {
      const place = data.data;
      const subcategory = place.attributes?.subCategory || place.category?.name || '';
      const categoryGroup = CATEGORY_GROUPS.find((group) => group.children.some((child) => child.toLowerCase() === subcategory.toLowerCase()));
      setForm({
        ...initialForm,
        name: place.name || '',
        category: categoryGroup?.name || '',
        subcategory,
        address: place.address || '',
        description: place.description || '',
        phone: place.phone || '',
        email: place.email || '',
        website: place.website || '',
        services: (place.services || []).join(', '),
        facebook: place.socialLinks?.facebook || '',
        instagram: place.socialLinks?.instagram || '',
        youtube: place.socialLinks?.youtube || '',
        whatsapp: place.socialLinks?.whatsapp || '',
        chatSupport: place.socialLinks?.chatSupport || '',
        videoUrls: (place.videos || []).join('\n'),
      });
      setShoppingDetails(Object.fromEntries(Object.entries(place.attributes || {}).filter(([key]) => key !== 'subCategory')));
      setMallCollectionDetails(place.attributes?.mallCollections || (place.images || []).map((image) => ({ image, tag: 'New', caption: '', features: '' })));
      setMallVideos((place.attributes?.mallVideos || (place.videos || []).map((url) => ({ url, caption: '' }))).map((video) => typeof video === 'string' ? { url: video, caption: '' } : video));
      setWorkingHours(place.workingHours || []);
      setLocation({
        state: place.location?.state?._id || place.location?.state || '',
        district: place.location?.district?._id || place.location?.district || '',
        city: place.location?.city?._id || place.location?.city || '',
        area: place.location?.area?._id || place.location?.area || '',
        areaText: place.location?.areaText || '',
      });
      setUploadedFiles({
        logo: place.logo || '',
        coverImage: place.coverImage || '',
        aboutImage: place.aboutImage || '',
        galleryImages: place.images || [],
      });
    }).catch((err) => setError(err.message));
  }, [id]);

  const selectedCategoryName = form.category || '';

  const subcategoryOptions = useMemo(() => {
    const categoryGroup = CATEGORY_GROUPS.find((group) => group.name.toLowerCase() === selectedCategoryName.toLowerCase());
    return categoryGroup?.children || [];
  }, [selectedCategoryName]);

  const isAutomotiveCategory = selectedCategoryName.toLowerCase().includes('automotive') || form.subcategory.toLowerCase().includes('automotive');
  const isShoppingCategory = selectedCategoryName === 'Shopping & Retail';
  const shoppingFields = SHOPPING_DETAILS[form.subcategory] || [];

  const update = (field) => (e) => setForm((current) => ({ ...current, [field]: e.target.value }));

  const handleCategoryChange = (e) => {
    const nextCategory = e.target.value;
    setForm((current) => ({
      ...current,
      category: nextCategory,
      subcategory: '',
    }));
  };

  const uploadImages = async (images) => {
    if (!images.length) return [];
    const body = new FormData();
    const imageUrls = [...images];
    const pendingIndexes = [];
    images.forEach((image, index) => {
      if (image.startsWith('data:')) {
        body.append('images', dataUrlToBlob(image), `listing-image-${index + 1}.jpg`);
        pendingIndexes.push(index);
      }
    });
    if (!body.has('images')) return imageUrls;
    const { data } = await api.post('/uploads/images', body, { headers: { 'Content-Type': 'multipart/form-data' } });
    data.data.forEach((image, index) => { imageUrls[pendingIndexes[index]] = image.url; });
    return imageUrls;
  };

  const uploadMallVideos = async (videos) => {
    const body = new FormData();
    const urls = [...videos];
    const fileIndexes = [];
    videos.forEach((video, index) => {
      if (video.file) {
        body.append('videos', video.file, video.file.name);
        fileIndexes.push(index);
      }
    });
    if (!fileIndexes.length) return urls.map((video) => video.url);
    const { data } = await api.post('/uploads/videos', body, { headers: { 'Content-Type': 'multipart/form-data' } });
    data.data.forEach((uploaded, index) => { urls[fileIndexes[index]] = { ...urls[fileIndexes[index]], url: uploaded.url }; });
    return urls.map((video) => video.url);
  };

  const handleMallVideoFiles = (files) => {
    const selected = Array.from(files || []);
    setMallVideos((current) => [...current, ...selected.map((file) => ({ file, url: '', caption: '', preview: URL.createObjectURL(file) }))]);
  };

  const addMallVideoUrl = () => {
    if (!mallVideoUrl.trim()) return;
    setMallVideos((current) => [...current, { url: mallVideoUrl.trim(), caption: mallVideoCaption.trim() }]);
    setMallVideoUrl('');
    setMallVideoCaption('');
  };

  const uploadSingleImage = async (image) => {
    const [url] = await uploadImages(image ? [image] : []);
    return url || '';
  };

  const handleLocalFiles = async (field, files, multiple = false) => {
    const items = Array.from(files || []);
    if (!items.length) return;

    try {
      const values = await Promise.all(items.map((file) => fileToDataUrl(file)));
      if (multiple) {
        if (field === 'galleryImages') setMallCollectionDetails((current) => [...current, ...values.map(() => ({ tag: 'New', caption: '', features: '' }))]);
        setUploadedFiles((current) => ({
          ...current,
          galleryImages: [...(current.galleryImages || []), ...values],
        }));
      } else {
        setUploadedFiles((current) => ({ ...current, [field]: values[0] }));
      }
    } catch {
      setError('One or more selected files could not be read. Please try again.');
    }
  };

  const removeUploadedImage = (field, index = null) => {
    if (field === 'galleryImages') {
      setMallCollectionDetails((current) => current.filter((_, itemIndex) => itemIndex !== index));
      setUploadedFiles((current) => ({
        ...current,
        galleryImages: (current.galleryImages || []).filter((_, itemIndex) => itemIndex !== index),
      }));
      return;
    }

    setUploadedFiles((current) => ({ ...current, [field]: '' }));
  };

  const renderSingleImageUpload = (field, label, isOptional = true) => {
    const value = uploadedFiles[field];
    return (
      <div className="col-span-2 sm:col-span-1">
        <label className="text-sm text-ink/70">{label}{isOptional ? ' (optional)' : ''}</label>
        {value ? (
          <div className="mt-2 space-y-2">
            <img src={value} alt={label} className="h-28 w-full rounded border border-line object-contain" />
            <div className="flex gap-2">
              <label className="cursor-pointer rounded border border-line bg-white px-3 py-2 text-xs font-medium text-ink hover:border-ink/40">
                Replace
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLocalFiles(field, e.target.files, false)} />
              </label>
              <button type="button" onClick={() => removeUploadedImage(field)} className="rounded border border-vermilion/40 bg-vermilion/5 px-3 py-2 text-xs font-medium text-vermilion hover:bg-vermilion/10">
                Remove
              </button>
            </div>
          </div>
        ) : (
          <label className="mt-2 flex cursor-pointer items-center justify-center rounded border border-dashed border-line bg-white px-3 py-6 text-center text-sm text-ink/60 hover:border-ink/40">
            <span>Upload {label.toLowerCase()}</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLocalFiles(field, e.target.files, false)} />
          </label>
        )}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.category) {
      setError('Please select a main category first.');
      return;
    }

    if (!form.subcategory) {
      setError('Please select a sub category.');
      return;
    }

    if (!location.state || !location.district || !location.city || !location.areaText.trim()) {
      setError('Please select state and district, select city, and enter area.');
      return;
    }

    if (!form.name.trim()) {
      setError('Business name is required.');
      return;
    }

    if (!form.address.trim()) {
      setError('Please enter the exact business location for Google Maps.');
      return;
    }

    if (form.subcategory === 'Shopping Malls' && !form.phone.trim()) {
      setError('A mobile number is required for shopping mall listings.');
      return;
    }

    if (!uploadedFiles.coverImage) {
      setError('Cover page image is required.');
      return;
    }

    if (!uploadedFiles.aboutImage) {
      setError('About us image is required.');
      return;
    }

    const categoryMatch = categories.find((category) => category.name.toLowerCase() === form.subcategory.toLowerCase());
    const categoryId = categoryMatch?._id || categories.find((category) => category.name.toLowerCase() === form.category.toLowerCase())?._id;

    if (!categoryId) {
      setError('The selected category is not available. Please choose another option.');
      return;
    }

    setSubmitting(true);
    try {
      const [logo, coverImage, aboutImage, galleryImages, mallVideoUrls] = await Promise.all([
        uploadSingleImage(uploadedFiles.logo),
        uploadSingleImage(uploadedFiles.coverImage),
        uploadSingleImage(uploadedFiles.aboutImage),
        uploadImages(uploadedFiles.galleryImages || []),
        isShoppingCategory && form.subcategory === 'Shopping Malls' ? uploadMallVideos(mallVideos) : Promise.resolve(splitList(form.videoUrls)),
      ]);
      const mallCollections = galleryImages.map((image, index) => {
        const details = mallCollectionDetails[index] || {};
        return { image, tag: details.tag || 'New', caption: details.caption?.trim() || '', features: Array.isArray(details.features) ? details.features : splitList(details.features) };
      });
      const mallVideoDetails = mallVideoUrls.map((url, index) => ({ url, caption: mallVideos[index]?.caption?.trim() || '' }));
      const payload = {
        name: form.name.trim(),
        category: categoryId,
        address: form.address.trim(),
        description: form.description.trim() || `${form.name.trim()} is located at ${form.address.trim()}. Visit us for trusted local service and support.`,
        phone: form.phone || undefined,
        email: form.email || undefined,
        website: form.website || undefined,
        logo: logo || undefined,
        services: splitList(form.services),
        images: galleryImages,
        coverImage: coverImage || undefined,
        aboutImage: aboutImage || undefined,
        videos: mallVideoUrls,
        socialLinks: {
          facebook: form.facebook || undefined,
          instagram: form.instagram || undefined,
          youtube: form.youtube || undefined,
          whatsapp: form.whatsapp || undefined,
          chatSupport: form.chatSupport || undefined,
        },
        attributes: {
          subCategory: form.subcategory || undefined,
          ...(isShoppingCategory ? Object.fromEntries(Object.entries(shoppingDetails).filter(([, value]) => String(value || '').trim())) : {}),
          ...(isShoppingCategory && form.subcategory === 'Shopping Malls' ? { mallCollections, mallVideos: mallVideoDetails } : {}),
        },
        workingHours: workingHours.filter((entry) => entry.open || entry.close || entry.closed),
        location: {
          state: location.state,
          district: location.district,
          city: location.city,
          area: location.area || undefined,
          areaText: location.areaText.trim(),
        },
      };

      if (id) {
        await api.put(`/places/${id}`, payload);
        setSuccess('Listing updated successfully.');
      } else {
        await api.post('/places', payload);
        setSuccess('Listing submitted! It will appear publicly once an admin approves it.');
      }
      setTimeout(() => navigate('/business/dashboard'), 1600);
    } catch (err) {
      setError(err.message || 'Something went wrong while submitting the listing.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-ink/40';

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-semibold text-ink">{id ? 'Edit your business listing' : 'List your business'}</h1>
        <p className="mt-1 text-sm text-ink/55">{id ? 'Update your business details, images, services, and contact information.' : 'Create your listing with the right category, sub-category, images, services, and contact details.'}</p>

        <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">Select main category</label>
            <select required value={form.category} onChange={handleCategoryChange} className={inputClass}>
              <option value="">Select main category</option>
              {CATEGORY_GROUPS.map((group) => (
                <option key={group.name} value={group.name}>{group.name}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">Select sub category</label>
            <select value={form.subcategory} onChange={update('subcategory')} className={inputClass} disabled={!subcategoryOptions.length}>
              <option value="">Select sub category</option>
              {subcategoryOptions.map((subCategory) => (
                <option key={subCategory} value={subCategory}>{subCategory}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2 grid grid-cols-2 gap-4 rounded border border-line bg-white/60 p-4">
            <p className="col-span-2 text-xs font-bold uppercase tracking-[0.16em] text-ink/55">Business location</p>
            <LocationCascadeFields value={location} onChange={setLocation} />
          </div>

          {isShoppingCategory && (
            <>
              <div className="col-span-2 rounded-xl border border-[#f2d9d3] bg-[#fff7f4] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ef5261]">{form.subcategory || 'Shopping & Retail'} details</p>
                <p className="mt-1 text-xs text-ink/60">Add the details that shoppers expect for this type of business.</p>
              </div>

              <div className="col-span-2">
                <label className="text-sm text-ink/70">{form.subcategory === 'Shopping Malls' ? 'Business name' : form.subcategory === 'Boutique' ? 'Boutique name' : form.subcategory === 'Nurseries' ? 'Nursery name' : 'Store name'}</label>
                <input required value={form.name} onChange={update('name')} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className="text-sm text-ink/70">Exact location for Google Maps</label>
                <input required value={form.address} onChange={update('address')} placeholder="Paste the exact address or Google Maps location" className={inputClass} />
              </div>
              <div className="col-span-2"><label className="text-sm text-ink/70">{form.subcategory === 'Shopping Malls' ? 'About section description' : 'Description'}</label><textarea rows={4} value={form.description} onChange={update('description')} placeholder="Tell shoppers what makes your business special" className={inputClass} /></div>
              {renderSingleImageUpload('logo', 'Business logo')}
              {renderSingleImageUpload('coverImage', form.subcategory === 'Shopping Malls' ? 'Hero section image' : 'Cover image', false)}
              {renderSingleImageUpload('aboutImage', form.subcategory === 'Shopping Malls' ? 'About section image' : 'About image', false)}

              {shoppingFields.map(([field, label, placeholder]) => (
                <div key={field} className="col-span-2">
                  <label className="text-sm text-ink/70">{label}</label>
                  <textarea rows={2} value={shoppingDetails[field] || ''} onChange={(event) => setShoppingDetails((current) => ({ ...current, [field]: event.target.value }))} placeholder={placeholder} className={inputClass} />
                </div>
              ))}
              {form.subcategory === 'Shopping Malls' && <div className="col-span-2 rounded-xl border border-[#f2d9d3] bg-white p-4"><p className="text-sm font-semibold text-ink">Mall opening hours</p><p className="mt-1 text-xs text-ink/60">These hours appear in the seasonal panel on your mall page.</p><div className="mt-4 grid gap-2">{MALL_DAYS.map(([day, label]) => { const entry = workingHours.find((item) => item.day === day) || { day, open: '', close: '', closed: false }; const updateHours = (changes) => setWorkingHours((current) => [...current.filter((item) => item.day !== day), { ...entry, ...changes }]); return <div key={day} className="grid items-center gap-2 sm:grid-cols-[100px_1fr_1fr_auto]"><span className="text-xs font-medium text-ink/75">{label}</span><input type="time" value={entry.open || ''} disabled={entry.closed} onChange={(event) => updateHours({ open: event.target.value })} className="rounded border border-line px-2 py-2 text-xs disabled:bg-slate-100" aria-label={`${label} opening time`} /><input type="time" value={entry.close || ''} disabled={entry.closed} onChange={(event) => updateHours({ close: event.target.value })} className="rounded border border-line px-2 py-2 text-xs disabled:bg-slate-100" aria-label={`${label} closing time`} /><label className="flex items-center gap-2 text-xs text-ink/70"><input type="checkbox" checked={Boolean(entry.closed)} onChange={(event) => updateHours({ closed: event.target.checked })} />Closed</label></div>; })}</div></div>}
              {form.subcategory === 'Shopping Malls' && <div className="col-span-2 rounded-xl border border-[#f2d9d3] bg-white p-4"><p className="text-sm font-semibold text-ink">Video tour (optional)</p><p className="mt-1 text-xs text-ink/60">Upload multiple video files or add video URLs. Videos appear on the mall page only when added here.</p><div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]"><input type="url" value={mallVideoUrl} onChange={(event) => setMallVideoUrl(event.target.value)} placeholder="YouTube or direct video URL" className={inputClass}/><input value={mallVideoCaption} onChange={(event) => setMallVideoCaption(event.target.value)} placeholder="Video caption" className={inputClass}/><button type="button" onClick={addMallVideoUrl} className="mt-1 rounded border border-[#b1164c] px-4 py-2 text-sm font-semibold text-[#b1164c]">Add URL</button></div><label className="mt-3 inline-flex cursor-pointer items-center rounded border border-dashed border-line px-4 py-3 text-xs font-semibold text-ink/70 hover:border-ink/40">Upload video files<input type="file" accept="video/mp4,video/webm,video/ogg,video/quicktime" multiple className="hidden" onChange={(event) => { handleMallVideoFiles(event.target.files); event.target.value = ''; }}/></label>{mallVideos.length > 0 && <div className="mt-3 grid gap-2">{mallVideos.map((video, index) => <div key={video.preview || video.url || index} className="grid items-center gap-2 rounded border border-line p-2 sm:grid-cols-[1fr_1fr_auto]"><span className="truncate text-xs text-ink/70">{video.file?.name || video.url}</span><input value={video.caption || ''} onChange={(event) => setMallVideos((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, caption: event.target.value } : item))} placeholder="Video caption" className={inputClass}/><button type="button" onClick={() => { if (video.preview) URL.revokeObjectURL(video.preview); setMallVideos((current) => current.filter((_, itemIndex) => itemIndex !== index)); }} className="rounded px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50">Remove</button></div>)}</div>}</div>}
              <div className="col-span-2"><label className="text-sm text-ink/70">Additional services (comma-separated)</label><input value={form.services} onChange={update('services')} placeholder="Home delivery, personal assistance, installation" className={inputClass} /></div>
              <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">{form.subcategory === 'Shopping Malls' ? 'Mobile number *' : 'Phone'}</label><input type="tel" required={form.subcategory === 'Shopping Malls'} value={form.phone} onChange={update('phone')} className={inputClass} /></div>
              <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">WhatsApp</label><input value={form.whatsapp} onChange={update('whatsapp')} placeholder="WhatsApp number or link" className={inputClass} /></div>
              <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">Email</label><input type="email" value={form.email} onChange={update('email')} className={inputClass} /></div>
              <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">Website</label><input value={form.website} onChange={update('website')} placeholder="https://" className={inputClass} /></div>
              <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">Instagram</label><input value={form.instagram} onChange={update('instagram')} className={inputClass} /></div>
              <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">Facebook</label><input value={form.facebook} onChange={update('facebook')} className={inputClass} /></div>
              {form.subcategory === 'Shopping Malls' && <div className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">YouTube</label><input value={form.youtube} onChange={update('youtube')} placeholder="YouTube channel URL" className={inputClass} /></div>}
              <div className="col-span-2"><label className="text-sm text-ink/70">{form.subcategory === 'Shopping Malls' ? 'Latest collection images' : 'Gallery images'}</label><div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">{(uploadedFiles.galleryImages || []).map((image, index) => <div key={`${image}-${index}`} className="overflow-hidden rounded border border-line bg-white"><img src={image} alt={`Gallery ${index + 1}`} className="h-24 w-full object-contain" /><button type="button" onClick={() => removeUploadedImage('galleryImages', index)} className="w-full border-t border-line px-2 py-2 text-[11px] text-vermilion">Remove</button></div>)}<label className="flex min-h-[110px] cursor-pointer items-center justify-center rounded border border-dashed border-line bg-white px-3 py-4 text-center text-xs text-ink/60">Add photos<input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleLocalFiles('galleryImages', e.target.files, true)} /></label></div></div>
            </>
          )}

              {isShoppingCategory && form.subcategory === 'Shopping Malls' && <div className="col-span-2 rounded-xl border border-[#f2d9d3] bg-white p-4"><p className="text-sm font-semibold text-ink">Latest collection details</p><p className="mt-1 text-xs text-ink/60">Add a tag, caption, and comma-separated features for each uploaded collection image.</p><div className="mt-4 grid gap-4">{uploadedFiles.galleryImages.map((image, index) => { const details = mallCollectionDetails[index] || { tag: 'New', caption: '', features: '' }; return <div key={`${image}-${index}`} className="grid gap-3 rounded-lg border border-line p-3 sm:grid-cols-[100px_1fr]"><img src={image} alt={details.caption || `Collection image ${index + 1}`} className="h-24 w-full rounded object-contain"/><div className="grid gap-2 sm:grid-cols-2"><label className="text-xs text-ink/70">Tag<select value={details.tag || 'New'} onChange={(event) => setMallCollectionDetails((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, tag: event.target.value } : item))} className={inputClass}><option>New</option><option>Trending</option><option>Bestseller</option><option>Sale</option><option>Limited Edition</option><option>Back in Stock</option><option>Popular Pick</option></select></label><label className="text-xs text-ink/70">Caption<input value={details.caption || ''} onChange={(event) => setMallCollectionDetails((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, caption: event.target.value } : item))} placeholder="Lehengas, Kurtis, Bridal Collection" className={inputClass}/></label><label className="text-xs text-ink/70 sm:col-span-2">Features<input value={Array.isArray(details.features) ? details.features.join(', ') : details.features || ''} onChange={(event) => setMallCollectionDetails((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, features: event.target.value } : item))} placeholder="Comfortable, Stylish, Daily Wear, Wedding Wear" className={inputClass}/><span className="mt-1 block text-[11px] text-ink/50">Shown below the caption with separators.</span></label></div></div>; })}</div></div>}

          {isAutomotiveCategory && (
            <>
              <div className="col-span-2">
                <div className="rounded-xl border border-[#d9e2ec] bg-[#f8fbfd] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f0a900]">Automotive business details</p>
                </div>
              </div>

              {renderSingleImageUpload('logo', 'Logo')}

              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-ink/70">Business name</label>
                <input required value={form.name} onChange={update('name')} className={inputClass} />
              </div>

              <div className="col-span-2">
                <label className="text-sm text-ink/70">Exact location for Google Maps</label>
                <input required value={form.address} onChange={update('address')} placeholder="Paste the exact address or Google Maps location" className={inputClass} />
              </div>

              {renderSingleImageUpload('coverImage', 'Cover page image', false)}

              {renderSingleImageUpload('aboutImage', 'About us image', false)}

              <div className="col-span-2">
                <label className="text-sm text-ink/70">Description</label>
                <textarea rows={5} value={form.description} onChange={update('description')} placeholder="Optional: leave blank to use a description based on the business name and location." className={inputClass} />
              </div>

              <div className="col-span-2">
                <label className="text-sm text-ink/70">Services (comma separated)</label>
                <input value={form.services} onChange={update('services')} placeholder="Car Service, Repairs, Detailing, Diagnostics" className={inputClass} />
              </div>

              <div className="col-span-2">
                <label className="text-sm text-ink/70">Gallery images (multiple uploads)</label>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {(uploadedFiles.galleryImages || []).map((image, index) => (
                    <div key={`${image}-${index}`} className="overflow-hidden rounded border border-line bg-white">
                      <img src={image} alt={`Gallery ${index + 1}`} className="h-24 w-full object-contain" />
                      <div className="flex gap-2 p-2">
                        <button type="button" onClick={() => removeUploadedImage('galleryImages', index)} className="flex-1 rounded border border-vermilion/40 bg-vermilion/5 px-2 py-1 text-[11px] font-medium text-vermilion hover:bg-vermilion/10">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <label className="flex min-h-[110px] cursor-pointer items-center justify-center rounded border border-dashed border-line bg-white px-3 py-4 text-center text-xs text-ink/60 hover:border-ink/40">
                    Add photos
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleLocalFiles('galleryImages', e.target.files, true)} />
                  </label>
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-sm text-ink/70">Videos (optional, URL format, multiple allowed)</label>
                <textarea rows={3} value={form.videoUrls} onChange={update('videoUrls')} placeholder="https://www.youtube.com/watch?v=..., https://example.com/video.mp4" className={inputClass} />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-ink/70">Phone</label>
                <input value={form.phone} onChange={update('phone')} className={inputClass} />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-ink/70">Email</label>
                <input type="email" value={form.email} onChange={update('email')} className={inputClass} />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-ink/70">WhatsApp</label>
                <input value={form.whatsapp} onChange={update('whatsapp')} placeholder="WhatsApp number or https://wa.me/..." className={inputClass} />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-ink/70">Instagram</label>
                <input value={form.instagram} onChange={update('instagram')} placeholder="Instagram ID or https://instagram.com/..." className={inputClass} />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-ink/70">Facebook</label>
                <input value={form.facebook} onChange={update('facebook')} placeholder="https://facebook.com/..." className={inputClass} />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-ink/70">Website</label>
                <input value={form.website} onChange={update('website')} placeholder="https://" className={inputClass} />
              </div>
            </>
          )}

          {!isAutomotiveCategory && !isShoppingCategory && (
            <>
              <div className="col-span-2">
                <label className="text-sm text-ink/70">Business name</label>
                <input required value={form.name} onChange={update('name')} className={inputClass} />
              </div>

              <div className="col-span-2">
                <label className="text-sm text-ink/70">Address</label>
                <input required value={form.address} onChange={update('address')} className={inputClass} />
              </div>

              <div className="col-span-2">
                <label className="text-sm text-ink/70">Description</label>
                <textarea rows={4} value={form.description} onChange={update('description')} placeholder="Optional: leave blank to use a description based on the business name and location." className={inputClass} />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-ink/70">Phone</label>
                <input value={form.phone} onChange={update('phone')} className={inputClass} />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-ink/70">Email</label>
                <input type="email" value={form.email} onChange={update('email')} className={inputClass} />
              </div>

              {renderSingleImageUpload('logo', 'Business logo')}

              <div className="col-span-2">
                <label className="text-sm text-ink/70">Services (comma-separated)</label>
                <input value={form.services} onChange={update('services')} className={inputClass} />
              </div>

              {renderSingleImageUpload('coverImage', 'Cover image', false)}

              {renderSingleImageUpload('aboutImage', 'About us image', false)}

              <div className="col-span-2">
                <label className="text-sm text-ink/70">Gallery images (multiple uploads)</label>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {(uploadedFiles.galleryImages || []).map((image, index) => (
                    <div key={`${image}-${index}`} className="overflow-hidden rounded border border-line bg-white">
                      <img src={image} alt={`Gallery ${index + 1}`} className="h-24 w-full object-contain" />
                      <button type="button" onClick={() => removeUploadedImage('galleryImages', index)} className="w-full border-t border-line bg-vermilion/5 px-2 py-2 text-[11px] font-medium text-vermilion hover:bg-vermilion/10">
                        Remove
                      </button>
                    </div>
                  ))}
                  <label className="flex min-h-[110px] cursor-pointer items-center justify-center rounded border border-dashed border-line bg-white px-3 py-4 text-center text-xs text-ink/60 hover:border-ink/40">
                    Add photos
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleLocalFiles('galleryImages', e.target.files, true)} />
                  </label>
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-sm text-ink/70">Video URLs</label>
                <textarea rows={3} value={form.videoUrls} onChange={update('videoUrls')} className={inputClass} />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-ink/70">Facebook</label>
                <input value={form.facebook} onChange={update('facebook')} className={inputClass} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-ink/70">Instagram</label>
                <input value={form.instagram} onChange={update('instagram')} className={inputClass} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-ink/70">WhatsApp</label>
                <input value={form.whatsapp} onChange={update('whatsapp')} className={inputClass} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-ink/70">Chat support</label>
                <input value={form.chatSupport} onChange={update('chatSupport')} className={inputClass} />
              </div>
            </>
          )}

          {error && <p className="col-span-2 text-sm text-vermilion">{error}</p>}
          {success && <p className="col-span-2 text-sm text-moss">{success}</p>}

          <button type="submit" disabled={submitting} className="col-span-2 mt-2 rounded bg-ink py-2.5 text-[15px] font-medium text-paper transition hover:bg-ink-light disabled:opacity-60">
            {submitting ? 'Submitting…' : id ? 'Save changes' : 'Submit for approval'}
          </button>
        </form>
      </div>
    </div>
  );
}
