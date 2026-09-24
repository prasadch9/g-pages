
const mongoose = require('mongoose');
const slugify = require('slugify');

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    businessGroup: {
      type: String,
      enum: ['business-professional-services', 'logistics-moving', null],
      default: null,
    },

    subcategory: {
      type: String,
      trim: true,
      default: null,
    },

    pageType: {
      type: String,
      enum: ['premium', 'static', 'dynamic'],
      default: 'premium',
    },

    location: {
      state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
      },

      district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
      },

      city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
      },

      area: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        default: null,
      },
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: '',
      trim: true,
    },

    phone: {
      type: String,
      default: null,
      trim: true,
    },

    email: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    },

    website: {
      type: String,
      default: null,
      trim: true,
    },

    socialLinks: {
      facebook: {
        type: String,
        default: null,
      },

      instagram: {
        type: String,
        default: null,
      },

      linkedin: {
        type: String,
        default: null,
      },

      youtube: {
        type: String,
        default: null,
      },

      whatsapp: {
        type: String,
        default: null,
      },

      twitter: {
        type: String,
        default: null,
      },
    },

    images: [
      {
        type: String,
      },
    ],

    logo: {
      type: String,
      default: null,
    },

    coverImage: {
      type: String,
      default: null,
    },

    video: {
      type: String,
      default: null,
    },

    videos: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    albums: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    portfolio: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    testimonials: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    offers: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    events: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    categoryData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    seo: {
      title: { type: String, default: null, trim: true, maxlength: 160 },
      description: { type: String, default: null, trim: true, maxlength: 320 },
      canonicalUrl: { type: String, default: null, trim: true },
      socialImage: { type: String, default: null, trim: true },
    },

    services: [
      {
        type: String,
      },
    ],

    facilities: [
      {
        type: String,
      },
    ],

    workingHours: [
      {
        day: {
          type: String,
          enum: [
            'mon',
            'tue',
            'wed',
            'thu',
            'fri',
            'sat',
            'sun',
          ],
        },

        open: {
          type: String,
        },

        close: {
          type: String,
        },

        closed: {
          type: Boolean,
          default: false,
        },
      },
    ],

    coordinates: {
      lat: {
        type: Number,
        default: null,
      },

      lng: {
        type: Number,
        default: null,
      },
    },

    // Dynamic category-specific fields.
    attributes: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },

      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    verified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: [
        'pending',
        'approved',
        'rejected',
        'suspended',
      ],
      default: 'pending',
    },

    applicationStatus: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'resubmitted'],
      default: 'submitted',
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      default: null,
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    favoritesCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    searchAppearances: {
      type: Number,
      default: 0,
      min: 0,
    },
  },

  {
    timestamps: true,
  }
);


// ============================================================
// Automatically create slug when using save/create
// ============================================================

placeSchema.pre('validate', function (next) {
  if (this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  next();
});


// ============================================================
// Indexes
// ============================================================

// Main city/category discovery query
placeSchema.index({
  'location.city': 1,
  category: 1,
  status: 1,
});

// Verified/active listings
placeSchema.index({
  status: 1,
  verified: 1,
});

placeSchema.index({
  applicationStatus: 1,
  isPublished: 1,
  owner: 1,
});

placeSchema.index({
  pageType: 1,
  businessGroup: 1,
  subcategory: 1,
});

// Text search
placeSchema.index({
  name: 'text',
  description: 'text',
  services: 'text',
});

// Slug lookup within city
placeSchema.index(
  {
    slug: 1,
    'location.city': 1,
  },
  {
    unique: true,
  }
);

// Owner dashboard
placeSchema.index({
  owner: 1,
  createdAt: -1,
});

// Category browsing
placeSchema.index({
  category: 1,
  status: 1,
});

module.exports = mongoose.model('Place', placeSchema);
