const skinCareDemoAttributes = (coverImage, galleryImages) => ({
  tagline: 'Expert dermatology for healthy, confident skin',
  businessProfile: {
    businessType: 'healthcare',
    common: {
      tagline: 'Expert dermatology for healthy, confident skin',
      heroDescription: 'Get thoughtful guidance and personalized treatment options from our dermatology team.',
      coverImage,
      gallery: galleryImages,
      videos: [
        { title: 'Skin care clinic preview', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' },
        { title: 'Dermatology care preview', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
      ],
    },
    categorySpecific: {
      aboutDescription: 'Our dermatology team offers thoughtful, personalized care for skin, hair and nail concerns. We take time to understand each patient and explain treatment options clearly.',
      aboutImage: galleryImages[0] || coverImage,
      doctors: [{
        name: 'Dr. Ananya Rao',
        qualification: 'MBBS, MD Dermatology',
        speciality: 'Medical and Cosmetic Dermatology',
        description: 'An experienced dermatologist focused on clear guidance, comfortable consultations and care plans tailored to each patient.',
        consultationTimings: 'Monday–Saturday, 9:00 AM–1:00 PM and 4:00 PM–7:00 PM',
        photo: galleryImages[1] || coverImage,
      }],
      skinServices: [
        { caption: 'Dermatology Consultation', description: 'A one-to-one consultation to understand your skin concerns and discuss suitable care.', image: galleryImages[0] || coverImage },
        { caption: 'Acne and Scar Care', description: 'Personalized support for acne, acne marks and related skin concerns.', image: galleryImages[1] || coverImage },
        { caption: 'Pigmentation Treatment', description: 'Professional assessment and treatment options for uneven skin tone and pigmentation.', image: galleryImages[2] || coverImage },
      ],
      keyFeatures: [
        { icon: '♡', title: 'Patient-first approach', description: 'We listen carefully, answer questions and help patients understand their options.' },
        { icon: '✦', title: 'Qualified dermatologists', description: 'Meet experienced skin specialists for professional guidance and care.' },
        { icon: '✧', title: 'Personalized care plans', description: 'Recommendations are tailored to each patient’s skin needs and goals.' },
      ],
    },
  },
});

module.exports = { skinCareDemoAttributes };
