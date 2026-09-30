import React from 'react';

const DEFAULTS = {
  aboutUs: '', aboutImageUrl: '', logoUrl: '', products: [], processSteps: [],
  whyChooseUs: [], facilities: '', certifications: '', qualityStandards: '',
  industriesServed: '', googleMapsUrl: '', galleryImages: [], galleryVideos: [], stats: [],
  establishedYear: '', founder: '', productionCapacity: '', employeeCount: '', marketsServed: '',
  rawMaterials: '', sourcingDetails: '', packagingOptions: '', distributionChannels: '',
  facilityDetails: '', facilityImages: [], certificationRecords: [], teamMembers: [], testimonials: [],
  bulkOrderDetails: '', minimumOrder: '', privateLabel: '',
};

const inputClass = 'mt-1 w-full rounded-lg border border-[#d7e4dc] bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#168b5b] focus:ring-2 focus:ring-[#168b5b]/10';
const sectionClass = 'rounded-2xl border border-[#d7e4dc] bg-white p-5 shadow-sm sm:p-6';

function Section({ title, description, children }) {
  return <section className={sectionClass}><h2 className="font-display text-xl font-semibold text-[#123b2a]">{title}</h2>{description && <p className="mt-1 text-sm text-slate-500">{description}</p>}<div className="mt-4 space-y-4">{children}</div></section>;
}

function TextField({ label, value, onChange, multiline = false, placeholder = '' }) {
  return <label className="block text-sm font-medium text-slate-700">{label}{multiline ? <textarea rows={3} value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputClass} /> : <input value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputClass} />}</label>;
}

function FileField({ label, accept, file, onChange }) {
  return <label className="block text-sm font-medium text-slate-700">{label}<input type="file" accept={accept} onChange={(event) => onChange(event.target.files?.[0] || null)} className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-[#e8f5ec] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#12613e]`} />{file && <span className="mt-1 block text-xs text-slate-500">Selected: {file.name}</span>}</label>;
}

export default function IndustryFoodProcessingFields({ form, setForm, logoFile, setLogoFile, existingLogo, aboutImageFile, setAboutImageFile, existingAboutImage }) {
  const details = { ...DEFAULTS, ...(form.foodProcessing || {}) };
  const update = (field, value) => setForm((current) => ({ ...current, ...(field === 'facilities' ? { facilities: value } : {}), foodProcessing: { ...DEFAULTS, ...(current.foodProcessing || {}), [field]: value } }));
  const updateItem = (field, index, changes) => update(field, (Array.isArray(details[field]) ? details[field] : []).map((item, itemIndex) => itemIndex === index ? { ...item, ...changes } : item));
  const addItem = (field, item) => update(field, [...(Array.isArray(details[field]) ? details[field] : []), item]);
  const removeItem = (field, index) => update(field, (Array.isArray(details[field]) ? details[field] : []).filter((_, itemIndex) => itemIndex !== index));

  return <div className="col-span-2 space-y-5">
    <div className="rounded-2xl border border-[#b8ddc7] bg-gradient-to-r from-[#effaf3] to-white p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#168b5b]">Industries & Manufacturing</p><h2 className="mt-1 font-display text-2xl font-semibold text-[#123b2a]">Food Processing Business Profile</h2><p className="mt-1 text-sm text-slate-600">Add your products, production process, quality information, facilities and media.</p></div>

    <Section title="Branding and About Us">
      <TextField label="About us" value={details.aboutUs} onChange={(value) => update('aboutUs', value)} multiline placeholder="Describe your food processing business" />
      <TextField label="About Us image URL" value={aboutImageFile ? '' : details.aboutImageUrl} onChange={(value) => { setAboutImageFile?.(null); update('aboutImageUrl', value); }} placeholder="https://example.com/about.jpg" />
      <FileField label="Upload About Us image" accept="image/*" file={aboutImageFile} onChange={(file) => { setAboutImageFile?.(file); if (file) update('aboutImageUrl', ''); }} />
      {!aboutImageFile && existingAboutImage && <p className="text-xs text-slate-500">An About Us image is already saved.</p>}
      <TextField label="Logo image URL" value={logoFile ? '' : details.logoUrl} onChange={(value) => { setLogoFile?.(null); update('logoUrl', value); }} placeholder="https://example.com/logo.png" />
      <FileField label="Upload logo from device" accept="image/*" file={logoFile} onChange={(file) => { setLogoFile?.(file); if (file) update('logoUrl', ''); }} />
      {!logoFile && existingLogo && <p className="text-xs text-slate-500">A logo is already saved.</p>}
    </Section>

    <Section title="Products" description="Add each product with a description and an optional image upload or URL.">
      {(Array.isArray(details.products) ? details.products : []).map((product, index) => {
        const item = typeof product === 'string' ? { name: product } : product;
        return <div key={`product-${index}`} className="rounded-xl border border-[#e2ece5] bg-[#f8fcf9] p-4"><div className="flex items-center justify-between"><h3 className="font-semibold text-[#123b2a]">Product {index + 1}</h3><button type="button" onClick={() => removeItem('products', index)} className="text-sm font-medium text-red-600">Remove</button></div><div className="mt-3 grid gap-3 sm:grid-cols-2"><TextField label="Product name" value={item.name} onChange={(value) => updateItem('products', index, { name: value })} placeholder="Product name" /><TextField label="Product image URL" value={item.imageFile ? '' : item.imageUrl || item.image} onChange={(value) => updateItem('products', index, { imageUrl: value, imageFile: null, image: value })} placeholder="https://example.com/product.jpg" /><div className="sm:col-span-2"><TextField label="Description" value={item.description} onChange={(value) => updateItem('products', index, { description: value })} multiline placeholder="Describe this product" /></div><div className="sm:col-span-2"><FileField label="Upload product image" accept="image/*" file={item.imageFile} onChange={(file) => updateItem('products', index, { imageFile: file, imageUrl: '', image: '' })} /></div></div></div>;
      })}
      <button type="button" onClick={() => addItem('products', { name: '', description: '', imageUrl: '', imageFile: null })} className="rounded-lg bg-[#176b46] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#125638]">+ Add product</button>
    </Section>

    <Section title="Production Process" description="Describe the main steps used to process and package your products.">
      {(Array.isArray(details.processSteps) ? details.processSteps : []).map((step, index) => <div key={`process-${index}`} className="rounded-xl border border-[#e2ece5] bg-[#f8fcf9] p-4"><div className="flex items-center justify-between"><h3 className="font-semibold text-[#123b2a]">Step {index + 1}</h3><button type="button" onClick={() => removeItem('processSteps', index)} className="text-sm font-medium text-red-600">Remove</button></div><div className="mt-3 grid gap-3 sm:grid-cols-2"><TextField label="Step title" value={step.title} onChange={(value) => updateItem('processSteps', index, { title: value })} placeholder="Example: Cleaning and sorting" /><TextField label="Image URL" value={step.imageFile ? '' : step.imageUrl || step.image} onChange={(value) => updateItem('processSteps', index, { imageUrl: value, imageFile: null, image: value })} placeholder="https://example.com/process.jpg" /><div className="sm:col-span-2"><TextField label="Description" value={step.description} onChange={(value) => updateItem('processSteps', index, { description: value })} multiline placeholder="Describe this process step" /></div><div className="sm:col-span-2"><FileField label="Upload step image" accept="image/*" file={step.imageFile} onChange={(file) => updateItem('processSteps', index, { imageFile: file, imageUrl: '', image: '' })} /></div></div></div>)}
      <button type="button" onClick={() => addItem('processSteps', { title: '', description: '', imageUrl: '', imageFile: null })} className="rounded-lg border border-[#a9d2b8] bg-[#f1faf4] px-4 py-2.5 text-sm font-semibold text-[#176b46]">+ Add process step</button>
    </Section>

    <Section title="Industries Served, Facilities and Quality">
      <TextField label="Industries served" value={details.industriesServed} onChange={(value) => update('industriesServed', value)} multiline placeholder="Enter industries separated by commas or new lines" />
      <TextField label="Facilities" value={details.facilities} onChange={(value) => update('facilities', value)} multiline placeholder="Example: cold storage, packaging line, testing laboratory" />
      <TextField label="Certifications" value={details.certifications} onChange={(value) => update('certifications', value)} multiline placeholder="Example: FSSAI, ISO 22000, HACCP" />
      <TextField label="Quality standards" value={details.qualityStandards} onChange={(value) => update('qualityStandards', value)} multiline placeholder="Describe hygiene, inspection and quality control standards" />
      <TextField label="Why choose us" value={(Array.isArray(details.whyChooseUs) ? details.whyChooseUs : []).join('\n')} onChange={(value) => update('whyChooseUs', value.split(/[\n,]/).map((entry) => entry.trim()).filter(Boolean))} multiline placeholder="Enter one reason per line" />
    </Section>

    <Section title="Company Facts" description="These details appear as company highlights on your public page.">
      <div className="grid gap-3 sm:grid-cols-2"><TextField label="Established year" value={details.establishedYear} onChange={(value) => update('establishedYear', value)} placeholder="2015" /><TextField label="Founder / owner" value={details.founder} onChange={(value) => update('founder', value)} placeholder="Founder name" /><TextField label="Production capacity" value={details.productionCapacity} onChange={(value) => update('productionCapacity', value)} placeholder="Example: 5 tonnes per day" /><TextField label="Number of employees" value={details.employeeCount} onChange={(value) => update('employeeCount', value)} placeholder="Example: 50+" /><TextField label="Markets served" value={details.marketsServed} onChange={(value) => update('marketsServed', value)} placeholder="Local, national, export" /><TextField label="Business type" value={details.businessType || ''} onChange={(value) => update('businessType', value)} placeholder="Manufacturer / processor / exporter" /></div>
    </Section>

    <Section title="Raw Materials and Sourcing">
      <TextField label="Raw materials used" value={details.rawMaterials} onChange={(value) => update('rawMaterials', value)} multiline placeholder="List your primary ingredients and materials" />
      <TextField label="Sourcing details" value={details.sourcingDetails} onChange={(value) => update('sourcingDetails', value)} multiline placeholder="Explain where and how you source ingredients" />
    </Section>

    <Section title="Packaging and Distribution">
      <TextField label="Packaging options" value={details.packagingOptions} onChange={(value) => update('packagingOptions', value)} multiline placeholder="Example: retail packs, bulk sacks, refrigerated packaging" />
      <TextField label="Distribution channels" value={details.distributionChannels} onChange={(value) => update('distributionChannels', value)} multiline placeholder="Example: wholesalers, retailers, hotels, exports" />
    </Section>

    <Section title="Facility Gallery" description="Show your production floor, equipment, storage and packaging areas.">
      {(details.facilityImages || []).map((image, index) => <div key={`facility-${index}`} className="grid gap-3 rounded-xl border border-[#e2ece5] bg-[#f8fcf9] p-4 sm:grid-cols-2"><div className="flex items-center justify-between sm:col-span-2"><h3 className="font-semibold text-[#123b2a]">Facility photo {index + 1}</h3><button type="button" onClick={() => removeItem('facilityImages', index)} className="text-sm font-medium text-red-600">Remove</button></div><TextField label="Photo caption" value={image.title} onChange={(value) => updateItem('facilityImages', index, { title: value })} placeholder="Production floor" /><TextField label="Image URL" value={image.file ? '' : image.url} onChange={(value) => updateItem('facilityImages', index, { url: value, file: null })} placeholder="https://example.com/facility.jpg" /><div className="sm:col-span-2"><FileField label="Upload facility photo" accept="image/*" file={image.file} onChange={(file) => updateItem('facilityImages', index, { file, url: '' })} /></div></div>)}
      <button type="button" onClick={() => addItem('facilityImages', { title: '', url: '', file: null })} className="rounded-lg bg-[#176b46] px-4 py-2.5 text-sm font-semibold text-white">+ Add facility photo</button>
      <TextField label="Facility details" value={details.facilityDetails} onChange={(value) => update('facilityDetails', value)} multiline placeholder="Describe your plant, equipment, storage and production capacity" />
    </Section>

    <Section title="Certificate Details" description="Add certificate authority and validity information for each certification.">
      {(details.certificationRecords || []).map((record, index) => <div key={`certificate-${index}`} className="grid gap-3 rounded-xl border border-[#e2ece5] bg-[#f8fcf9] p-4 sm:grid-cols-2"><div className="flex items-center justify-between sm:col-span-2"><h3 className="font-semibold text-[#123b2a]">Certificate {index + 1}</h3><button type="button" onClick={() => removeItem('certificationRecords', index)} className="text-sm font-medium text-red-600">Remove</button></div><TextField label="Certificate name" value={record.name} onChange={(value) => updateItem('certificationRecords', index, { name: value })} placeholder="FSSAI / ISO 22000" /><TextField label="Issuing authority" value={record.authority} onChange={(value) => updateItem('certificationRecords', index, { authority: value })} placeholder="Issuing organization" /><TextField label="Certificate number" value={record.number} onChange={(value) => updateItem('certificationRecords', index, { number: value })} placeholder="Certificate number" /><TextField label="Valid until" value={record.validUntil} onChange={(value) => updateItem('certificationRecords', index, { validUntil: value })} placeholder="DD/MM/YYYY" /><TextField label="Verification URL" value={record.url} onChange={(value) => updateItem('certificationRecords', index, { url: value })} placeholder="https://..." /></div>)}
      <button type="button" onClick={() => addItem('certificationRecords', { name: '', authority: '', number: '', validUntil: '', url: '' })} className="rounded-lg border border-[#a9d2b8] bg-[#f1faf4] px-4 py-2.5 text-sm font-semibold text-[#176b46]">+ Add certificate</button>
    </Section>

    <Section title="Company Statistics">
      {(details.stats || []).map((stat, index) => <div key={`stat-${index}`} className="grid gap-3 rounded-xl border border-[#e2ece5] bg-[#f8fcf9] p-4 sm:grid-cols-[1fr_1fr_auto]"><TextField label="Value" value={stat.value} onChange={(value) => updateItem('stats', index, { value })} placeholder="10+" /><TextField label="Label" value={stat.label} onChange={(value) => updateItem('stats', index, { label: value })} placeholder="Years of experience" /><button type="button" onClick={() => removeItem('stats', index)} className="self-end pb-2 text-sm font-medium text-red-600">Remove</button></div>)}
      <button type="button" onClick={() => addItem('stats', { value: '', label: '' })} className="rounded-lg border border-[#a9d2b8] bg-[#f1faf4] px-4 py-2.5 text-sm font-semibold text-[#176b46]">+ Add statistic</button>
    </Section>

    <Section title="Our Team">
      {(details.teamMembers || []).map((member, index) => <div key={`team-${index}`} className="grid gap-3 rounded-xl border border-[#e2ece5] bg-[#f8fcf9] p-4 sm:grid-cols-2"><div className="flex items-center justify-between sm:col-span-2"><h3 className="font-semibold text-[#123b2a]">Team member {index + 1}</h3><button type="button" onClick={() => removeItem('teamMembers', index)} className="text-sm font-medium text-red-600">Remove</button></div><TextField label="Name" value={member.name} onChange={(value) => updateItem('teamMembers', index, { name: value })} placeholder="Name" /><TextField label="Role" value={member.role} onChange={(value) => updateItem('teamMembers', index, { role: value })} placeholder="Quality manager" /><div className="sm:col-span-2"><TextField label="Short introduction" value={member.bio} onChange={(value) => updateItem('teamMembers', index, { bio: value })} multiline placeholder="Experience and responsibilities" /></div><div className="sm:col-span-2"><TextField label="Photo URL" value={member.photoUrl} onChange={(value) => updateItem('teamMembers', index, { photoUrl: value })} placeholder="https://example.com/team.jpg" /></div></div>)}
      <button type="button" onClick={() => addItem('teamMembers', { name: '', role: '', bio: '', photoUrl: '' })} className="rounded-lg border border-[#a9d2b8] bg-[#f1faf4] px-4 py-2.5 text-sm font-semibold text-[#176b46]">+ Add team member</button>
    </Section>

    <Section title="Customer Testimonials">
      {(details.testimonials || []).map((item, index) => <div key={`testimonial-${index}`} className="grid gap-3 rounded-xl border border-[#e2ece5] bg-[#f8fcf9] p-4 sm:grid-cols-2"><div className="flex items-center justify-between sm:col-span-2"><h3 className="font-semibold text-[#123b2a]">Testimonial {index + 1}</h3><button type="button" onClick={() => removeItem('testimonials', index)} className="text-sm font-medium text-red-600">Remove</button></div><TextField label="Customer name" value={item.name} onChange={(value) => updateItem('testimonials', index, { name: value })} placeholder="Customer name" /><TextField label="Customer role / company" value={item.role} onChange={(value) => updateItem('testimonials', index, { role: value })} placeholder="Retail buyer, company" /><div className="sm:col-span-2"><TextField label="Testimonial" value={item.quote} onChange={(value) => updateItem('testimonials', index, { quote: value })} multiline placeholder="Customer feedback" /></div></div>)}
      <button type="button" onClick={() => addItem('testimonials', { name: '', role: '', quote: '' })} className="rounded-lg border border-[#a9d2b8] bg-[#f1faf4] px-4 py-2.5 text-sm font-semibold text-[#176b46]">+ Add testimonial</button>
    </Section>

    <Section title="Bulk Orders and Private Label">
      <TextField label="Bulk order information" value={details.bulkOrderDetails} onChange={(value) => update('bulkOrderDetails', value)} multiline placeholder="Explain wholesale supply, lead times and order terms" />
      <TextField label="Minimum order quantity" value={details.minimumOrder} onChange={(value) => update('minimumOrder', value)} placeholder="Example: 100 kg" />
      <TextField label="Private label / custom packaging" value={details.privateLabel} onChange={(value) => update('privateLabel', value)} multiline placeholder="Describe private label and custom packaging options" />
    </Section>

    <Section title="Google Maps Location" description="Paste the Google Maps link for your business. The address above is also used to show the map on your public page.">
      <TextField label="Google Maps location URL" value={details.googleMapsUrl} onChange={(value) => update('googleMapsUrl', value)} placeholder="https://maps.app.goo.gl/..." />
    </Section>

    <Section title="Image Gallery" description="Upload images from your device or paste image URLs. Add as many images as needed.">
      {(Array.isArray(details.galleryImages) ? details.galleryImages : []).map((image, index) => <div key={`gallery-image-${index}`} className="grid gap-3 rounded-xl border border-[#e2ece5] bg-[#f8fcf9] p-4 sm:grid-cols-2"><div className="flex items-center justify-between sm:col-span-2"><h3 className="font-semibold text-[#123b2a]">Image {index + 1}</h3><button type="button" onClick={() => removeItem('galleryImages', index)} className="text-sm font-medium text-red-600">Remove</button></div><TextField label="Image title" value={image.title} onChange={(value) => updateItem('galleryImages', index, { title: value })} placeholder="Optional title" /><TextField label="Image URL" value={image.file ? '' : image.url} onChange={(value) => updateItem('galleryImages', index, { url: value, file: null })} placeholder="https://example.com/image.jpg" /><div className="sm:col-span-2"><FileField label="Upload image from device" accept="image/*" file={image.file} onChange={(file) => updateItem('galleryImages', index, { file, url: '' })} /></div></div>)}
      <button type="button" onClick={() => addItem('galleryImages', { title: '', url: '', file: null })} className="rounded-lg bg-[#176b46] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#125638]">+ Add image</button>
    </Section>

    <Section title="Video Gallery" description="Upload videos from your device or paste video URLs. Add as many videos as needed.">
      {(Array.isArray(details.galleryVideos) ? details.galleryVideos : []).map((video, index) => <div key={`gallery-video-${index}`} className="grid gap-3 rounded-xl border border-[#e2ece5] bg-[#f8fcf9] p-4 sm:grid-cols-2"><div className="flex items-center justify-between sm:col-span-2"><h3 className="font-semibold text-[#123b2a]">Video {index + 1}</h3><button type="button" onClick={() => removeItem('galleryVideos', index)} className="text-sm font-medium text-red-600">Remove</button></div><TextField label="Video title" value={video.title} onChange={(value) => updateItem('galleryVideos', index, { title: value })} placeholder="Optional title" /><TextField label="Video URL" value={video.file ? '' : video.url} onChange={(value) => updateItem('galleryVideos', index, { url: value, file: null })} placeholder="https://example.com/video.mp4" /><div className="sm:col-span-2"><FileField label="Upload video from device" accept="video/mp4,video/webm,video/ogg,video/quicktime" file={video.file} onChange={(file) => updateItem('galleryVideos', index, { file, url: '' })} /></div></div>)}
      <button type="button" onClick={() => addItem('galleryVideos', { title: '', url: '', file: null })} className="rounded-lg bg-[#176b46] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#125638]">+ Add video</button>
    </Section>
  </div>;
}
