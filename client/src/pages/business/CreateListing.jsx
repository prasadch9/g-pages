import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import LocationCascadeFields from '../../components/LocationCascadeFields';
import { BUSINESS_PAGE_TYPES } from '../../data/businessPageConfig';
import { CATEGORY_GROUPS } from '../../data/categoryGroups';
import CollegeRegistrationFields from '../../components/CollegeRegistrationFields';
import UniversityRegistrationFields from '../../components/UniversityRegistrationFields';
import CategorySpecificFields from '../../components/business/CategorySpecificFields';
import FoodBusinessSpecificFields from '../../components/business/FoodBusinessSpecificFields';
import WeddingBusinessSpecificFields from '../../components/business/WeddingBusinessSpecificFields';
import mediaUrl from '../../utils/mediaUrl';

const initialLocation = { state: '', district: '', city: '', area: '', areaText: '' };
const MALL_DAYS = [['mon', 'Monday'], ['tue', 'Tuesday'], ['wed', 'Wednesday'], ['thu', 'Thursday'], ['fri', 'Friday'], ['sat', 'Saturday'], ['sun', 'Sunday']];
const initialForm = {
  name: '',
  mainCategory: '',
  category: '',
  subcategory: '',
  pageType: 'static',
  address: '',
  description: '',
  phone: '',
  email: '',
  website: '',
  services: '',
  facilities: '',
  board: '',
  curriculum: '',
  classes: '',
  type: '',
  gender: '',
  admission: '',
  facebook: '',
  instagram: '',
  youtube: '',
  whatsapp: '',
  chatSupport: '',
  videoUrls: '',
  tagline: '',
  establishedYear: '',
  medium: '',
  studentCapacity: '',
  studentTeacherRatio: '',
  totalStudents: '',
  landmark: '',
  pincode: '',
  linkedin: '',
  socialVisibility: { facebook: true, instagram: true, youtube: true, linkedin: true },
  schoolHistory: '',
  whyChooseUs: '',
  teachingMethod: '',
  languages: [],
  academicActivities: '',
  principalName: '',
  principalDesignation: 'Principal',
  principalQualification: '',
  principalExperience: '',
  admissionStatus: 'open',
  admissionClasses: [],
  ageCriteria: '',
  requiredDocuments: [],
  enquiryPhone: '',
  showFees: true,
  admissionFee: '',
  tuitionFee: '',
  transportFee: '',
  otherCharges: '',
  principalMessage: '',
  vision: '',
  mission: '',
  faculty: '',
  achievements: '',
  events: '',
  admissionProcess: '',
  eligibility: '',
  feeInformation: '',
  studentName: '',
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

function CheckboxGroup({ label, items, values, onChange }) {
  const toggle = (item) => onChange(values.includes(item) ? values.filter((value) => value !== item) : [...values, item]);
  return <fieldset className="col-span-2"><legend className="text-sm font-semibold text-ink/75">{label}</legend><div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <label key={item} className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#d9e2ec] bg-white px-3 py-2.5 text-sm text-ink/75 transition hover:border-[#168b9a] hover:bg-[#f1fbf8]"><input type="checkbox" checked={values.includes(item)} onChange={() => toggle(item)} className="h-4 w-4 accent-[#168b9a]" />{item}</label>)}</div></fieldset>;
}

export default function CreateListing() {
  const navigate = useNavigate();
  const { id: editId } = useParams();
  const id = editId;
  const isEditing = Boolean(editId);
  const [categories, setCategories] = useState([]);
  const [location, setLocation] = useState(initialLocation);
  const [form, setForm] = useState(initialForm);
  const [travelDetails, setTravelDetails] = useState({});
  const [foodDetails, setFoodDetails] = useState({});
  const [weddingDetails, setWeddingDetails] = useState({});
  const [shoppingDetails, setShoppingDetails] = useState({});
  const [mallCollectionDetails, setMallCollectionDetails] = useState([]);
  const [mallVideos, setMallVideos] = useState([]);
  const [mallVideoUrl, setMallVideoUrl] = useState('');
  const [mallVideoCaption, setMallVideoCaption] = useState('');
  const [workingHours, setWorkingHours] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({ logo: '', coverImage: '', aboutImage: '', galleryImages: [] });
  const [coverFile, setCoverFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [footerLogoFile, setFooterLogoFile] = useState(null);
  const [principalImageFile, setPrincipalImageFile] = useState(null);
  const [aboutImageFile, setAboutImageFile] = useState(null);
  const [facilityImageFiles, setFacilityImageFiles] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [principalGalleryFiles, setPrincipalGalleryFiles] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [infrastructure, setInfrastructure] = useState([]);
  const [schoolFacilities, setSchoolFacilities] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [schoolVideos, setSchoolVideos] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [schoolEvents, setSchoolEvents] = useState([]);
  const [existingMedia, setExistingMedia] = useState({ logo: '', cover: '', about: '', principal: '', images: [], videos: [], faculty: [], infrastructure: [], facilities: [], events: [], principalGallery: [] });
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
      const existingVideos = place.attributes?.mallVideos?.length
        ? place.attributes.mallVideos
        : (place.attributes?.businessProfile?.common?.videos?.length
          ? place.attributes.businessProfile.common.videos
          : Array.isArray(place.video) ? place.video : place.video ? [place.video] : (place.videos || []));
      const categoryGroup = CATEGORY_GROUPS.find((group) => group.children.some((child) => child.toLowerCase() === subcategory.toLowerCase()));
      setForm({
        ...initialForm,
        name: place.name || '',
        mainCategory: categoryGroup?.name || '',
        category: place.category?._id || place.category || categoryGroup?.name || '',
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
        videoUrls: existingVideos.map((video) => typeof video === 'string' ? video : video.url).filter(Boolean).join('\n'),
      });
      setShoppingDetails(Object.fromEntries(Object.entries(place.attributes || {}).filter(([key]) => key !== 'subCategory')));
      setMallCollectionDetails(place.attributes?.mallCollections || (place.images || []).map((image) => ({ image, tag: 'New', caption: '', features: '' })));
      setMallVideos(existingVideos.map((video) => typeof video === 'string' ? { url: video, caption: '' } : video));
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

  const selectedCategoryName = form.mainCategory || form.category || '';

  const subcategoryOptions = useMemo(() => {
    const categoryGroup = CATEGORY_GROUPS.find((group) => group.name.toLowerCase() === selectedCategoryName.toLowerCase());
    return categoryGroup?.children || [];
  }, [selectedCategoryName]);

  const isAutomotiveCategory = selectedCategoryName.toLowerCase().includes('automotive') || form.subcategory.toLowerCase().includes('automotive');
  const isShoppingCategory = selectedCategoryName.toLowerCase() === 'shopping & retail' || form.subcategory.toLowerCase().includes('shopping');
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
    data.data.forEach((image, index) => { imageUrls[pendingIndexes[index]] = mediaUrl(image.url); });
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
            <img src={mediaUrl(value)} alt={label} className="h-28 w-full rounded border border-line object-contain" />
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

  useEffect(() => {
    if (!editId) return;
    api.get('/places/mine').then(({ data }) => {
      const place = data.data.find((item) => item._id === editId);
      if (!place) throw new Error('Listing not found.');
      const attributes = place.attributes || {};
      const principal = attributes.principal || {};
      const admissionDetails = attributes.admissionDetails || {};
      const fees = attributes.fees || {};
      setForm((current) => ({ ...current, name: place.name || '', category: place.category?._id || place.category || '', subcategory: place.subcategory || place.category?.name || '', mainCategory: place.categoryGroup || '', address: place.address || '', description: place.description || '', phone: place.phone || '', email: place.email || '', website: place.website || '', services: (place.services || []).join(', '), facilities: (place.facilities || []).join(', '), pageType: place.pageType || 'static', facebook: place.socialLinks?.facebook || '', instagram: place.socialLinks?.instagram || '', whatsapp: place.socialLinks?.whatsapp || '', youtube: place.socialLinks?.youtube || '', linkedin: place.socialLinks?.linkedin || '', ...place.attributes }));
      setTravelDetails(place.attributes?.businessProfile?.categorySpecific || place.attributes?.travelDetails || {});
      setFoodDetails(place.attributes?.businessProfile?.categorySpecific || place.attributes?.foodDetails || {});
      setWeddingDetails(place.attributes?.businessProfile?.categorySpecific || place.attributes?.weddingDetails || {});
      setForm((current) => ({ ...current, principalName: principal.name || '', principalDesignation: principal.designation || 'Principal', principalQualification: principal.qualification || '', principalExperience: principal.experience || '', principalMessage: principal.message || attributes.principalMessage || '', admissionStatus: admissionDetails.status || 'open', admissionClasses: admissionDetails.classes || [], ageCriteria: admissionDetails.ageCriteria || '', requiredDocuments: admissionDetails.requiredDocuments || [], enquiryPhone: admissionDetails.enquiryPhone || '', admissionProcess: admissionDetails.process || attributes.admissionProcess || '', eligibility: admissionDetails.eligibility || attributes.eligibility || '', showFees: fees.show !== false, admissionFee: fees.admission || '', tuitionFee: fees.tuition || '', transportFee: fees.transport || '', otherCharges: fees.other || '', feeInformation: fees.description || attributes.feeInformation || '' }));
      setLocation({ state: place.location?.state?._id || place.location?.state || '', district: place.location?.district?._id || place.location?.district || '', city: place.location?.city?._id || place.location?.city || '', area: place.location?.area?._id || place.location?.area || '' });
      setFaculty(attributes.faculty || []);
      setInfrastructure(attributes.infrastructure || []);
      setSchoolFacilities(attributes.schoolFacilities || []);
      setGalleryItems(attributes.galleryItems || []);
      setSchoolVideos(attributes.schoolVideos || []);
      setAchievements(attributes.achievements || []);
      setSchoolEvents(attributes.schoolEvents || []);
      setExistingMedia({ logo: place.logo || '', cover: place.coverImage || '', about: attributes.aboutImage || '', principal: attributes.principalImage || '', images: [...new Set([...(place.images || []), ...(attributes.galleryImages || [])])], videos: Array.isArray(place.video) ? place.video : place.video ? [place.video] : [], faculty: attributes.facultyImages || [], infrastructure: attributes.infrastructureImages || [], facilities: attributes.facilityImages || [], events: attributes.eventImages || [], principalGallery: attributes.principalGallery || [] });
    }).catch((err) => setError(err.message));
  }, [editId]);

  const selectedCategory = categories.find((category) => category._id === form.category);
  const selectedGroup = CATEGORY_GROUPS.find((group) => group.name === form.mainCategory);
  const isSchool = selectedCategory?.name?.toLowerCase() === 'schools';
  const isCollege = selectedCategory?.name?.toLowerCase() === 'colleges';
  const categoryName = (selectedCategory?.name || form.subcategory || '').toLowerCase().trim();
  const isUniversity = ['university', 'universities'].includes(categoryName);
  const isTravelCategory = form.mainCategory === 'Travel & Hospitality';
  const isFoodCategory = form.mainCategory === 'Food & Dining';
  const isWeddingCategory = form.mainCategory === 'Marriage & Wedding';
  const foodBusinessType = ({ Restaurant: 'restaurant', Restaurants: 'restaurant', 'Coffee Shop': 'coffee-shop', 'Coffee Shops': 'coffee-shop', 'Sweet Shop & Bakery': 'bakery', 'Sweet Shops & Bakery': 'bakery', 'Catering Service': 'catering', 'Catering Services': 'catering', 'Food Processing': 'food-processing' })[form.subcategory] || 'restaurant';
  const weddingBusinessType = ({ 'Marriage Bureaus': 'marriage-bureau', 'Function Halls': 'function-hall', 'Event Organizers': 'event-organizer', 'Catering Services': 'catering-service', 'Flower Decoration': 'flower-decoration', 'Fashion Designers': 'fashion-designer', 'Beauty Parlours': 'beauty-parlour', 'Saloon & Spa': 'saloon-spa' })[form.subcategory] || 'event-organizer';

  const selectMainCategory = (e) => {
    setTravelDetails({});
    setFoodDetails({});
    setWeddingDetails({});
    setMallVideos([]);
    setMallVideoUrl('');
    setMallVideoCaption('');
    setForm({ ...form, mainCategory: e.target.value, category: '', subcategory: '' });
  };

  const selectSubcategory = (e) => {
    const category = categories.find((item) => item.name.toLowerCase() === e.target.value.toLowerCase());
    if (category?.name?.toLowerCase() === 'solar') {
      navigate(`/business/listings/new/solar?category=${category._id}`);
      return;
    }
    setTravelDetails({});
    setFoodDetails({});
    setWeddingDetails({});
    setMallVideos([]);
    setMallVideoUrl('');
    setMallVideoCaption('');
    setForm({ ...form, category: category?._id || '', subcategory: category?.name || e.target.value });
  };

  const updateArrayField = (field) => (e) => setForm({ ...form, [field]: Array.from(e.target.selectedOptions).map((option) => option.value) });
  const updateItem = (setter, index, field, value) => setter((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  const addItem = (setter, item) => setter((items) => [...items, item]);
  const removeItem = (setter, index) => setter((items) => items.filter((_, itemIndex) => itemIndex !== index));
  const schoolClasses = ['Nursery', 'LKG', 'UKG', 'Class 1–5', 'Class 6–8', 'Class 9–10', 'Class 11–12'];
  const languages = ['English', 'Telugu', 'Hindi', 'Other'];
  const documents = ['Birth Certificate', 'Previous School Records', 'Aadhaar / ID Proof', 'Passport Photos', 'Transfer Certificate'];

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

    const hasCoverImage = isSchool ? Boolean(coverFile || existingMedia.cover) : Boolean(uploadedFiles.coverImage);
    if (!hasCoverImage) {
      setError('Cover page image is required.');
      return;
    }

    if (!isSchool && !uploadedFiles.aboutImage) {
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
/*
      const [logo, coverImage, aboutImage, galleryImages, mallVideoUrls] = await Promise.all([
        uploadSingleImage(uploadedFiles.logo),
        uploadSingleImage(uploadedFiles.coverImage),
        uploadSingleImage(uploadedFiles.aboutImage),
        uploadImages(uploadedFiles.galleryImages || []),
        (isShoppingCategory && form.subcategory === 'Shopping Malls') || isAutomotiveCategory || isWeddingCategory ? uploadMallVideos(mallVideos) : Promise.resolve(splitList(form.videoUrls)),
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
          ...(isFoodCategory ? { foodDetails, businessProfile: { businessType: foodBusinessType, categorySpecific: foodDetails } } : {}),
          ...(isWeddingCategory ? { weddingDetails, businessProfile: { businessType: weddingBusinessType, categorySpecific: weddingDetails } } : {}),
          ...(isShoppingCategory ? Object.fromEntries(Object.entries(shoppingDetails).filter(([, value]) => String(value || '').trim())) : {}),
          ...(isShoppingCategory && form.subcategory === 'Shopping Malls' ? { mallCollections, mallVideos: mallVideoDetails } : {}),
        },
        workingHours: workingHours.filter((entry) => entry.open || entry.close || entry.closed),
        location: {
*/
      const payload = new FormData();
      const galleryUrls = [];
      const appendImage = (field, value, filename) => {
        if (!value) return;
        if (value.startsWith('data:')) payload.append(field, dataUrlToBlob(value), filename);
        else payload.append(field, value);
      };
      appendImage('logo', uploadedFiles.logo, 'business-logo.jpg');
      appendImage('coverImage', uploadedFiles.coverImage, 'business-cover.jpg');
      appendImage('aboutImage', uploadedFiles.aboutImage, 'business-about.jpg');
      (uploadedFiles.galleryImages || []).forEach((image, index) => {
        if (image.startsWith('data:')) payload.append('images', dataUrlToBlob(image), `gallery-${index + 1}.jpg`);
        else galleryUrls.push(image);
      });
      ['name', 'category', 'subcategory', 'address', 'description', 'phone', 'email', 'website'].forEach((field) => {
        if (form[field]) payload.append(field, form[field]);
      });
      if (galleryUrls.length) payload.append('images', JSON.stringify(galleryUrls));
      payload.append('pageType', form.pageType);
      payload.append('services', JSON.stringify(splitList(form.services)));
      payload.append('facilities', JSON.stringify(splitList(form.facilities)));
      payload.append('socialLinks', JSON.stringify({
          facebook: form.socialVisibility.facebook ? form.facebook || undefined : undefined,
          instagram: form.socialVisibility.instagram ? form.instagram || undefined : undefined,
          youtube: form.socialVisibility.youtube ? form.youtube || undefined : undefined,
          linkedin: form.socialVisibility.linkedin ? form.linkedin || undefined : undefined,
          whatsapp: form.whatsapp || undefined,
        }));
      const mallCollectionDetailsPayload = (uploadedFiles.galleryImages || []).map((image, index) => {
        const details = mallCollectionDetails[index] || {};
        return { image, tag: details.tag || 'New', caption: details.caption?.trim() || '', features: Array.isArray(details.features) ? details.features : splitList(details.features) };
      });
      const linkedBusinessVideos = mallVideos.filter((video) => !video.file && video.url).map((video) => video.url);
      payload.append('video', JSON.stringify(linkedBusinessVideos));
      mallVideos.filter((video) => video.file).forEach((video) => payload.append('videos', video.file));
      payload.append('attributes', JSON.stringify({
          // Preserve category-specific form fields, including the college
          // registration sections, in the public page data.
          ...form,
          ...(isTravelCategory ? { travelDetails, businessProfile: { categorySpecific: travelDetails } } : {}),
          ...(isFoodCategory ? { foodDetails, businessProfile: { businessType: foodBusinessType, categorySpecific: foodDetails } } : {}),
          ...(isWeddingCategory ? { weddingDetails, businessProfile: { businessType: weddingBusinessType, categorySpecific: weddingDetails } } : {}),
          subCategory: form.subcategory || undefined,
          ...(isShoppingCategory ? Object.fromEntries(Object.entries(shoppingDetails).filter(([, value]) => String(value || '').trim())) : {}),
          ...(isShoppingCategory && form.subcategory === 'Shopping Malls' ? { mallCollections: mallCollectionDetailsPayload, mallVideos: mallVideos.map((video) => ({ url: video.url || '', caption: video.caption || '' })) } : {}),
          workingHours: workingHours.filter((entry) => entry.open || entry.close || entry.closed),
          courses: form.collegeType === 'Intermediate College' ? form.collegeGroups : form.collegePrograms,
          admissions: form.admissionProcess,
          placements: form.placementAvailable === 'Yes' ? [
            form.placementOfficer && `Placement officer: ${form.placementOfficer}`,
            form.averagePackage && `Average package: ${form.averagePackage}`,
            form.highestPackage && `Highest package: ${form.highestPackage}`,
            form.recruitingCompanies && `Recruiters: ${form.recruitingCompanies}`,
          ].filter(Boolean) : [],
          board: form.board || undefined,
          curriculum: form.curriculum || undefined,
          classes: form.classes || undefined,
          type: form.type || undefined,
          gender: form.gender || undefined,
          admission: form.admission || undefined,
          tagline: form.tagline || undefined,
          establishedYear: form.establishedYear || undefined,
          medium: form.medium || undefined,
          studentCapacity: form.studentCapacity || undefined,
          studentTeacherRatio: form.studentTeacherRatio || undefined,
          principalMessage: form.principalMessage || undefined,
          vision: form.vision || undefined,
          mission: form.mission || undefined,
          admissionProcess: form.admissionProcess || undefined,
          eligibility: form.eligibility || undefined,
          feeInformation: form.feeInformation || undefined,
          studentName: form.studentName || undefined,
          totalStudents: form.totalStudents || undefined,
          landmark: form.landmark || undefined,
          pincode: form.pincode || undefined,
          schoolHistory: form.schoolHistory || undefined,
          whyChooseUs: form.whyChooseUs || undefined,
          teachingMethod: form.teachingMethod || undefined,
          languages: form.languages,
          academicActivities: form.academicActivities || undefined,
          principal: { name: form.principalName, designation: form.principalDesignation, qualification: form.principalQualification, experience: form.principalExperience, message: form.principalMessage },
          admissionDetails: { status: form.admissionStatus, classes: form.admissionClasses, eligibility: form.eligibility, ageCriteria: form.ageCriteria, requiredDocuments: form.requiredDocuments, process: form.admissionProcess, enquiryPhone: form.enquiryPhone },
          fees: { show: form.showFees, admission: form.admissionFee, tuition: form.tuitionFee, transport: form.transportFee, other: form.otherCharges, description: form.feeInformation },
          faculty: faculty.map(({ photoFiles, ...item }) => item),
          infrastructure: infrastructure.map(({ imageFiles, ...item }) => item),
          schoolFacilities: schoolFacilities.map(({ imageFiles, ...item }) => item),
          galleryItems: galleryItems.map(({ files, ...item }) => item),
          schoolVideos: schoolVideos.map(({ file, ...item }) => item),
          achievements: achievements.map(({ imageFiles, ...item }) => item),
          schoolEvents: schoolEvents.map(({ imageFiles, ...item }) => item),
          ...(isUniversity ? {
            university: form.university,
            programs: form.university?.programs || [],
            facilities: form.university?.facilities || [],
            stats: form.university?.stats || [],
            aboutTitle: form.university?.aboutTitle,
            aboutDescription: form.university?.aboutDescription,
            heroWelcome: form.heroWelcome,
            heroHeading: form.heroHeading,
            heroSubheading: form.heroSubheading,
            rankingEnabled: form.university?.rankingEnabled,
            rank: form.university?.rank,
            rankingDescription: form.university?.rankingDescription,
            rankingOrganization: form.university?.rankingOrganization,
            rankingYear: form.university?.rankingYear,
            campusTitle: form.university?.campusTitle,
            campusDescription: form.university?.campusDescription,
            showAdmission: form.university?.showAdmission,
            admissionTitle: form.university?.admissionTitle,
            admissionDescription: form.university?.admissionDescription,
          } : {}),
        }));
      payload.append('location', JSON.stringify({
  // Current automotive and shopping fields are included in the shared attributes payload below.
          state: location.state,
          district: location.district,
          city: location.city,
          area: location.area || undefined,
/*
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
*/
        }));
      if (coverFile) payload.append('coverImage', coverFile);
      if (logoFile) payload.append('logo', logoFile);
      if (footerLogoFile) payload.append('footerLogo', footerLogoFile);
      if (principalImageFile) payload.append('principalImage', principalImageFile);
      if (aboutImageFile) payload.append('aboutImage', aboutImageFile);
      galleryFiles.forEach((file) => payload.append('images', file));
      facilityImageFiles.forEach((file) => payload.append('facilityImages', file));
      videoFiles.forEach((file) => payload.append('videos', file));
      principalGalleryFiles.forEach((file) => payload.append('principalGallery', file));
      faculty.forEach((item) => (item.photoFiles || []).forEach((file) => payload.append('facultyImages', file)));
      infrastructure.forEach((item) => (item.imageFiles || []).forEach((file) => payload.append('infrastructureImages', file)));
      schoolFacilities.forEach((item) => (item.imageFiles || []).forEach((file) => payload.append('facilityImages', file)));
      galleryItems.forEach((item) => (item.files || []).forEach((file) => payload.append('galleryImages', file)));
      schoolVideos.forEach((item) => (item.file ? payload.append('schoolVideoFiles', item.file) : null));
      schoolEvents.forEach((item) => (item.imageFiles || []).forEach((file) => payload.append('eventImages', file)));

      let editedLogo = uploadedFiles.logo;
      let editedCoverImage = uploadedFiles.coverImage;
      let editedAboutImage = uploadedFiles.aboutImage;
      let editedGalleryImages = uploadedFiles.galleryImages || [];
      let editedVideoUrls = linkedBusinessVideos;
      if (isEditing) {
        [editedLogo, editedCoverImage, editedAboutImage, editedGalleryImages, editedVideoUrls] = await Promise.all([
          uploadSingleImage(uploadedFiles.logo),
          uploadSingleImage(uploadedFiles.coverImage),
          uploadSingleImage(uploadedFiles.aboutImage),
          uploadImages(uploadedFiles.galleryImages || []),
          (isShoppingCategory && form.subcategory === 'Shopping Malls') || isAutomotiveCategory || isFoodCategory || isWeddingCategory ? uploadMallVideos(mallVideos) : Promise.resolve(splitList(form.videoUrls)),
        ]);
      }
      const editableData = {
        name: form.name,
        category: categoryId || form.category,
        categoryGroup: form.mainCategory,
        subcategory: form.subcategory,
        pageType: form.pageType,
        location: { ...location, area: location.area || null },
        address: form.address,
        description: form.description,
        phone: form.phone,
        email: form.email,
        website: form.website,
        services: splitList(form.services),
        facilities: splitList(form.facilities),
        socialLinks: { facebook: form.facebook, instagram: form.instagram, youtube: form.youtube, linkedin: form.linkedin, whatsapp: form.whatsapp },
        logo: editedLogo || undefined,
        coverImage: editedCoverImage || undefined,
        aboutImage: editedAboutImage || undefined,
        images: editedGalleryImages,
        videos: editedVideoUrls,
        workingHours: workingHours.filter((entry) => entry.open || entry.close || entry.closed),
        attributes: { ...form, ...(isTravelCategory ? { travelDetails, businessProfile: { categorySpecific: travelDetails } } : {}), ...(isFoodCategory ? { foodDetails, businessProfile: { businessType: foodBusinessType, categorySpecific: foodDetails } } : {}), subCategory: form.subcategory || undefined, ...(isShoppingCategory ? Object.fromEntries(Object.entries(shoppingDetails).filter(([, value]) => String(value || '').trim())) : {}), ...(isShoppingCategory && form.subcategory === 'Shopping Malls' ? { mallCollections: mallCollectionDetailsPayload, mallVideos: mallVideos.map((video) => ({ url: video.url || '', caption: video.caption || '' })) } : {}), courses: form.collegeType === 'Intermediate College' ? form.collegeGroups : form.collegePrograms, admissions: form.admissionProcess, placements: form.placementAvailable === 'Yes' ? [form.placementOfficer && `Placement officer: ${form.placementOfficer}`, form.averagePackage && `Average package: ${form.averagePackage}`, form.highestPackage && `Highest package: ${form.highestPackage}`, form.recruitingCompanies && `Recruiters: ${form.recruitingCompanies}`].filter(Boolean) : [], socialVisibility: undefined, faculty, infrastructure, schoolFacilities, galleryItems, schoolVideos, achievements, schoolEvents, principalImage: existingMedia.principal || undefined, aboutImage: editedAboutImage || undefined, galleryImages: editedGalleryImages, workingHours: workingHours.filter((entry) => entry.open || entry.close || entry.closed), ...(isUniversity ? { university: form.university, programs: form.university?.programs || [], facilities: form.university?.facilities || [], stats: form.university?.stats || [], aboutTitle: form.university?.aboutTitle, aboutDescription: form.university?.aboutDescription, rankingEnabled: form.university?.rankingEnabled, rank: form.university?.rank, rankingDescription: form.university?.rankingDescription, campusTitle: form.campusTitle, campusDescription: form.campusDescription, showAdmission: form.university?.showAdmission, admissionTitle: form.university?.admissionTitle, admissionDescription: form.university?.admissionDescription } : {}) },
      };
      if (isWeddingCategory) {
        editableData.attributes.weddingDetails = weddingDetails;
        editableData.attributes.businessProfile = {
          ...(editableData.attributes.businessProfile || {}),
          businessType: weddingBusinessType,
          categorySpecific: weddingDetails,
        };
      }
      await (isEditing ? api.put(`/places/${editId}`, editableData) : api.post('/places', payload));
      setSuccess(isEditing ? 'Changes updated successfully.' : 'Listing submitted! It will appear publicly once an admin approves it.');
      setTimeout(() => navigate('/business/dashboard'), 1600);
    } catch (err) {
      setError(err.message || 'Something went wrong while submitting the listing.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-ink/40';

  return (
    <>
    <div className="min-h-screen bg-[linear-gradient(135deg,#effaf8_0%,#fff8ec_48%,#f3f0ff_100%)] py-8 sm:py-12">
      <div className="container-page">
        <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-[#12395a] px-6 py-8 text-white shadow-[0_20px_55px_rgba(18,57,90,.22)] sm:px-10 sm:py-10">
          <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border-[28px] border-[#f5d98d]/25" />
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#f5d98d]">Google Pages business studio</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#f5d98d]">Google Pages business studio</p>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold sm:text-5xl">{isEditing ? 'Edit your business page.' : 'Build a page people remember.'}</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">Choose your category first. We will shape the listing form around the kind of business you run.</p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold"><span className="rounded-full bg-white/10 px-3 py-1.5">01 Category</span><span className="rounded-full bg-white/10 px-3 py-1.5">02 Story</span><span className="rounded-full bg-white/10 px-3 py-1.5">03 Publish</span></div>
        </div>
        <p className="mt-1 text-sm text-ink/55">
          {isEditing ? 'Update your listing directly. Your current publication status will stay unchanged.' : 'Submitted listings go live after a quick admin review — usually within 24 hours.'}
        </p>

        <form noValidate={isEditing} onSubmit={handleSubmit} className="school-form mt-8 grid grid-cols-2 gap-4">
          {isSchool && <div className="col-span-2 rounded-xl border border-[#d8c9f3] bg-[#faf8ff] p-5 sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6950a8]">Social media display options</p><div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{[['facebook', 'Facebook'], ['instagram', 'Instagram'], ['youtube', 'YouTube'], ['linkedin', 'LinkedIn']].map(([field, label]) => <label key={field} className="flex items-center gap-2 rounded-lg border border-[#e5dcf7] bg-white px-3 py-2.5 text-sm text-ink/75"><input type="checkbox" checked={form.socialVisibility[field]} onChange={(e) => setForm({ ...form, socialVisibility: { ...form.socialVisibility, [field]: e.target.checked } })} className="h-4 w-4 accent-[#6950a8]" />Show {label} on public page</label>)}</div><p className="mt-2 text-xs text-ink/50">Add the corresponding URL in the Social media section below.</p></div>}

          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm font-semibold text-ink">Main category</label>
            <select required value={form.mainCategory} onChange={selectMainCategory} className={inputClass}>
              <option value="">Select main category</option>
              {CATEGORY_GROUPS.map((group) => <option key={group.name} value={group.name}>{group.name}</option>)}
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm font-semibold text-ink">Subcategory</label>
            <select required disabled={!selectedGroup} value={form.subcategory} onChange={selectSubcategory} className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-50`}>
              <option value="">{selectedGroup ? 'Select subcategory' : 'Choose main category first'}</option>
              {selectedGroup?.children.filter((name) => categories.some((category) => category.name.toLowerCase() === name.toLowerCase())).map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
            <p className="mt-1 text-xs text-ink/45">Your public page modules will follow this choice.</p>
          </div>
          {!isAutomotiveCategory && !isShoppingCategory && <div className="col-span-2">
            <label className="text-sm text-ink/70">Business name</label>
            <input required value={form.name} onChange={update('name')} className={inputClass} />
          </div>}
          {!isAutomotiveCategory && !isShoppingCategory && <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">Phone</label>
            <input value={form.phone} onChange={update('phone')} className={inputClass} />
          </div>}

          {!isAutomotiveCategory && !isShoppingCategory && !isFoodCategory && !isWeddingCategory && <div className="col-span-2">
            <fieldset>
              <legend className="text-sm font-semibold text-ink">Choose your business page</legend>
              <p className="mt-1 text-xs text-ink/50">You can select the presentation style {isEditing ? 'before updating your listing.' : 'before submitting for admin approval.'}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {Object.entries(BUSINESS_PAGE_TYPES).map(([value, option]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm({ ...form, pageType: value })}
                    className={`rounded-xl border p-4 text-left transition ${form.pageType === value ? 'border-ink bg-[#eef5f7] shadow-md ring-2 ring-[#d6e9ed]' : 'border-line bg-white hover:border-[#a7cbd2]'}`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-display text-lg font-semibold text-ink">{option.label}</span>
                      <span className={`h-4 w-4 rounded-full border-2 ${form.pageType === value ? 'border-[#17324d] bg-[#17324d] ring-2 ring-white ring-offset-1' : 'border-line'}`} />
                    </span>
                    <span className="mt-2 block text-xs leading-relaxed text-ink/55">{option.description}</span>
                    <span className="mt-3 block text-[11px] font-semibold uppercase tracking-wide text-[#a47b2c]">{value === 'dynamic' ? 'Media + premium modules' : 'Essential business profile'}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          </div>}

          <LocationCascadeFields value={location} onChange={setLocation} />

          {isFoodCategory && <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">Pincode</label>
            <input inputMode="numeric" maxLength={6} value={form.pincode} onChange={update('pincode')} placeholder="6 digit pincode" className={inputClass} />
          </div>}

          {!isAutomotiveCategory && !isShoppingCategory && <div className="col-span-2">
            <label className="text-sm text-ink/70">Address</label>
            <input required value={form.address} onChange={update('address')} className={inputClass} />
          </div>}

          {!isAutomotiveCategory && !isShoppingCategory && <div className="col-span-2">
            <label className="text-sm text-ink/70">Description</label>
            <textarea required rows={4} value={form.description} onChange={update('description')} className={inputClass} />
          </div>}

          {isFoodCategory && form.subcategory && (
            <div className="col-span-2">
              <FoodBusinessSpecificFields businessType={foodBusinessType} values={foodDetails} onChange={setFoodDetails} />
            </div>
          )}

          {isWeddingCategory && form.subcategory && (
            <div className="col-span-2">
              <WeddingBusinessSpecificFields businessType={weddingBusinessType} values={weddingDetails} onChange={setWeddingDetails} />
            </div>
          )}

          {(isFoodCategory || isWeddingCategory) && form.subcategory && <section className="col-span-2 rounded-xl border border-[#ebded8] bg-white p-5 sm:p-7">
            <h2 className="font-display text-xl font-semibold text-ink">Business Hours</h2>
            <p className="mt-1 text-sm text-ink/55">Set opening and closing times for each day. Mark days when the business is closed.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">{MALL_DAYS.map(([day, label]) => {
              const entry = workingHours.find((item) => item.day === day) || { day, open: '', close: '', closed: false };
              const updateHours = (changes) => setWorkingHours((current) => [...current.filter((item) => item.day !== day), { ...entry, ...changes }]);
              return <div key={day} className="grid items-center gap-2 rounded-lg border border-[#ebded8] p-3 sm:grid-cols-[90px_1fr_1fr_auto]">
                <span className="text-sm font-medium">{label}</span>
                <input type="time" value={entry.open || ''} disabled={entry.closed} onChange={(event) => updateHours({ open: event.target.value })} className={`${inputClass} disabled:bg-slate-100`} aria-label={`${label} opening time`} />
                <input type="time" value={entry.close || ''} disabled={entry.closed} onChange={(event) => updateHours({ close: event.target.value })} className={`${inputClass} disabled:bg-slate-100`} aria-label={`${label} closing time`} />
                <label className="flex items-center gap-2 text-xs text-ink/70"><input type="checkbox" checked={Boolean(entry.closed)} onChange={(event) => updateHours({ closed: event.target.checked })} />Closed</label>
              </div>;
            })}</div>
          </section>}

          {isTravelCategory && form.subcategory && (
            <section className="col-span-2 rounded-xl border border-[#b9ddc6] bg-[#f4fbf5] p-5 sm:p-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#167447]">{form.subcategory} website details</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-[#164e35]">Build your public website</h2>
              <p className="mt-1 text-sm text-ink/60">Enter each detail separately. These values appear in the matching public website section.</p>
              <div className="mt-5 rounded-lg border border-[#cde7d4] bg-white p-4">
                <CategorySpecificFields
                  groupName="Travel & Hospitality"
                  subcategoryName={form.subcategory}
                  values={travelDetails}
                  onChange={(field, value) => setTravelDetails((current) => ({ ...current, [field]: value }))}
                />
              </div>
            </section>
          )}

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
              <div className="col-span-2"><label className="text-sm text-ink/70">{form.subcategory === 'Shopping Malls' ? 'Latest collection images' : 'Gallery images'}</label><div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">{(uploadedFiles.galleryImages || []).map((image, index) => <div key={`${image}-${index}`} className="overflow-hidden rounded border border-line bg-white"><img src={mediaUrl(image)} alt={`Gallery ${index + 1}`} className="h-24 w-full object-contain" /><button type="button" onClick={() => removeUploadedImage('galleryImages', index)} className="w-full border-t border-line px-2 py-2 text-[11px] text-vermilion">Remove</button></div>)}<label className="flex min-h-[110px] cursor-pointer items-center justify-center rounded border border-dashed border-line bg-white px-3 py-4 text-center text-xs text-ink/60">Add photos<input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleLocalFiles('galleryImages', e.target.files, true)} /></label></div></div>
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

              <div className="col-span-2 rounded-xl border border-[#d9e2ec] bg-white p-4">
                <p className="text-sm font-semibold text-ink">Video showcase (optional)</p>
                <p className="mt-1 text-xs text-ink/60">Upload multiple video files or add video URLs. Videos appear on the automotive page only when added here.</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <input type="url" value={mallVideoUrl} onChange={(event) => setMallVideoUrl(event.target.value)} placeholder="YouTube or direct video URL" className={inputClass} />
                  <input value={mallVideoCaption} onChange={(event) => setMallVideoCaption(event.target.value)} placeholder="Video caption" className={inputClass} />
                  <button type="button" onClick={addMallVideoUrl} className="mt-1 rounded border border-[#0b3a5b] px-4 py-2 text-sm font-semibold text-[#0b3a5b]">Add URL</button>
                </div>
                <label className="mt-3 inline-flex cursor-pointer items-center rounded border border-dashed border-line px-4 py-3 text-xs font-semibold text-ink/70 hover:border-ink/40">Upload video files<input type="file" accept="video/mp4,video/webm,video/ogg,video/quicktime" multiple className="hidden" onChange={(event) => { handleMallVideoFiles(event.target.files); event.target.value = ''; }} /></label>
                {mallVideos.length > 0 && <div className="mt-3 grid gap-2">{mallVideos.map((video, index) => <div key={video.preview || video.url || index} className="grid items-center gap-2 rounded border border-line p-2 sm:grid-cols-[1fr_1fr_auto]"><span className="truncate text-xs text-ink/70">{video.file?.name || video.url}</span><input value={video.caption || ''} onChange={(event) => setMallVideos((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, caption: event.target.value } : item))} placeholder="Video caption" className={inputClass} /><button type="button" onClick={() => { if (video.preview) URL.revokeObjectURL(video.preview); setMallVideos((current) => current.filter((_, itemIndex) => itemIndex !== index)); }} className="rounded border border-vermilion/40 px-3 py-2 text-xs font-semibold text-vermilion">Remove</button></div>)}</div>}
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

          {!isAutomotiveCategory && !isShoppingCategory && !isSchool && !isCollege && !isUniversity && (
            <>
              {!isFoodCategory && !isWeddingCategory && <div className="col-span-2">
                <label className="text-sm text-ink/70">Business name</label>
                <input required value={form.name} onChange={update('name')} className={inputClass} />
              </div>}

              {!isFoodCategory && !isWeddingCategory && <div className="col-span-2">
                <label className="text-sm text-ink/70">Address</label>
                <input required value={form.address} onChange={update('address')} className={inputClass} />
              </div>}

              {!isFoodCategory && !isWeddingCategory && <div className="col-span-2">
                <label className="text-sm text-ink/70">Description</label>
                <textarea rows={4} value={form.description} onChange={update('description')} placeholder="Optional: leave blank to use a description based on the business name and location." className={inputClass} />
              </div>}

              {!isFoodCategory && !isWeddingCategory && <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-ink/70">Phone</label>
                <input value={form.phone} onChange={update('phone')} className={inputClass} />
              </div>}

              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-ink/70">Email</label>
                <input type="email" value={form.email} onChange={update('email')} className={inputClass} />
              </div>

          {(isFoodCategory || isWeddingCategory) && <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-ink/70">Website</label>
                <input type="url" value={form.website} onChange={update('website')} placeholder="https://" className={inputClass} />
              </div>}

              {renderSingleImageUpload('logo', 'Business logo')}

              {!isFoodCategory && !isWeddingCategory && <div className="col-span-2">
                <label className="text-sm text-ink/70">Services (comma-separated)</label>
                <input value={form.services} onChange={update('services')} className={inputClass} />
              </div>}

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

              {(isFoodCategory || isWeddingCategory) ? <div className="col-span-2 rounded-xl border border-[#ebded8] bg-white p-4">
                <p className="text-sm font-semibold text-ink">Business videos (optional)</p>
                <p className="mt-1 text-xs text-ink/60">Add a video URL or upload video files. These videos appear on the business website.</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <input type="url" value={mallVideoUrl} onChange={(event) => setMallVideoUrl(event.target.value)} placeholder="YouTube or direct video URL" className={inputClass} />
                  <input value={mallVideoCaption} onChange={(event) => setMallVideoCaption(event.target.value)} placeholder="Video caption (optional)" className={inputClass} />
                  <button type="button" onClick={addMallVideoUrl} className="mt-1 rounded border border-[#a83f32] px-4 py-2 text-sm font-semibold text-[#a83f32]">Add URL</button>
                </div>
                <label className="mt-3 inline-flex cursor-pointer items-center rounded border border-dashed border-line px-4 py-3 text-xs font-semibold text-ink/70 hover:border-ink/40">Upload video files<input type="file" accept="video/mp4,video/webm,video/ogg,video/quicktime" multiple className="hidden" onChange={(event) => { handleMallVideoFiles(event.target.files); event.target.value = ''; }} /></label>
                {mallVideos.length > 0 && <div className="mt-3 grid gap-2">{mallVideos.map((video, index) => <div key={video.preview || video.url || index} className="grid items-center gap-2 rounded border border-line p-2 sm:grid-cols-[1fr_1fr_auto]"><span className="truncate text-xs text-ink/70">{video.file?.name || video.url}</span><input value={video.caption || ''} onChange={(event) => setMallVideos((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, caption: event.target.value } : item))} placeholder="Video caption" className={inputClass} /><button type="button" onClick={() => { if (video.preview) URL.revokeObjectURL(video.preview); setMallVideos((current) => current.filter((_, itemIndex) => itemIndex !== index)); }} className="rounded px-3 py-2 text-xs font-semibold text-red-600">Remove</button></div>)}</div>}
              </div> : <div className="col-span-2">
                <label className="text-sm text-ink/70">Video URLs</label>
                <textarea rows={3} value={form.videoUrls} onChange={update('videoUrls')} className={inputClass} />
              </div>}

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
          {isEditing && isSchool && <div className="col-span-2 rounded-xl border border-[#d9e9f6] bg-white p-5 sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1769a8]">Previously uploaded media</p><p className="mt-1 text-xs text-ink/55">Existing files are preserved automatically. Select new files only when you want to replace or add media.</p><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['Logo', existingMedia.logo], ['Cover', existingMedia.cover], ['About photo', existingMedia.about], ['Principal photo', existingMedia.principal]].map(([label, url]) => url && <div key={label}><p className="text-xs font-semibold text-ink/70">{label}</p><img src={url} alt={label} className="mt-2 h-24 w-full rounded object-cover" /></div>)}</div>{existingMedia.images.length > 0 && <div className="mt-4"><p className="text-xs font-semibold text-ink/70">Gallery photos ({existingMedia.images.length})</p><div className="mt-2 flex gap-2 overflow-x-auto">{existingMedia.images.slice(0, 12).map((url, index) => <img key={`${url}-${index}`} src={url} alt={`Existing gallery ${index + 1}`} className="h-16 w-20 shrink-0 rounded object-cover" />)}</div></div>}{existingMedia.videos.length > 0 && <div className="mt-4"><p className="text-xs font-semibold text-ink/70">Videos ({existingMedia.videos.length})</p><div className="mt-2 flex flex-wrap gap-2">{existingMedia.videos.map((url, index) => <a key={`${url}-${index}`} href={url} target="_blank" rel="noreferrer" className="rounded bg-[#f3f9fe] px-3 py-2 text-xs font-semibold text-[#1769a8]">Video {index + 1} ↗</a>)}</div></div>}{(existingMedia.faculty.length || existingMedia.infrastructure.length || existingMedia.facilities.length || existingMedia.events.length || existingMedia.principalGallery.length) > 0 && <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-ink/60 sm:grid-cols-5"><span>Faculty: {existingMedia.faculty.length}</span><span>Infrastructure: {existingMedia.infrastructure.length}</span><span>Facilities: {existingMedia.facilities.length}</span><span>Event photos: {existingMedia.events.length}</span><span>Principal gallery: {existingMedia.principalGallery.length}</span></div>}</div>}

          {isSchool && <div className="col-span-2 space-y-5">
            <div className="rounded-[1.25rem] border border-[#b9e6df] bg-white/90 p-5 shadow-sm sm:p-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#168b9a]">1. Basic information</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-[#17324d]">School identity and contact</h2>
              <div className="mt-5 grid grid-cols-2 gap-4">
                {[['tagline', 'Tagline', 'Learning today, leading tomorrow'], ['establishedYear', 'Established year', 'YYYY'], ['board', 'Board', 'CBSE / ICSE / State Board / IB'], ['type', 'School type', 'Private / Government / Aided'], ['gender', 'Gender', 'Co-Education / Boys / Girls'], ['medium', 'Medium', 'English / Telugu / Hindi'], ['studentTeacherRatio', 'Student-teacher ratio', '25:1'], ['totalStudents', 'Total students', '1200'], ['landmark', 'Landmark', 'Near Central Park'], ['pincode', 'Pincode', '533101']].map(([field, label, placeholder]) => <div key={field} className="col-span-2 sm:col-span-1"><label className="text-sm text-ink/70">{label}</label><input value={form[field]} onChange={update(field)} placeholder={placeholder} className={inputClass} /></div>)}
                <CheckboxGroup label="Classes offered" items={schoolClasses} values={form.classes ? form.classes.split(', ') : []} onChange={(values) => setForm({ ...form, classes: values.join(', ') })} />
                <label className="col-span-2 text-sm text-ink/70 sm:col-span-1">Email<input type="email" value={form.email} onChange={update('email')} placeholder="info@school.example" className={inputClass} /></label>
                <label className="col-span-2 text-sm text-ink/70 sm:col-span-1">Website<input type="url" value={form.website} onChange={update('website')} placeholder="https://www.school.example" className={inputClass} /></label>
              </div>
              <div className="mt-5 grid gap-4"><label className="text-sm text-ink/70">WhatsApp number<input value={form.whatsapp} onChange={update('whatsapp')} placeholder="+91 XXXXX XXXXX" className={inputClass} /></label><label className="text-sm text-ink/70">Enquiry phone<input value={form.enquiryPhone} onChange={update('enquiryPhone')} placeholder="+91 XXXXX XXXXX" className={inputClass} /></label></div>
            </div>

            <div className="rounded-[1.25rem] border border-[#f2d6a1] bg-[#fffaf0]/95 p-5 shadow-sm sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a47b2c]">2. About school</p><div className="mt-4 grid gap-5 lg:grid-cols-[1fr_280px]"><div className="grid gap-4"><label className="text-sm text-ink/70">About school *<textarea required rows={5} value={form.description} onChange={update('description')} className={inputClass} /></label><label className="text-sm text-ink/70">Vision<textarea rows={3} value={form.vision} onChange={update('vision')} className={inputClass} /></label><label className="text-sm text-ink/70">Mission<textarea rows={3} value={form.mission} onChange={update('mission')} className={inputClass} /></label><label className="text-sm text-ink/70">School history<textarea rows={3} value={form.schoolHistory} onChange={update('schoolHistory')} className={inputClass} /></label><label className="text-sm text-ink/70">Why choose us?<textarea rows={3} value={form.whyChooseUs} onChange={update('whyChooseUs')} className={inputClass} /></label></div><div><label className="text-sm font-semibold text-ink/75">About school photo<input type="file" accept="image/*" onChange={(e) => setAboutImageFile(e.target.files?.[0] || null)} className={inputClass} /></label>{aboutImageFile && <p className="mt-2 text-xs text-[#168b9a]">About photo selected</p>}<p className="mt-2 text-xs leading-relaxed text-ink/50">This image will appear beside the About section on the public school page.</p></div></div></div>

            <div className="rounded-[1.25rem] border border-[#d8c9f3] bg-[#faf8ff]/95 p-5 shadow-sm sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6950a8]">3. Principal details</p><div className="mt-4 grid grid-cols-2 gap-4">{[['principalName', 'Principal name *', 'Dr. Anitha Reddy'], ['principalDesignation', 'Designation', 'Principal'], ['principalQualification', 'Qualification', 'M.Sc., B.Ed.'], ['principalExperience', 'Experience', '18 Years']].map(([field, label, placeholder]) => <label key={field} className="col-span-2 text-sm text-ink/70 sm:col-span-1">{label}<input value={form[field]} onChange={update(field)} placeholder={placeholder} className={inputClass} /></label>)}<label className="col-span-2 text-sm text-ink/70">Principal message<textarea rows={3} value={form.principalMessage} onChange={update('principalMessage')} className={inputClass} /></label></div></div>

            <div className="rounded-[1.25rem] border border-[#b9e6df] bg-[#f1fbf8]/95 p-5 shadow-sm sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#168b9a]">4. Academics</p><div className="mt-4 grid gap-4"><label className="text-sm text-ink/70">Teaching method<textarea rows={3} value={form.teachingMethod} onChange={update('teachingMethod')} className={inputClass} /></label><CheckboxGroup label="Languages offered" items={languages} values={form.languages} onChange={(values) => setForm({ ...form, languages: values })} /><label className="text-sm text-ink/70">Academic activities<textarea rows={3} value={form.academicActivities} onChange={update('academicActivities')} className={inputClass} /></label></div></div>
          </div>}

          {isSchool && <div className="col-span-2 rounded-xl border border-[#b9e6df] bg-white p-5 sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#168b9a]">School selections</p><div className="mt-4 grid gap-5"><CheckboxGroup label="Required documents" items={documents} values={form.requiredDocuments} onChange={(values) => setForm({ ...form, requiredDocuments: values })} /></div></div>}

          {!isShoppingCategory && !isAutomotiveCategory && !isSchool && !isCollege && !isUniversity && !isFoodCategory && !isWeddingCategory && <div className="col-span-2">
            <h2 className="font-display text-lg font-medium text-ink">Photos and facilities</h2>
            <p className="mt-1 text-xs text-ink/50">All of these are optional. Separate multiple values with commas or new lines.</p>
          </div>}

          {isSchool && <div className="col-span-2 rounded-xl border border-[#cfe6e5] bg-[#f5fbff] p-5 sm:p-7">
            <h2 className="font-display text-xl font-semibold text-[#17324d]">School branding and media</h2>
            <p className="mt-1 text-xs text-ink/55">Upload the logo, banner, principal profile, and supporting photos. Multiple selection is supported wherever marked.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm text-ink/70">School logo *<input required type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className={inputClass} /></label><label className="text-sm text-ink/70">School cover / banner *<input required type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className={inputClass} /></label><label className="text-sm text-ink/70">Principal photo *<input required type="file" accept="image/*" onChange={(e) => setPrincipalImageFile(e.target.files?.[0] || null)} className={inputClass} /></label><label className="text-sm text-ink/70">Principal profile gallery<input type="file" accept="image/*" multiple onChange={(e) => setPrincipalGalleryFiles(Array.from(e.target.files || []))} className={inputClass} /></label></div>
          </div>}

          {isSchool && <div className="col-span-2 space-y-5">
            <div className="rounded-xl border border-[#d8c9f3] bg-white p-5 sm:p-7"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6950a8]">5. Faculty &amp; staff</p><h2 className="mt-1 font-display text-xl font-semibold text-[#17324d]">Add multiple faculty members</h2></div><button type="button" onClick={() => addItem(setFaculty, { name: '', designation: '', department: '', qualification: '', experience: '', bio: '', photoFiles: [] })} className="rounded-full bg-[#6950a8] px-4 py-2 text-xs font-bold text-white">+ Add Faculty</button></div>{faculty.map((item, index) => <div key={index} className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-[#e5dcf7] bg-[#faf8ff] p-4">{[['name', 'Name *'], ['designation', 'Designation *'], ['department', 'Department'], ['qualification', 'Qualification'], ['experience', 'Experience'], ['bio', 'Short bio']].map(([field, label]) => <label key={field} className="col-span-2 text-xs font-semibold text-ink/70 sm:col-span-1">{label}<input value={item[field]} onChange={(e) => updateItem(setFaculty, index, field, e.target.value)} className={inputClass} /></label>)}<label className="col-span-2 text-xs font-semibold text-ink/70">Faculty photo *<input required type="file" accept="image/*" multiple onChange={(e) => updateItem(setFaculty, index, 'photoFiles', Array.from(e.target.files || []))} className={inputClass} /></label><button type="button" onClick={() => removeItem(setFaculty, index)} className="col-span-2 text-left text-xs font-bold text-vermilion">Delete faculty</button></div>)}</div>

            <div className="rounded-xl border border-[#f2d6a1] bg-[#fffaf0] p-5 sm:p-7"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a47b2c]">6. Campus &amp; infrastructure</p><h2 className="mt-1 font-display text-xl font-semibold text-[#17324d]">Add infrastructure categories and images</h2></div><button type="button" onClick={() => addItem(setInfrastructure, { name: '', description: '', imageFiles: [] })} className="rounded-full bg-[#e76f51] px-4 py-2 text-xs font-bold text-white">+ Add Infrastructure</button></div>{infrastructure.map((item, index) => <div key={index} className="mt-4 grid gap-3 rounded-lg border border-[#f0d8b0] bg-white p-4"><label className="text-xs font-semibold text-ink/70">Infrastructure name *<input value={item.name} onChange={(e) => updateItem(setInfrastructure, index, 'name', e.target.value)} className={inputClass} /></label><label className="text-xs font-semibold text-ink/70">Description<textarea rows={2} value={item.description} onChange={(e) => updateItem(setInfrastructure, index, 'description', e.target.value)} className={inputClass} /></label><label className="text-xs font-semibold text-ink/70">Images *<input required type="file" accept="image/*" multiple onChange={(e) => updateItem(setInfrastructure, index, 'imageFiles', Array.from(e.target.files || []))} className={inputClass} /></label><button type="button" onClick={() => removeItem(setInfrastructure, index)} className="text-left text-xs font-bold text-vermilion">Delete infrastructure</button></div>)}</div>

            <div className="rounded-xl border border-[#b9e6df] bg-[#f1fbf8] p-5 sm:p-7"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#168b9a]">7. Facilities</p><h2 className="mt-1 font-display text-xl font-semibold text-[#17324d]">Dynamic facilities with images</h2></div><button type="button" onClick={() => addItem(setSchoolFacilities, { name: '', icon: '', description: '', available: true, imageFiles: [] })} className="rounded-full bg-[#168b9a] px-4 py-2 text-xs font-bold text-white">+ Add Facility</button></div>{schoolFacilities.map((item, index) => <div key={index} className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-[#cfe6e5] bg-white p-4"><label className="col-span-2 text-xs font-semibold text-ink/70 sm:col-span-1">Facility name *<input value={item.name} onChange={(e) => updateItem(setSchoolFacilities, index, 'name', e.target.value)} className={inputClass} /></label><label className="col-span-2 text-xs font-semibold text-ink/70 sm:col-span-1">Facility icon<input value={item.icon} onChange={(e) => updateItem(setSchoolFacilities, index, 'icon', e.target.value)} placeholder="🏫" className={inputClass} /></label><label className="col-span-2 text-xs font-semibold text-ink/70">Description<textarea rows={2} value={item.description} onChange={(e) => updateItem(setSchoolFacilities, index, 'description', e.target.value)} className={inputClass} /></label><label className="col-span-2 text-xs font-semibold text-ink/70">Facility images<input type="file" accept="image/*" multiple onChange={(e) => updateItem(setSchoolFacilities, index, 'imageFiles', Array.from(e.target.files || []))} className={inputClass} /></label><label className="col-span-2 flex items-center gap-2 text-xs font-semibold text-ink/70"><input type="checkbox" checked={item.available} onChange={(e) => updateItem(setSchoolFacilities, index, 'available', e.target.checked)} /> Available</label><button type="button" onClick={() => removeItem(setSchoolFacilities, index)} className="col-span-2 text-left text-xs font-bold text-vermilion">Delete facility</button></div>)}</div>
          </div>}

          {!isSchool && !isUniversity && !isShoppingCategory && !isAutomotiveCategory && !isFoodCategory && !isWeddingCategory && <div className="col-span-2">
            <label className="text-sm text-ink/70">Cover photo</label>
            <input required={!isEditing && !coverFile} type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className={inputClass} />
          </div>}

          {!isSchool && !isCollege && !isUniversity && !isShoppingCategory && !isAutomotiveCategory && !isFoodCategory && !isWeddingCategory && <div className="col-span-2">
            <label className="text-sm text-ink/70">Gallery photos (select as many as needed)</label>
            <input type="file" accept="image/*" multiple onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))} className={inputClass} />
            {galleryFiles.length > 0 && <p className="mt-1 text-xs text-ink/50">{galleryFiles.length} photos selected.</p>}
          </div>}

          {!isSchool && !isCollege && !isUniversity && !isShoppingCategory && !isAutomotiveCategory && !isFoodCategory && !isWeddingCategory && <div className="col-span-2">
            <label className="text-sm text-ink/70">Facilities</label>
            <textarea rows={2} value={form.facilities} onChange={update('facilities')} placeholder="School bus, Library, Science lab, Playground" className={inputClass} />
          </div>}

          {isSchool && <div className="col-span-2 space-y-5">
            <div className="rounded-xl border border-[#b9e6df] bg-white p-5 sm:p-7"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#168b9a]">8. Photo gallery</p><h2 className="mt-1 font-display text-xl font-semibold text-[#17324d]">Upload unlimited gallery groups</h2></div><button type="button" onClick={() => addItem(setGalleryItems, { category: 'Campus', title: '', description: '', files: [] })} className="rounded-full bg-[#168b9a] px-4 py-2 text-xs font-bold text-white">+ Add Photos</button></div>{galleryItems.map((item, index) => <div key={index} className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-[#cfe6e5] bg-[#f5fbff] p-4"><label className="col-span-2 text-xs font-semibold text-ink/70 sm:col-span-1">Category<select value={item.category} onChange={(e) => updateItem(setGalleryItems, index, 'category', e.target.value)} className={inputClass}>{['Campus', 'Classrooms', 'Labs', 'Library', 'Sports', 'Events', 'Annual Day', 'Cultural Activities', 'School Trips', 'Students Activities', 'Other'].map((value) => <option key={value}>{value}</option>)}</select></label><label className="col-span-2 text-xs font-semibold text-ink/70 sm:col-span-1">Photo title<input value={item.title} onChange={(e) => updateItem(setGalleryItems, index, 'title', e.target.value)} className={inputClass} /></label><label className="col-span-2 text-xs font-semibold text-ink/70">Description<textarea rows={2} value={item.description} onChange={(e) => updateItem(setGalleryItems, index, 'description', e.target.value)} className={inputClass} /></label><label className="col-span-2 text-xs font-semibold text-ink/70">Choose multiple photos *<input required type="file" accept="image/*" multiple onChange={(e) => updateItem(setGalleryItems, index, 'files', Array.from(e.target.files || []))} className={inputClass} /></label><button type="button" onClick={() => removeItem(setGalleryItems, index)} className="col-span-2 text-left text-xs font-bold text-vermilion">Delete gallery group</button></div>)}</div>

            <div className="rounded-xl border border-[#d8c9f3] bg-[#faf8ff] p-5 sm:p-7"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6950a8]">9. Videos</p><h2 className="mt-1 font-display text-xl font-semibold text-[#17324d]">Add upload or URL videos</h2></div><button type="button" onClick={() => addItem(setSchoolVideos, { title: '', type: 'upload', url: '', description: '', file: null })} className="rounded-full bg-[#6950a8] px-4 py-2 text-xs font-bold text-white">+ Add Video</button></div>{schoolVideos.map((item, index) => <div key={index} className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-[#e5dcf7] bg-white p-4"><label className="col-span-2 text-xs font-semibold text-ink/70 sm:col-span-1">Video title *<input value={item.title} onChange={(e) => updateItem(setSchoolVideos, index, 'title', e.target.value)} className={inputClass} /></label><label className="col-span-2 text-xs font-semibold text-ink/70 sm:col-span-1">Video type<select value={item.type} onChange={(e) => updateItem(setSchoolVideos, index, 'type', e.target.value)} className={inputClass}><option value="upload">Upload video</option><option value="youtube">YouTube URL</option><option value="url">Video URL</option></select></label>{item.type === 'upload' ? <label className="col-span-2 text-xs font-semibold text-ink/70">Video file<input type="file" accept="video/*" onChange={(e) => updateItem(setSchoolVideos, index, 'file', e.target.files?.[0] || null)} className={inputClass} /></label> : <label className="col-span-2 text-xs font-semibold text-ink/70">Video URL<input value={item.url} onChange={(e) => updateItem(setSchoolVideos, index, 'url', e.target.value)} className={inputClass} /></label>}<label className="col-span-2 text-xs font-semibold text-ink/70">Description<textarea rows={2} value={item.description} onChange={(e) => updateItem(setSchoolVideos, index, 'description', e.target.value)} className={inputClass} /></label><button type="button" onClick={() => removeItem(setSchoolVideos, index)} className="col-span-2 text-left text-xs font-bold text-vermilion">Delete video</button></div>)}</div>

            <div className="rounded-xl border border-[#f2d6a1] bg-[#fffaf0] p-5 sm:p-7"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a47b2c]">10. Achievements and events</p><h2 className="mt-1 font-display text-xl font-semibold text-[#17324d]">Celebrate school life</h2></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => addItem(setAchievements, { title: '', year: '', category: 'Academic', description: '', imageFiles: [] })} className="rounded-full bg-[#e76f51] px-3 py-2 text-xs font-bold text-white">+ Achievement</button><button type="button" onClick={() => addItem(setSchoolEvents, { name: '', date: '', startTime: '', endTime: '', category: 'Cultural', description: '', imageFiles: [] })} className="rounded-full bg-[#a47b2c] px-3 py-2 text-xs font-bold text-white">+ Event</button></div></div>{achievements.map((item, index) => <div key={`a-${index}`} className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-[#f0d8b0] bg-white p-4"><label className="col-span-2 text-xs font-semibold text-ink/70 sm:col-span-1">Achievement title *<input value={item.title} onChange={(e) => updateItem(setAchievements, index, 'title', e.target.value)} className={inputClass} /></label><label className="text-xs font-semibold text-ink/70">Year<input value={item.year} onChange={(e) => updateItem(setAchievements, index, 'year', e.target.value)} className={inputClass} /></label><label className="col-span-2 text-xs font-semibold text-ink/70">Category<select value={item.category} onChange={(e) => updateItem(setAchievements, index, 'category', e.target.value)} className={inputClass}><option>Academic</option><option>Sports</option><option>Cultural</option><option>Other</option></select></label><label className="col-span-2 text-xs font-semibold text-ink/70">Description<textarea rows={2} value={item.description} onChange={(e) => updateItem(setAchievements, index, 'description', e.target.value)} className={inputClass} /></label><label className="col-span-2 text-xs font-semibold text-ink/70">Achievement image<input type="file" accept="image/*" onChange={(e) => updateItem(setAchievements, index, 'imageFiles', Array.from(e.target.files || []))} className={inputClass} /></label><button type="button" onClick={() => removeItem(setAchievements, index)} className="col-span-2 text-left text-xs font-bold text-vermilion">Delete achievement</button></div>)}{schoolEvents.map((item, index) => <div key={`e-${index}`} className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-[#f0d8b0] bg-white p-4"><label className="col-span-2 text-xs font-semibold text-ink/70 sm:col-span-1">Event name *<input value={item.name} onChange={(e) => updateItem(setSchoolEvents, index, 'name', e.target.value)} className={inputClass} /></label><label className="text-xs font-semibold text-ink/70">Event date<input type="date" value={item.date} onChange={(e) => updateItem(setSchoolEvents, index, 'date', e.target.value)} className={inputClass} /></label><label className="text-xs font-semibold text-ink/70">Category<input value={item.category} onChange={(e) => updateItem(setSchoolEvents, index, 'category', e.target.value)} className={inputClass} /></label><label className="text-xs font-semibold text-ink/70">Start time<input type="time" value={item.startTime} onChange={(e) => updateItem(setSchoolEvents, index, 'startTime', e.target.value)} className={inputClass} /></label><label className="text-xs font-semibold text-ink/70">End time<input type="time" value={item.endTime} onChange={(e) => updateItem(setSchoolEvents, index, 'endTime', e.target.value)} className={inputClass} /></label><label className="col-span-2 text-xs font-semibold text-ink/70">Description<textarea rows={2} value={item.description} onChange={(e) => updateItem(setSchoolEvents, index, 'description', e.target.value)} className={inputClass} /></label><label className="col-span-2 text-xs font-semibold text-ink/70">Event images<input type="file" accept="image/*" multiple onChange={(e) => updateItem(setSchoolEvents, index, 'imageFiles', Array.from(e.target.files || []))} className={inputClass} /></label><button type="button" onClick={() => removeItem(setSchoolEvents, index)} className="col-span-2 text-left text-xs font-bold text-vermilion">Delete event</button></div>)}</div>

            <div className="rounded-xl border border-[#b9e6df] bg-[#f1fbf8] p-5 sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#168b9a]">11. Admissions and fees</p><div className="mt-4 grid grid-cols-2 gap-4"><label className="col-span-2 text-sm text-ink/70 sm:col-span-1">Admission status<select value={form.admissionStatus} onChange={update('admissionStatus')} className={inputClass}><option value="open">Open</option><option value="closed">Closed</option></select></label><label className="col-span-2 text-sm text-ink/70 sm:col-span-1">Admission enquiry phone<input value={form.enquiryPhone} onChange={update('enquiryPhone')} className={inputClass} /></label><label className="col-span-2 text-sm text-ink/70">Classes available<select multiple value={form.admissionClasses} onChange={updateArrayField('admissionClasses')} className={`${inputClass} min-h-24`}>{schoolClasses.map((item) => <option key={item}>{item}</option>)}</select></label><label className="col-span-2 text-sm text-ink/70">Eligibility<textarea rows={2} value={form.eligibility} onChange={update('eligibility')} className={inputClass} /></label><label className="col-span-2 text-sm text-ink/70">Age criteria<input value={form.ageCriteria} onChange={update('ageCriteria')} className={inputClass} /></label><label className="col-span-2 text-sm text-ink/70">Required documents<select multiple value={form.requiredDocuments} onChange={updateArrayField('requiredDocuments')} className={`${inputClass} min-h-24`}>{documents.map((item) => <option key={item}>{item}</option>)}</select></label><label className="col-span-2 text-sm text-ink/70">Admission process<textarea rows={3} value={form.admissionProcess} onChange={update('admissionProcess')} className={inputClass} /></label><label className="col-span-2 flex items-center gap-2 text-sm text-ink/70"><input type="checkbox" checked={form.showFees} onChange={(e) => setForm({ ...form, showFees: e.target.checked })} /> Show fee information</label>{[['admissionFee', 'Admission fee'], ['tuitionFee', 'Tuition fee'], ['transportFee', 'Transport fee'], ['otherCharges', 'Other charges']].map(([field, label]) => <label key={field} className="col-span-2 text-sm text-ink/70 sm:col-span-1">{label}<input value={form[field]} onChange={update(field)} placeholder="₹" className={inputClass} /></label>)}<label className="col-span-2 text-sm text-ink/70">Fee description<textarea rows={2} value={form.feeInformation} onChange={update('feeInformation')} className={inputClass} /></label></div></div>

            <div className="rounded-xl border border-[#d8c9f3] bg-[#faf8ff] p-5 sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6950a8]">12. Social media</p><div className="mt-4 grid grid-cols-2 gap-4">{[['facebook', 'Facebook'], ['instagram', 'Instagram'], ['youtube', 'YouTube'], ['linkedin', 'LinkedIn']].map(([field, label]) => <label key={field} className="col-span-2 text-sm text-ink/70 sm:col-span-1">{label} URL<input value={form[field]} onChange={update(field)} placeholder="https://" className={inputClass} /></label>)}</div></div>
          </div>}

          {isCollege && <CollegeRegistrationFields form={form} setForm={setForm} inputClass={inputClass} faculty={faculty} setFaculty={setFaculty} achievements={achievements} setAchievements={setAchievements} principalImageFile={principalImageFile} setPrincipalImageFile={setPrincipalImageFile} logoFile={logoFile} setLogoFile={setLogoFile} footerLogoFile={footerLogoFile} setFooterLogoFile={setFooterLogoFile} galleryFiles={galleryFiles} setGalleryFiles={setGalleryFiles} schoolVideos={schoolVideos} setSchoolVideos={setSchoolVideos} />}
          {isUniversity && <UniversityRegistrationFields form={form} setForm={setForm} inputClass={inputClass} logoFile={logoFile} setLogoFile={setLogoFile} coverFile={coverFile} setCoverFile={setCoverFile} aboutImageFile={aboutImageFile} setAboutImageFile={setAboutImageFile} galleryFiles={galleryFiles} setGalleryFiles={setGalleryFiles} schoolVideos={schoolVideos} setSchoolVideos={setSchoolVideos} />}

          {!isSchool && !isCollege && !isUniversity && !isShoppingCategory && !isAutomotiveCategory && !isFoodCategory && !isWeddingCategory && <div className="col-span-2"><h2 className="font-display text-lg font-medium text-ink">Additional business details</h2><p className="mt-1 text-xs text-ink/50">Optional details for your selected category.</p></div>}

          {!isSchool && !isCollege && !isUniversity && !isShoppingCategory && !isAutomotiveCategory && !isFoodCategory && !isWeddingCategory && <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">Curriculum / board</label>
            <input value={form.board} onChange={update('board')} placeholder="CBSE, State Board, ICSE" className={inputClass} />
          </div>}
          {!isSchool && !isCollege && !isUniversity && !isShoppingCategory && !isAutomotiveCategory && !isFoodCategory && !isWeddingCategory && <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">Classes offered</label>
            <input value={form.classes} onChange={update('classes')} placeholder="LKG to Class 10" className={inputClass} />
          </div>}
          {!isSchool && !isCollege && !isUniversity && !isShoppingCategory && !isAutomotiveCategory && !isFoodCategory && !isWeddingCategory && <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">Curriculum type</label>
            <input value={form.curriculum} onChange={update('curriculum')} placeholder="English medium, Montessori" className={inputClass} />
          </div>}
          {!isSchool && !isCollege && !isUniversity && !isShoppingCategory && !isAutomotiveCategory && !isFoodCategory && !isWeddingCategory && <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">School type</label>
            <input value={form.type} onChange={update('type')} placeholder="Private, Government" className={inputClass} />
          </div>}
          {!isSchool && !isCollege && !isUniversity && !isShoppingCategory && !isAutomotiveCategory && !isFoodCategory && !isWeddingCategory && <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">Student type</label>
            <input value={form.gender} onChange={update('gender')} placeholder="Co-ed, Boys, Girls" className={inputClass} />
          </div>}
          {!isSchool && !isCollege && !isUniversity && !isShoppingCategory && !isAutomotiveCategory && !isFoodCategory && !isWeddingCategory && <div className="col-span-2">
            <label className="text-sm text-ink/70">Admission details</label>
            <input value={form.admission} onChange={update('admission')} placeholder="Open throughout the year" className={inputClass} />
          </div>}

          {!isSchool && !isCollege && !isUniversity && !isShoppingCategory && !isAutomotiveCategory && !isFoodCategory && !isWeddingCategory && <div className="col-span-2">
            <h2 className="font-display text-lg font-medium text-ink">Videos and social links</h2>
            <p className="mt-1 text-xs text-ink/50">Upload multiple videos for the school video gallery.</p>
          </div>}

          {!isSchool && !isCollege && !isUniversity && !isShoppingCategory && !isAutomotiveCategory && !isFoodCategory && !isWeddingCategory && <div className="col-span-2">
            <label className="text-sm text-ink/70">School videos</label>
            <input type="file" accept="video/*" multiple onChange={(e) => setVideoFiles(Array.from(e.target.files || []))} className={inputClass} />
            <p className="mt-1 text-xs text-ink/50">Select multiple videos. Maximum 50 MB each.</p>
          </div>}
          {!isSchool && !isUniversity && !isShoppingCategory && !isAutomotiveCategory && !isFoodCategory && !isWeddingCategory && <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">Facebook URL</label>
            <input value={form.facebook} onChange={update('facebook')} placeholder="https://facebook.com/…" className={inputClass} />
          </div>}
          {!isSchool && !isUniversity && !isShoppingCategory && !isAutomotiveCategory && !isFoodCategory && !isWeddingCategory && <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">Instagram URL</label>
            <input value={form.instagram} onChange={update('instagram')} placeholder="https://instagram.com/…" className={inputClass} />
          </div>}
          {!isSchool && !isUniversity && !isShoppingCategory && !isAutomotiveCategory && !isFoodCategory && !isWeddingCategory && <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">WhatsApp number or link</label>
            <input value={form.whatsapp} onChange={update('whatsapp')} placeholder="https://wa.me/91…" className={inputClass} />
          </div>}

          {error && <p className="col-span-2 text-sm text-vermilion">{error}</p>}
          {success && <p className="col-span-2 text-sm text-moss">{success}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="col-span-2 mt-2 rounded bg-ink py-2.5 text-[15px] font-medium text-paper transition hover:bg-ink-light disabled:opacity-60"
          >
            {submitting ? (isEditing ? 'Updating…' : 'Submitting…') : (isEditing ? 'Update listing' : 'Submit for approval')}
          </button>
        </form>
        </div>
      </div>
    </div>
    </>
  );
}
