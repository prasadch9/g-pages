import React from 'react';

const DEFAULTS = {
  aboutUs: '',
  aboutImageUrl: '',
  logoUrl: '',
  products: [],
  manufacturingCapabilities: [],
  whyChooseUs: [],
  industriesServed: '',
  facilities: '',
  certifications: '',
  qualityStandards: '',
  googleMapsUrl: '',
  galleryImages: [],
  galleryVideos: [],
};

const inputClass = 'mt-1 w-full rounded-lg border border-[#d7e4dc] bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#168b5b] focus:ring-2 focus:ring-[#168b5b]/10';
const sectionClass = 'rounded-2xl border border-[#d7e4dc] bg-white p-5 shadow-sm sm:p-6';

function Section({ title, description, children }) {
  return <section className={sectionClass}><h2 className="font-display text-xl font-semibold text-[#123b2a]">{title}</h2>{description && <p className="mt-1 text-sm text-slate-500">{description}</p>}<div className="mt-4 space-y-4">{children}</div></section>;
}

function TextField({ label, value, onChange, multiline = false, placeholder = '' }) {
  return <label className="block text-sm font-medium text-slate-700">{label}{multiline ? <textarea rows={3} value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputClass} /> : <input value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputClass} />}</label>;
}

export default function SmallScaleIndustriesFields({ form, setForm, logoFile, setLogoFile, existingLogo, aboutImageFile, setAboutImageFile, existingAboutImage }) {
  const details = { ...DEFAULTS, ...(form.smallScaleIndustries || {}) };
  const update = (field, value) => setForm((current) => ({ ...current, ...(field === 'facilities' ? { facilities: value } : {}), smallScaleIndustries: { ...DEFAULTS, ...(current.smallScaleIndustries || {}), [field]: value } }));
  const updateItem = (field, index, changes) => update(field, (details[field] || []).map((item, itemIndex) => itemIndex === index ? { ...item, ...changes } : item));
  const addItem = (field, item) => update(field, [...(details[field] || []), item]);
  const removeItem = (field, index) => update(field, (details[field] || []).filter((_, itemIndex) => itemIndex !== index));

  return <div className="col-span-2 space-y-5">
    <div className="rounded-2xl border border-[#b8ddc7] bg-gradient-to-r from-[#effaf3] to-white p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#168b5b]">Small Scale Industries</p>
      <h2 className="mt-1 font-display text-2xl font-semibold text-[#123b2a]">Business profile</h2>
      <p className="mt-1 text-sm text-slate-600">Add your manufacturing, products, capabilities, images and videos. All labels are in English.</p>
    </div>

    <Section title="Branding and About Us">
      <TextField label="About us" value={details.aboutUs} onChange={(value) => update('aboutUs', value)} multiline placeholder="Describe your manufacturing business" />
      <TextField label="About Us image URL" value={aboutImageFile ? '' : details.aboutImageUrl} onChange={(value) => { setAboutImageFile?.(null); update('aboutImageUrl', value); }} placeholder="https://example.com/about.jpg" />
      <label className="block text-sm font-medium text-slate-700">Upload About Us image<input type="file" accept="image/*" onChange={(event) => { setAboutImageFile?.(event.target.files?.[0] || null); update('aboutImageUrl', ''); }} className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-[#e8f5ec] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#12613e]`} />{aboutImageFile && <span className="mt-1 block text-xs text-slate-500">Selected: {aboutImageFile.name}</span>}{!aboutImageFile && existingAboutImage && <span className="mt-1 block text-xs text-slate-500">An About Us image is already saved.</span>}</label>
      <TextField label="Logo image URL" value={logoFile ? '' : details.logoUrl} onChange={(value) => { setLogoFile?.(null); update('logoUrl', value); }} placeholder="https://example.com/logo.png" />
      <label className="block text-sm font-medium text-slate-700">Upload logo from device<input type="file" accept="image/*" onChange={(event) => { setLogoFile?.(event.target.files?.[0] || null); update('logoUrl', ''); }} className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-[#e8f5ec] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#12613e]`} />{logoFile && <span className="mt-1 block text-xs text-slate-500">Selected: {logoFile.name}</span>}{!logoFile && existingLogo && <span className="mt-1 block text-xs text-slate-500">A logo is already saved.</span>}</label>
    </Section>

    <Section title="Products" description="Add each product or service with an optional image from your device or an image URL.">
      {details.products.map((product, index) => {
        const item = typeof product === 'string' ? { name: product } : product;
        return <div key={`product-${index}`} className="rounded-xl border border-[#e2ece5] bg-[#f8fcf9] p-4">
          <div className="flex items-center justify-between gap-3"><h3 className="font-semibold text-[#123b2a]">Product {index + 1}</h3><button type="button" onClick={() => removeItem('products', index)} className="text-sm font-medium text-red-600">Remove</button></div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <TextField label="Product name" value={item.name} onChange={(value) => updateItem('products', index, { name: value })} placeholder="Product name" />
            <TextField label="Product image URL" value={item.imageUrl || (item.imageFile ? '' : item.image)} onChange={(value) => updateItem('products', index, { imageUrl: value, imageFile: null, image: value })} placeholder="https://example.com/product.jpg" />
            <div className="sm:col-span-2"><TextField label="Description" value={item.description} onChange={(value) => updateItem('products', index, { description: value })} multiline placeholder="Describe this product" /></div>
            <label className="block text-sm font-medium text-slate-700 sm:col-span-2">Upload product image<input type="file" accept="image/*" onChange={(event) => updateItem('products', index, { imageFile: event.target.files?.[0] || null, imageUrl: '', image: '' })} className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-[#e8f5ec] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#12613e]`} />{item.imageFile && <span className="mt-1 block text-xs text-slate-500">Selected: {item.imageFile.name}</span>}</label>
          </div>
        </div>;
      })}
      <button type="button" onClick={() => addItem('products', { name: '', description: '', imageUrl: '', imageFile: null })} className="rounded-lg bg-[#176b46] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#125638]">+ Add product</button>
    </Section>

    <Section title="Manufacturing Capabilities" description="Add the processes, equipment or production capabilities you offer.">
      {details.manufacturingCapabilities.map((capability, index) => <div key={`capability-${index}`} className="flex items-end gap-2"><div className="flex-1"><TextField label={`Capability ${index + 1}`} value={typeof capability === 'string' ? capability : capability.title} onChange={(value) => updateItem('manufacturingCapabilities', index, { title: value })} placeholder="Example: CNC machining" /></div><button type="button" onClick={() => removeItem('manufacturingCapabilities', index)} className="mb-1 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600">Remove</button></div>)}
      <button type="button" onClick={() => addItem('manufacturingCapabilities', { title: '' })} className="rounded-lg border border-[#a9d2b8] bg-[#f1faf4] px-4 py-2.5 text-sm font-semibold text-[#176b46]">+ Add capability</button>
    </Section>

    <Section title="Industries Served, Facilities and Quality">
      <TextField label="Industries served" value={details.industriesServed} onChange={(value) => update('industriesServed', value)} multiline placeholder="Enter industries separated by commas or new lines" />
      <TextField label="Facilities" value={details.facilities} onChange={(value) => update('facilities', value)} multiline placeholder="Example: CNC machines, quality testing lab, warehouse, loading area" />
      <TextField label="Certifications" value={details.certifications} onChange={(value) => update('certifications', value)} multiline placeholder="Example: ISO 9001, MSME, BIS" />
      <TextField label="Quality standards" value={details.qualityStandards} onChange={(value) => update('qualityStandards', value)} multiline placeholder="Describe inspections, material standards and quality checks" />
      <TextField label="Why choose us" value={(Array.isArray(details.whyChooseUs) ? details.whyChooseUs : []).join('\n')} onChange={(value) => update('whyChooseUs', value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean))} multiline placeholder="Enter one reason per line" />
    </Section>

    <Section title="Google Maps Location" description="Paste the Google Maps link for your business. The address above is also used to show the map on your public page.">
      <TextField label="Google Maps location URL" value={details.googleMapsUrl} onChange={(value) => update('googleMapsUrl', value)} placeholder="https://maps.app.goo.gl/..." />
    </Section>

    <Section title="Image Gallery" description="For each image, upload a file or enter an image URL. Use Add image to include more images.">
      {details.galleryImages.map((image, index) => <div key={`gallery-image-${index}`} className="grid gap-3 rounded-xl border border-[#e2ece5] bg-[#f8fcf9] p-4 sm:grid-cols-2">
        <div className="flex items-center justify-between gap-3 sm:col-span-2"><h3 className="font-semibold text-[#123b2a]">Image {index + 1}</h3><button type="button" onClick={() => removeItem('galleryImages', index)} className="text-sm font-medium text-red-600">Remove</button></div>
        <TextField label="Image title" value={image.title} onChange={(value) => updateItem('galleryImages', index, { title: value })} placeholder="Optional title" />
        <TextField label="Image URL" value={image.file ? '' : image.url} onChange={(value) => updateItem('galleryImages', index, { url: value, file: null })} placeholder="https://example.com/image.jpg" />
        <label className="block text-sm font-medium text-slate-700 sm:col-span-2">Upload image from device<input type="file" accept="image/*" onChange={(event) => updateItem('galleryImages', index, { file: event.target.files?.[0] || null, url: '' })} className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-[#e8f5ec] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#12613e]`} />{image.file && <span className="mt-1 block text-xs text-slate-500">Selected: {image.file.name}</span>}</label>
      </div>)}
      <button type="button" onClick={() => addItem('galleryImages', { title: '', url: '', file: null })} className="rounded-lg bg-[#176b46] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#125638]">+ Add image</button>
    </Section>

    <Section title="Video Gallery" description="For each video, upload a file or enter a video URL. Use Add video to include more videos.">
      {details.galleryVideos.map((video, index) => <div key={`gallery-video-${index}`} className="grid gap-3 rounded-xl border border-[#e2ece5] bg-[#f8fcf9] p-4 sm:grid-cols-2">
        <div className="flex items-center justify-between gap-3 sm:col-span-2"><h3 className="font-semibold text-[#123b2a]">Video {index + 1}</h3><button type="button" onClick={() => removeItem('galleryVideos', index)} className="text-sm font-medium text-red-600">Remove</button></div>
        <TextField label="Video title" value={video.title} onChange={(value) => updateItem('galleryVideos', index, { title: value })} placeholder="Optional title" />
        <TextField label="Video URL" value={video.file ? '' : video.url} onChange={(value) => updateItem('galleryVideos', index, { url: value, file: null })} placeholder="https://example.com/video.mp4" />
        <label className="block text-sm font-medium text-slate-700 sm:col-span-2">Upload video from device<input type="file" accept="video/mp4,video/webm,video/ogg,video/quicktime" onChange={(event) => updateItem('galleryVideos', index, { file: event.target.files?.[0] || null, url: '' })} className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-[#e8f5ec] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#12613e]`} />{video.file && <span className="mt-1 block text-xs text-slate-500">Selected: {video.file.name}</span>}</label>
      </div>)}
      <button type="button" onClick={() => addItem('galleryVideos', { title: '', url: '', file: null })} className="rounded-lg bg-[#176b46] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#125638]">+ Add video</button>
    </Section>
  </div>;
}
