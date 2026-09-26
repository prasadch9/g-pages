import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import BusinessMediaUploader from '../../components/business/BusinessMediaUploader';
import BusinessVideoUploader from '../../components/business/BusinessVideoUploader';
import LocationCascadeFields from '../../components/LocationCascadeFields';

const inputClass = 'mt-1 w-full rounded-xl border border-[#e7dcd7] bg-white px-3 py-2.5 text-sm text-[#2d2323] outline-none transition focus:border-[#0f6cbf] focus:ring-2 focus:ring-[#0f6cbf]/10';
const splitList = (value = '') => String(value).split(/[,\n]/).map((item) => item.trim()).filter(Boolean);
const asText = (value) => Array.isArray(value) ? value.filter(Boolean).join('\n') : value || '';
const asPeople = (value) => Array.isArray(value) ? value.filter(Boolean).map((person) => typeof person === 'string' ? { name: person } : person) : splitList(value).map((name) => ({ name, photo: '', speciality: '', experience: '' }));
const asFitnessRecords = (value, textKey) => (Array.isArray(value) ? value : splitList(value || '')).filter(Boolean).map((entry) => typeof entry === 'string' ? { [textKey]: entry } : entry);
const fitnessDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const hospitalDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const detailsFor = (fitness, hospital, specialistClinic) => fitness
  ? [
      ['programs', 'Programs', 'Strength training, yoga, personal training'],
      ['trainers', 'Trainers', 'Trainer names, one per line'],
      ['membershipPlans', 'Membership plans', 'Basic - ₹999/month, Premium - ₹2499/month'],
      ['classSchedule', 'Class schedule', 'Yoga - Mon/Wed/Fri 7:00 AM'],
      ['facilities', 'Facilities', 'Modern equipment, lockers, showers'],
    ]
  : hospital
    ? [
        ['departments', 'Departments', 'Cardiology, Neurology, Orthopaedics — one per line'],
        ['doctors', 'Doctors / specialists', 'Doctor names, one per line'],
        ['services', 'Treatments & services', 'Emergency care, diagnostics, surgery — one per line'],
        ['facilities', 'Facilities', 'ICU, pharmacy, ambulance — one per line'],
        ['branches', 'Branches', 'Branch name and full address — one per line'],
      ]
    : specialistClinic
      ? [
        ['doctors', 'Specialists', 'Specialist names'],
        ['services', 'Services & treatments', 'Consultation, diagnostics, procedures — one per line'],
        ['conditionsTreated', 'Conditions treated', 'Conditions treated at this clinic — one per line'],
        ['consultationInformation', 'Consultation timings', 'Monday–Saturday: 9:00 AM–1:00 PM, 4:00 PM–7:00 PM'],
        ['branches', 'Branches', 'Branch name and full address — one per line'],
      ]
    : [
        ['doctors', 'Doctors / specialists', 'Name, speciality or qualification, one per line'],
        ['services', 'Services & treatments', 'Consultation, diagnostics, procedures'],
        ['conditionsTreated', 'Conditions treated', 'Condition names, one per line'],
        ['consultationInformation', 'Consultation information', 'Days, hours, fees and appointment details'],
        ['packages', 'Packages (optional)', 'Package name and price, one per line'],
        ['facilities', 'Clinic facilities', 'Facilities, one per line'],
    ];

function FitnessBusinessFields({ form, setForm, placeId }) {
  const updateItem = (field, index, key, value) => setForm((current) => ({ ...current, [field]: current[field].map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item) }));
  const addItem = (field, item) => setForm((current) => ({ ...current, [field]: [...current[field], item] }));
  const removeItem = (field, index) => setForm((current) => ({ ...current, [field]: current[field].filter((_, itemIndex) => itemIndex !== index) }));
  return <div className="space-y-6">
    <section className="rounded-[24px] border border-[#ebded8] bg-white p-5 sm:p-7"><div className="flex items-center justify-between gap-3"><div><h2 className="font-display text-2xl font-semibold">Our Programs</h2><p className="mt-1 text-sm text-slate-500">Add a photo, program name and tags such as Burn Fat or Build Stamina.</p></div><button type="button" onClick={() => addItem('programs', { image: '', caption: '', tags: '' })} className="shrink-0 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white">+ Add program</button></div><div className="mt-4 space-y-4">{form.programs.map((program, index) => <div key={`program-${index}`} className="grid gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 sm:grid-cols-2"><label className="text-sm font-medium">Program name / caption<input value={program.caption || ''} onChange={(event) => updateItem('programs', index, 'caption', event.target.value)} className={inputClass} placeholder="Weight Loss" /></label><label className="text-sm font-medium">Tags<input value={Array.isArray(program.tags) ? program.tags.join(', ') : program.tags || ''} onChange={(event) => updateItem('programs', index, 'tags', event.target.value)} className={inputClass} placeholder="Burn Fat, Build Stamina" /></label><div className="sm:col-span-2"><BusinessMediaUploader label="Program image" value={program.image || ''} onChange={(image) => updateItem('programs', index, 'image', image)} placeId={placeId} previewClassName="h-32" /></div><button type="button" onClick={() => removeItem('programs', index)} className="text-left text-xs font-bold text-red-700">Remove program</button></div>)}{!form.programs.length && <p className="text-sm text-slate-500">Programs are optional. Add one to display this section.</p>}</div></section>
    <section className="rounded-[24px] border border-[#ebded8] bg-white p-5 sm:p-7"><div className="flex items-center justify-between gap-3"><div><h2 className="font-display text-2xl font-semibold">Our Trainers</h2><p className="mt-1 text-sm text-slate-500">Optional trainer profiles with a photo, name and category.</p></div><button type="button" onClick={() => addItem('trainers', { image: '', name: '', category: '' })} className="shrink-0 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white">+ Add trainer</button></div><div className="mt-4 space-y-4">{form.trainers.map((trainer, index) => <div key={`trainer-${index}`} className="grid gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 sm:grid-cols-2"><label className="text-sm font-medium">Trainer name<input value={trainer.name || ''} onChange={(event) => updateItem('trainers', index, 'name', event.target.value)} className={inputClass} /></label><label className="text-sm font-medium">Category / role<input value={trainer.category || trainer.speciality || ''} onChange={(event) => updateItem('trainers', index, 'category', event.target.value)} className={inputClass} placeholder="Strength Trainer" /></label><div className="sm:col-span-2"><BusinessMediaUploader label="Trainer image" value={trainer.image || trainer.photo || ''} onChange={(image) => updateItem('trainers', index, 'image', image)} placeId={placeId} previewClassName="h-32" /></div><button type="button" onClick={() => removeItem('trainers', index)} className="text-left text-xs font-bold text-red-700">Remove trainer</button></div>)}{!form.trainers.length && <p className="text-sm text-slate-500">Trainer profiles are optional. This section stays hidden until you add a trainer.</p>}</div></section>
    <section className="rounded-[24px] border border-[#ebded8] bg-white p-5 sm:p-7"><div className="flex items-center justify-between gap-3"><div><h2 className="font-display text-2xl font-semibold">Membership &amp; Packages</h2><p className="mt-1 text-sm text-slate-500">Add plan names, prices, duration and features. Join buttons use your WhatsApp number.</p></div><button type="button" onClick={() => addItem('membershipPlans', { name: '', price: '', duration: '', features: '' })} className="shrink-0 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white">+ Add plan</button></div><div className="mt-4 space-y-4">{form.membershipPlans.map((plan, index) => <div key={`plan-${index}`} className="grid gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 sm:grid-cols-2"><label className="text-sm font-medium">Plan name<input value={plan.name || ''} onChange={(event) => updateItem('membershipPlans', index, 'name', event.target.value)} className={inputClass} placeholder="Standard" /></label><label className="text-sm font-medium">Price<input value={plan.price || ''} onChange={(event) => updateItem('membershipPlans', index, 'price', event.target.value)} className={inputClass} placeholder="₹2,499" /></label><label className="text-sm font-medium">Duration<input value={plan.duration || ''} onChange={(event) => updateItem('membershipPlans', index, 'duration', event.target.value)} className={inputClass} placeholder="per month" /></label><label className="text-sm font-medium">Features<input value={Array.isArray(plan.features) ? plan.features.join(', ') : plan.features || ''} onChange={(event) => updateItem('membershipPlans', index, 'features', event.target.value)} className={inputClass} placeholder="Gym access, Group classes" /></label><button type="button" onClick={() => removeItem('membershipPlans', index)} className="text-left text-xs font-bold text-red-700">Remove plan</button></div>)}{!form.membershipPlans.length && <p className="text-sm text-slate-500">Membership plans are optional.</p>}</div></section>
    <section className="rounded-[24px] border border-[#ebded8] bg-white p-5 sm:p-7"><div className="flex items-center justify-between gap-3"><div><h2 className="font-display text-2xl font-semibold">Class Schedule</h2><p className="mt-1 text-sm text-slate-500">Add class names by time and day.</p></div><button type="button" onClick={() => addItem('classSchedule', { time: '', ...Object.fromEntries(fitnessDays.map((day) => [day, ''])) })} className="shrink-0 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white">+ Add time slot</button></div><div className="mt-4 overflow-x-auto"><table className="min-w-[850px] w-full border-collapse text-left text-xs"><thead><tr className="bg-emerald-50"><th className="p-2">Time</th>{fitnessDays.map((day) => <th key={day} className="p-2">{day.slice(0, 3)}</th>)}<th className="p-2">&nbsp;</th></tr></thead><tbody>{form.classSchedule.map((row, index) => <tr key={`schedule-${index}`} className="border-b border-slate-100"><td className="p-1"><input value={row.time || ''} onChange={(event) => updateItem('classSchedule', index, 'time', event.target.value)} className="w-28 rounded border border-slate-200 px-2 py-2" placeholder="6:00 AM" /></td>{fitnessDays.map((day) => <td key={day} className="p-1"><input value={row[day] || ''} onChange={(event) => updateItem('classSchedule', index, day, event.target.value)} className="w-24 rounded border border-slate-200 px-2 py-2" placeholder="Yoga" /></td>)}<td className="p-1"><button type="button" onClick={() => removeItem('classSchedule', index)} className="whitespace-nowrap text-xs font-bold text-red-700">Remove</button></td></tr>)}</tbody></table></div>{!form.classSchedule.length && <p className="mt-3 text-sm text-slate-500">Class schedule is optional.</p>}</section>
  </div>;
}

export default function HealthcareBusinessEditor({ place = {}, create = false, onBack, categoryId, subcategoryId, subcategoryName, embedded = false }) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [location, setLocation] = useState({
    state: place.location?.state?._id || place.location?.state || '',
    district: place.location?.district?._id || place.location?.district || '',
    city: place.location?.city?._id || place.location?.city || '',
    area: place.location?.area?._id || place.location?.area || '',
    areaText: place.location?.areaText || '',
  });

  const specific = place.attributes?.businessProfile?.categorySpecific || {};
  const currentSubcategory = (subcategoryName || place.subcategory?.name || place.category?.name || '').toLowerCase();
  const isFitness = currentSubcategory.includes('fitness');
  const isHospital = currentSubcategory.includes('hospital');
  const isSpecialistClinic = ['cardiology', 'ent', 'dental', 'hearing solutions'].includes(currentSubcategory);
  const hasDoctorProfiles = isHospital || isSpecialistClinic;
  const businessTypeLabel = isFitness ? 'Fitness Centre' : isHospital ? 'Hospital' : 'Specialist Clinic';
  const detailFields = detailsFor(isFitness, isHospital, isSpecialistClinic);
  const [form, setForm] = useState({
    name: place.name || '',
    category: categoryId || place.category?._id || place.category || '',
    subcategory: subcategoryId || place.subcategory?._id || place.subcategory || '',
    phone: place.phone || '',
    email: place.email || '',
    website: place.website || '',
    logo: place.logo || '',
    coverImage: place.coverImage || '',
    address: place.address || '',
    description: place.description || '',
    gallery: Array.isArray(place.images) && place.images.length ? place.images : (place.attributes?.businessProfile?.common?.gallery || []),
    videos: Array.isArray(place.attributes?.businessProfile?.common?.videos)
      ? place.attributes.businessProfile.common.videos
      : Array.isArray(place.attributes?.videos)
        ? place.attributes.videos
        : Array.isArray(place.video) ? place.video.map((url) => typeof url === 'string' ? { url } : url) : place.video ? [{ url: place.video }] : [],
    services: asText(place.services || []),
    facilities: asText(place.facilities || []),
    departments: asText(place.attributes?.departments || []),
    emergencyAvailable: Boolean(place.attributes?.emergencyAvailable ?? place.emergencyAvailable),
    emergencyPhone: place.attributes?.emergencyPhone || place.emergencyPhone || '',
    tagline: place.attributes?.tagline || place.attributes?.businessProfile?.common?.tagline || '',
    consultationInformation: specific.consultationInformation || '',
    programs: asFitnessRecords(specific.programs ?? specific.fitnessPrograms ?? place.attributes?.programs ?? [], 'caption'),
    trainers: asFitnessRecords(specific.trainers ?? specific.coaches ?? place.attributes?.trainers ?? [], 'name'),
    membershipPlans: asFitnessRecords(specific.membershipPlans ?? specific.packages ?? place.attributes?.membershipPlans ?? [], 'name'),
    classSchedule: asFitnessRecords(specific.classSchedule ?? place.attributes?.classSchedule ?? [], 'time'),
    workingHours: hospitalDays.map((day) => {
      const saved = (place.workingHours || []).find((entry) => [day.toLowerCase(), day.slice(0, 3).toLowerCase()].includes(entry.day?.toLowerCase())) || {};
      return { day, open: saved.open || '', close: saved.close || '', closed: Boolean(saved.closed) };
    }),
    ...Object.fromEntries(detailFields.filter(([key]) => !(isFitness && ['programs', 'trainers', 'membershipPlans', 'classSchedule'].includes(key))).map(([key]) => [key, asText(specific[key] ?? place.attributes?.[key] ?? place[key] ?? '')])),
    ...(hasDoctorProfiles ? { doctors: asPeople(specific.doctors ?? place.attributes?.doctors ?? place.doctors ?? []) } : {}),
    socialLinks: { facebook: '', instagram: '', youtube: '', linkedin: '', ...(place.socialLinks || place.attributes?.businessProfile?.common?.socialLinks || {}) },
  });

  const gallery = Array.isArray(form.gallery) ? form.gallery.slice(0, 10) : [];
  const services = useMemo(() => splitList(form.services), [form.services]);
  const facilities = useMemo(() => splitList(form.facilities), [form.facilities]);
  const departments = useMemo(() => splitList(form.departments), [form.departments]);
  const FormContainer = embedded ? 'div' : 'form';

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const save = async (event) => {
    event?.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const nextGallery = gallery.slice(0, 10);
      const categorySpecific = {
        ...specific,
        ...Object.fromEntries(detailFields.filter(([key]) => key !== 'consultationInformation' && !(isFitness && ['programs', 'trainers', 'membershipPlans', 'classSchedule'].includes(key))).map(([key]) => [key, key === 'doctors' && hasDoctorProfiles ? form.doctors : key === 'branches' ? String(form[key] || '').split(/\n/).map((branch) => branch.trim()).filter(Boolean) : splitList(form[key])])),
        ...(isFitness ? {
          programs: form.programs.map((program) => ({ ...program, tags: splitList(program.tags || '') })).filter((program) => program.caption || program.image || program.tags.length),
          trainers: form.trainers.filter((trainer) => trainer.name || trainer.category || trainer.image),
          membershipPlans: form.membershipPlans.map((plan) => ({ ...plan, features: splitList(plan.features || '') })).filter((plan) => plan.name || plan.price || plan.features.length),
          classSchedule: form.classSchedule.filter((row) => row.time || fitnessDays.some((day) => row[day])),
        } : {}),
        consultationInformation: form.consultationInformation,
        emergencyAvailable: form.emergencyAvailable,
        emergencyPhone: form.emergencyPhone || undefined,
      };
      const payload = {
        name: form.name,
        category: form.category || categoryId || place.category?._id || place.category,
        subcategory: form.subcategory || subcategoryId || place.subcategory?._id || place.subcategory || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
        website: form.website || undefined,
        socialLinks: { ...form.socialLinks, whatsapp: form.socialLinks.whatsapp || form.phone || undefined },
        logo: form.logo || undefined,
        coverImage: form.coverImage || undefined,
        address: form.address,
        description: form.description,
        ...(isHospital ? { workingHours: form.workingHours.map((entry) => ({ ...entry, day: entry.day.slice(0, 3).toLowerCase() })).filter((entry) => entry.open || entry.close || entry.closed) } : {}),
        location: { ...location, area: location.area || null },
        services: services,
        facilities: facilities,
        images: nextGallery,
        attributes: {
          ...(place.attributes || {}),
          tagline: form.tagline,
          departments: categorySpecific.departments || departments,
          emergencyAvailable: form.emergencyAvailable,
          emergencyPhone: form.emergencyPhone || undefined,
          businessProfile: {
            ...(place.attributes?.businessProfile || {}),
            businessType: 'healthcare',
            common: {
              ...(place.attributes?.businessProfile?.common || {}),
              businessName: form.name,
              logo: form.logo,
              coverImage: form.coverImage,
              gallery: nextGallery,
              videos: form.videos || [],
              phone: form.phone,
              email: form.email,
              website: form.website,
              address: form.address,
              about: form.description,
              tagline: form.tagline,
              socialLinks: form.socialLinks,
            },
            categorySpecific,
          },
        },
      };

      if (create) {
        await api.post('/places', payload);
        setMessage('Healthcare listing submitted successfully.');
        setTimeout(() => navigate('/business/dashboard'), 1000);
      } else {
        await api.put(`/places/${place._id}`, payload);
        setMessage('Healthcare profile updated successfully.');
      }
    } catch (saveError) {
      setError(saveError.response?.data?.message || saveError.message || 'Unable to save this healthcare profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={embedded ? 'text-[#2d2323]' : 'min-h-screen bg-[#f4efed] px-5 py-10 text-[#2d2323] sm:px-8'}>
      <div className="mx-auto max-w-5xl">
        {!embedded && <button
          type="button"
          onClick={onBack || (() => navigate('/business/dashboard'))}
          className="text-sm font-semibold text-[#0f6cbf]"
        >
          {onBack ? '← Back' : '← Back to Dashboard'}
        </button>}
        <h1 className={`${embedded ? 'mt-1' : 'mt-4'} font-display text-3xl font-semibold text-[#2d2323] sm:text-4xl`}>
          {create ? `Add ${businessTypeLabel}` : `${businessTypeLabel} Profile`}
        </h1>
        <p className="mt-2 text-sm text-[#70615f]">
          Manage this business’s information, services, contact details, photo gallery and videos.
        </p>

        {error && <p className="mt-4 rounded-xl bg-[#fff1f0] p-3 text-sm text-[#a83f32]">{error}</p>}
        {message && <p className="mt-4 rounded-xl bg-[#edf9f1] p-3 text-sm text-[#2f5a3f]">{message}</p>}

        <FormContainer onSubmit={embedded ? undefined : save} className={embedded ? 'mt-6 space-y-6' : 'mt-8 space-y-6'}>
          <section className="rounded-[24px] border border-[#ebded8] bg-white p-5 sm:p-7">
            <h2 className="font-display text-2xl font-semibold">Basic information</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-[#4b3d3b]">
                {businessTypeLabel} Name
                <input required value={form.name} onChange={update('name')} className={inputClass} />
              </label>
              <label className="text-sm font-medium text-[#4b3d3b]">
                Contact Phone
                <input value={form.phone} onChange={update('phone')} className={inputClass} />
              </label>
              <label className="text-sm font-medium text-[#4b3d3b]">
                Email
                <input value={form.email} onChange={update('email')} className={inputClass} />
              </label>
              <label className="text-sm font-medium text-[#4b3d3b]">
                Website
                <input value={form.website} onChange={update('website')} className={inputClass} />
              </label>
              <label className="text-sm font-medium text-[#4b3d3b] sm:col-span-2">
                Tagline
                <input value={form.tagline} onChange={update('tagline')} className={inputClass} placeholder="A short introduction shown on the business page" />
              </label>
            </div>

            <div className="mt-5">
              <LocationCascadeFields value={location} onChange={setLocation} />
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div>
                <BusinessMediaUploader
                  label={`${businessTypeLabel} Logo`}
                  value={form.logo}
                  onChange={(value) => setForm((current) => ({ ...current, logo: value }))}
                  placeId={place._id}
                  previewClassName="h-40"
                  helpText="Upload, preview, replace, or remove the hospital logo."
                />
              </div>
              <div>
                <BusinessMediaUploader
                  label="Cover Image"
                  value={form.coverImage}
                  onChange={(value) => setForm((current) => ({ ...current, coverImage: value }))}
                  placeId={place._id}
                  previewClassName="h-40"
                  helpText="Upload or use an image URL for the healthcare cover image."
                />
              </div>
            </div>

            <label className="mt-6 block text-sm font-medium text-[#4b3d3b]">
              Address
              <textarea rows={3} required value={form.address} onChange={update('address')} className={inputClass} />
            </label>

            <label className="mt-6 block text-sm font-medium text-[#4b3d3b]">
              About {businessTypeLabel}
              <textarea rows={5} value={form.description} onChange={update('description')} className={inputClass} />
            </label>
          </section>

          <section className="rounded-[24px] border border-[#ebded8] bg-white p-5 sm:p-7">
            <h2 className="font-display text-2xl font-semibold">{businessTypeLabel} details</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {detailFields.map(([key, label, placeholder]) => isFitness && ['programs', 'trainers', 'membershipPlans', 'classSchedule'].includes(key) ? null : key === 'doctors' && hasDoctorProfiles ? <div key={key} className="space-y-3 sm:col-span-2"><div className="flex items-center justify-between"><span className="text-sm font-semibold">Doctor profiles</span><button type="button" onClick={() => setForm((current) => ({ ...current, doctors: [...current.doctors, { name: '', photo: '', speciality: '', experience: '', consultationTimings: '' }] }))} className="rounded-lg bg-sky-700 px-3 py-2 text-xs font-bold text-white">+ Add doctor</button></div>{form.doctors.map((doctor, index) => <div key={`doctor-${index}`} className="grid gap-3 rounded-xl border border-sky-100 bg-slate-50 p-3 sm:grid-cols-2"><label className="text-sm font-medium">Doctor name<input required value={doctor.name || ''} onChange={(event) => setForm((current) => ({ ...current, doctors: current.doctors.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item) }))} className={inputClass} /></label><label className="text-sm font-medium">Specialization<input value={doctor.speciality || doctor.specialization || ''} onChange={(event) => setForm((current) => ({ ...current, doctors: current.doctors.map((item, itemIndex) => itemIndex === index ? { ...item, speciality: event.target.value } : item) }))} className={inputClass} /></label><label className="text-sm font-medium">Years of experience<input value={doctor.experience || doctor.yearsOfExperience || ''} onChange={(event) => setForm((current) => ({ ...current, doctors: current.doctors.map((item, itemIndex) => itemIndex === index ? { ...item, experience: event.target.value } : item) }))} className={inputClass} /></label>{isSpecialistClinic && <label className="text-sm font-medium sm:col-span-2">Consultation timings<textarea rows={2} value={doctor.consultationTimings || ''} onChange={(event) => setForm((current) => ({ ...current, doctors: current.doctors.map((item, itemIndex) => itemIndex === index ? { ...item, consultationTimings: event.target.value } : item) }))} className={inputClass} placeholder="Mon–Sat: 9:00 AM–1:00 PM, 4:00 PM–7:00 PM" /></label>}<div><BusinessMediaUploader label="Doctor photo" value={doctor.photo || ''} onChange={(photo) => setForm((current) => ({ ...current, doctors: current.doctors.map((item, itemIndex) => itemIndex === index ? { ...item, photo } : item) }))} placeId={place._id} previewClassName="h-24" /></div><button type="button" onClick={() => setForm((current) => ({ ...current, doctors: current.doctors.filter((_, itemIndex) => itemIndex !== index) }))} className="self-end text-left text-xs font-bold text-red-700">Remove doctor</button></div>)}{form.doctors.length === 0 && <p className="text-xs text-slate-500">Add each doctor’s photo, name, specialization and experience.</p>}</div> : <label key={key} className="text-sm font-medium text-[#4b3d3b]">{label}<textarea rows={key === 'consultationInformation' ? 3 : 4} value={form[key] || ''} onChange={update(key)} className={inputClass} placeholder={placeholder} /></label>)}
              {(isHospital || isSpecialistClinic) && <div className="space-y-4">
                {isHospital && <label className="flex items-center gap-3 rounded-xl border border-[#ebded8] bg-[#faf7f6] p-3 text-sm font-medium text-[#4b3d3b]">
                  <input type="checkbox" checked={form.emergencyAvailable} onChange={(event) => setForm((current) => ({ ...current, emergencyAvailable: event.target.checked }))} className="h-4 w-4 rounded border-[#d6c6c2] text-[#0f6cbf] focus:ring-[#0f6cbf]" />
                  Emergency Care Available
                </label>}
                <label className="text-sm font-medium text-[#4b3d3b]">Emergency Contact Phone<input value={form.emergencyPhone} onChange={update('emergencyPhone')} className={inputClass} /></label>
              </div>}
            </div>
          </section>

          {isHospital && <section className="rounded-[24px] border border-[#ebded8] bg-white p-5 sm:p-7">
            <h2 className="font-display text-2xl font-semibold">Visiting hours</h2>
            <p className="mt-1 text-sm text-slate-500">Set the hospital’s regular visiting or operating hours for each day.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {form.workingHours.map((entry, index) => <div key={entry.day} className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-2 rounded-xl border border-slate-100 p-3">
                <strong className="pb-2 text-sm">{entry.day}</strong>
                <label className="text-xs text-slate-600">Opens<input type="time" disabled={entry.closed} value={entry.open} onChange={(event) => setForm((current) => ({ ...current, workingHours: current.workingHours.map((item, itemIndex) => itemIndex === index ? { ...item, open: event.target.value } : item) }))} className={inputClass} /></label>
                <label className="text-xs text-slate-600">Closes<input type="time" disabled={entry.closed} value={entry.close} onChange={(event) => setForm((current) => ({ ...current, workingHours: current.workingHours.map((item, itemIndex) => itemIndex === index ? { ...item, close: event.target.value } : item) }))} className={inputClass} /></label>
                <label className="flex items-center gap-1 pb-2 text-xs"><input type="checkbox" checked={entry.closed} onChange={(event) => setForm((current) => ({ ...current, workingHours: current.workingHours.map((item, itemIndex) => itemIndex === index ? { ...item, closed: event.target.checked, open: event.target.checked ? '' : item.open, close: event.target.checked ? '' : item.close } : item) }))} />Closed</label>
              </div>)}
            </div>
          </section>}

          {isFitness && <FitnessBusinessFields form={form} setForm={setForm} placeId={place._id} />}

          <section className="rounded-[24px] border border-[#ebded8] bg-white p-5 sm:p-7">
            <h2 className="font-display text-2xl font-semibold">Social links</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">{[['facebook', 'Facebook'], ['instagram', 'Instagram'], ['youtube', 'YouTube'], ...(!(isHospital || isSpecialistClinic) ? [['linkedin', 'LinkedIn']] : []), ['whatsapp', 'WhatsApp number or link']].map(([key, label]) => <label key={key} className="text-sm font-medium capitalize text-[#4b3d3b]">{label}<input value={form.socialLinks[key] || ''} onChange={(event) => setForm((current) => ({ ...current, socialLinks: { ...current.socialLinks, [key]: event.target.value } }))} className={inputClass} placeholder={key === 'whatsapp' ? 'Phone number or https://wa.me/…' : 'https://'} /></label>)}</div>
          </section>

          <section className="rounded-[24px] border border-[#ebded8] bg-white p-5 sm:p-7">
            <BusinessMediaUploader
              label={`${businessTypeLabel} Photos`}
              helpText="Add up to 10 images for the healthcare profile."
              value={gallery}
              onChange={(images) => setForm((current) => ({ ...current, gallery: images }))}
              placeId={place._id}
              multiple
              max={10}
              previewClassName="h-28"
            />
          </section>

          <section className="rounded-[24px] border border-[#ebded8] bg-white p-5 sm:p-7">
            <h2 className="font-display text-2xl font-semibold">Video Gallery</h2>
            <div className="mt-5">
              <BusinessVideoUploader
                label={`${businessTypeLabel} Videos`}
                value={form.videos}
                onChange={(videos) => setForm((current) => ({ ...current, videos }))}
                placeId={place._id}
              />
            </div>
          </section>

          <div className="flex justify-end gap-3">
            {!embedded && <button
              type="button"
              onClick={onBack || (() => navigate('/business/dashboard'))}
              className="rounded-xl border border-[#e7dcd7] bg-white px-4 py-2.5 text-sm font-semibold text-[#4b3d3b]"
            >
              Cancel
            </button>}
            <button
              type={embedded ? 'button' : 'submit'}
              onClick={embedded ? () => save() : undefined}
              disabled={saving}
              className="rounded-xl bg-[#0f6cbf] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? 'Saving...' : create ? 'Submit listing' : 'Save changes'}
            </button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
}
