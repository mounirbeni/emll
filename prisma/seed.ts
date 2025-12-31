import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

/**
 * High-Quality Marrakech Activities Seed Data
 * 10 premium experiences with Unsplash images and realistic pricing
 */

const marrakechActivities = [
  {
    title: "Agafay Desert Sunset, Camel & Dinner Show",
    description: "Experience the magic of the Agafay Desert with a sunset camel ride followed by a traditional Berber dinner under the stars. Enjoy live music, fire shows, and authentic Moroccan cuisine in a luxury desert camp setting. This is one of Marrakech's most popular evening experiences, perfect for couples and families seeking an unforgettable desert adventure.",
    price: 95.00, // EUR
    category: "Desert & Adventure Activities",
    images: [
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=600&fit=crop"
    ],
    duration: "6 hours",
    location: "Agafay Desert, Marrakech",
    latitude: 31.6295,
    longitude: -8.0089,
    features: [
      "Sunset camel ride",
      "Traditional Berber dinner",
      "Live music & fire show",
      "Desert camp experience",
      "Round-trip transportation"
    ],
    included: [
      "Professional guide",
      "Camel ride (30 minutes)",
      "Traditional dinner",
      "Mint tea & pastries",
      "Live entertainment",
      "Hotel pickup & drop-off"
    ],
    whatToBring: [
      "Warm jacket (desert gets cold at night)",
      "Camera",
      "Comfortable shoes",
      "Cash for tips"
    ],
    tags: ["Desert", "Sunset", "Dinner", "Camel", "Evening", "Popular"],
    itinerary: [
      {
        time: "16:00",
        title: "Hotel Pickup",
        description: "Comfortable air-conditioned vehicle picks you up from your hotel in Marrakech"
      },
      {
        time: "17:00",
        title: "Arrive at Agafay Desert",
        description: "Arrive at the luxury desert camp, enjoy welcome mint tea"
      },
      {
        time: "17:30",
        title: "Sunset Camel Ride",
        description: "30-minute camel trek through the desert dunes during golden hour"
      },
      {
        time: "19:00",
        title: "Traditional Dinner",
        description: "Enjoy authentic Berber cuisine including tagine, couscous, and fresh bread"
      },
      {
        time: "20:00",
        title: "Live Entertainment",
        description: "Berber music, fire show, and stargazing under the desert sky"
      },
      {
        time: "22:00",
        title: "Return to Marrakech",
        description: "Drop-off at your hotel"
      }
    ],
    host: "Marrakech Desert Adventures",
    rating: 4.8,
    reviews: 127
  },
  {
    title: "Hot Air Balloon Sunrise Over Atlas Mountains",
    description: "Soar above Marrakech and the Atlas Mountains in a hot air balloon at sunrise. This premium experience offers breathtaking panoramic views of the city, palm groves, and snow-capped peaks. Includes traditional Berber breakfast in a nomad tent after landing. Perfect for special occasions and photography enthusiasts.",
    price: 180.00,
    category: "Desert & Adventure Activities",
    images: [
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1509316975859-7d2d70e8bc86?w=800&h=600&fit=crop"
    ],
    duration: "5 hours",
    location: "Atlas Mountains, Marrakech",
    latitude: 31.6295,
    longitude: -7.9811,
    features: [
      "Sunrise hot air balloon flight",
      "Atlas Mountains views",
      "Berber breakfast",
      "Flight certificate",
      "Professional pilot"
    ],
    included: [
      "1-hour balloon flight",
      "Traditional Berber breakfast",
      "Flight certificate",
      "Hotel pickup & drop-off",
      "Safety briefing"
    ],
    whatToBring: [
      "Warm clothing (early morning)",
      "Camera",
      "Comfortable shoes"
    ],
    tags: ["Balloon", "Sunrise", "Luxury", "Mountains", "Adventure"],
    itinerary: [
      {
        time: "05:00",
        title: "Hotel Pickup",
        description: "Early morning pickup from your hotel"
      },
      {
        time: "05:45",
        title: "Arrival & Safety Briefing",
        description: "Arrive at launch site, meet your pilot, safety instructions"
      },
      {
        time: "06:30",
        title: "Sunrise Flight",
        description: "1-hour balloon flight over Marrakech and Atlas Mountains"
      },
      {
        time: "07:30",
        title: "Landing & Breakfast",
        description: "Traditional Berber breakfast in nomad tent"
      },
      {
        time: "09:00",
        title: "Return to Hotel",
        description: "Drop-off at your accommodation"
      }
    ],
    host: "Atlas Balloon Adventures",
    rating: 4.9,
    reviews: 89
  },
  {
    title: "Yves Saint Laurent & Majorelle Garden VIP Tour",
    description: "Exclusive VIP access to the iconic Majorelle Garden and Yves Saint Laurent Museum. Skip the lines with priority entry, enjoy a private guided tour of the stunning blue garden, and explore the fashion museum dedicated to YSL. Includes access to the Berber Museum and the YSL memorial. Perfect for design and fashion enthusiasts.",
    price: 45.00,
    category: "Iconic Attractions & Tickets",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
    ],
    duration: "3 hours",
    location: "Gueliz, Marrakech",
    latitude: 31.6400,
    longitude: -7.9864,
    features: [
      "VIP skip-the-line access",
      "Private guided tour",
      "YSL Museum entry",
      "Majorelle Garden entry",
      "Berber Museum access"
    ],
    included: [
      "Priority entry tickets",
      "Professional guide",
      "All museum access",
      "Garden tour"
    ],
    whatToBring: [
      "Camera",
      "Comfortable walking shoes",
      "Sunscreen"
    ],
    tags: ["Garden", "Museum", "VIP", "Fashion", "Must-see", "Culture"],
    itinerary: [
      {
        time: "09:00",
        title: "Meeting Point",
        description: "Meet your guide at Majorelle Garden entrance"
      },
      {
        time: "09:15",
        title: "Majorelle Garden Tour",
        description: "Explore the iconic blue garden, cacti collection, and water features"
      },
      {
        time: "10:00",
        title: "YSL Museum",
        description: "Private tour of the fashion museum and YSL's legacy"
      },
      {
        time: "10:45",
        title: "Berber Museum",
        description: "Discover Berber culture and artifacts"
      },
      {
        time: "11:30",
        title: "Free Time",
        description: "Explore at your own pace, visit the café"
      }
    ],
    host: "Marrakech Cultural Tours",
    rating: 4.7,
    reviews: 203
  },
  {
    title: "Atlas Mountains & Ourika Valley Day Trip",
    description: "Escape the city and explore the stunning Ourika Valley in the High Atlas Mountains. Visit traditional Berber villages, hike to Setti Fatma waterfalls, enjoy a home-cooked lunch with a Berber family, and experience authentic mountain culture. Perfect for nature lovers and those seeking authentic cultural experiences.",
    price: 45.00,
    category: "Day Trips from Marrakech",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1464822759844-d150ad6bfd06?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
    ],
    duration: "8 hours",
    location: "Ourika Valley, Atlas Mountains",
    latitude: 31.2500,
    longitude: -7.6500,
    features: [
      "Berber village visit",
      "Waterfall hiking",
      "Traditional lunch",
      "Mountain views",
      "Cultural immersion"
    ],
    included: [
      "Round-trip transportation",
      "Professional guide",
      "Traditional Berber lunch",
      "Waterfall access",
      "Village tour"
    ],
    whatToBring: [
      "Hiking shoes",
      "Warm jacket",
      "Water bottle",
      "Camera"
    ],
    tags: ["Mountains", "Hiking", "Culture", "Nature", "Day Trip"],
    itinerary: [
      {
        time: "08:00",
        title: "Hotel Pickup",
        description: "Departure from Marrakech"
      },
      {
        time: "09:30",
        title: "Arrive in Ourika Valley",
        description: "First stop at a Berber village"
      },
      {
        time: "10:00",
        title: "Waterfall Hike",
        description: "Moderate hike to Setti Fatma waterfalls (7 cascades)"
      },
      {
        time: "13:00",
        title: "Berber Family Lunch",
        description: "Authentic home-cooked meal with a local family"
      },
      {
        time: "14:30",
        title: "Village Exploration",
        description: "Visit local markets, meet artisans"
      },
      {
        time: "16:00",
        title: "Return Journey",
        description: "Scenic drive back to Marrakech"
      }
    ],
    host: "Atlas Mountain Guides",
    rating: 4.6,
    reviews: 156
  },
  {
    title: "Hidden Gems of the Medina Walking Tour",
    description: "Discover Marrakech's hidden secrets with a local expert guide. Explore off-the-beaten-path alleys, visit artisan workshops, discover secret riads, and learn about the medina's history. This intimate small-group tour takes you beyond the tourist trail to experience authentic Marrakech.",
    price: 35.00,
    category: "Cultural & Historical Tours",
    images: [
      "https://images.unsplash.com/photo-1555993538-0c0b0c0c0c0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
    ],
    duration: "4 hours",
    location: "Medina, Marrakech",
    latitude: 31.6295,
    longitude: -7.9811,
    features: [
      "Local expert guide",
      "Small group (max 8)",
      "Hidden alleys & riads",
      "Artisan workshops",
      "Local insights"
    ],
    included: [
      "Professional guide",
      "Medina map",
      "Mint tea break",
      "Artisan visits"
    ],
    whatToBring: [
      "Comfortable walking shoes",
      "Water",
      "Camera",
      "Cash for souvenirs"
    ],
    tags: ["Walking", "Culture", "History", "Local", "Medina"],
    itinerary: [
      {
        time: "09:00",
        title: "Meeting Point",
        description: "Jemaa el-Fnaa square"
      },
      {
        time: "09:15",
        title: "Medina Exploration",
        description: "Navigate hidden alleys, discover secret passages"
      },
      {
        time: "10:30",
        title: "Artisan Workshops",
        description: "Visit traditional craftsmen (pottery, leather, metalwork)"
      },
      {
        time: "11:30",
        title: "Secret Riad Visit",
        description: "Explore a hidden traditional riad"
      },
      {
        time: "12:30",
        title: "Local Tea Break",
        description: "Mint tea in a local café"
      },
      {
        time: "13:00",
        title: "Tour Ends",
        description: "Back to Jemaa el-Fnaa"
      }
    ],
    host: "Marrakech Local Guides",
    rating: 4.8,
    reviews: 94
  },
  {
    title: "Master the Tagine Cooking Class",
    description: "Learn to cook authentic Moroccan tagine in a traditional riad. Visit a local market to select fresh ingredients, then master the art of tagine cooking with a professional chef. Includes preparing multiple dishes, learning spice blending, and enjoying your creations for lunch. Take home recipes and cooking tips.",
    price: 55.00,
    category: "Cooking Classes & Food Experiences",
    images: [
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop"
    ],
    duration: "5 hours",
    location: "Medina Riad, Marrakech",
    latitude: 31.6295,
    longitude: -7.9811,
    features: [
      "Market visit",
      "Hands-on cooking",
      "Professional chef",
      "Traditional riad setting",
      "Recipe cards"
    ],
    included: [
      "Market tour",
      "Cooking class",
      "All ingredients",
      "Lunch",
      "Recipe cards",
      "Mint tea"
    ],
    whatToBring: [
      "Appetite",
      "Comfortable clothes",
      "Camera"
    ],
    tags: ["Cooking", "Food", "Culture", "Hands-on", "Learning"],
    itinerary: [
      {
        time: "09:00",
        title: "Market Visit",
        description: "Explore local souk, select fresh ingredients"
      },
      {
        time: "10:00",
        title: "Arrive at Riad",
        description: "Welcome mint tea, introduction to Moroccan cuisine"
      },
      {
        time: "10:30",
        title: "Cooking Session",
        description: "Learn to prepare tagine, salads, and bread"
      },
      {
        time: "13:00",
        title: "Enjoy Your Meal",
        description: "Sit down to enjoy the dishes you prepared"
      },
      {
        time: "14:00",
        title: "Recipe Cards",
        description: "Receive printed recipes to take home"
      }
    ],
    host: "Chef Fatima's Cooking School",
    rating: 4.9,
    reviews: 178
  },
  {
    title: "Royal Moroccan Hammam & Spa Ritual",
    description: "Experience the ultimate Moroccan spa ritual with a traditional hammam steam bath, black soap scrub, and argan oil massage. This luxury spa experience takes place in a beautiful riad spa, combining ancient traditions with modern comfort. Perfect for relaxation after exploring the city.",
    price: 70.00,
    category: "Spa & Hammam Treatments",
    images: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop"
    ],
    duration: "2.5 hours",
    location: "Luxury Riad Spa, Marrakech",
    latitude: 31.6295,
    longitude: -7.9811,
    features: [
      "Traditional hammam",
      "Black soap scrub",
      "Argan oil massage",
      "Luxury riad setting",
      "Relaxation area"
    ],
    included: [
      "Hammam steam bath",
      "Full body scrub",
      "Argan oil massage (60 min)",
      "Mint tea",
      "Towel & amenities"
    ],
    whatToBring: [
      "Swimwear",
      "Change of clothes"
    ],
    tags: ["Spa", "Wellness", "Relaxation", "Traditional", "Luxury"],
    itinerary: [
      {
        time: "10:00",
        title: "Arrival",
        description: "Welcome drink, change into provided robe"
      },
      {
        time: "10:15",
        title: "Hammam Steam",
        description: "Relax in the steam room (15 minutes)"
      },
      {
        time: "10:30",
        title: "Black Soap Scrub",
        description: "Full body exfoliation with traditional kessa glove"
      },
      {
        time: "11:00",
        title: "Rinse & Rest",
        description: "Cool down, relax in the lounge"
      },
      {
        time: "11:30",
        title: "Argan Oil Massage",
        description: "60-minute full body massage with argan oil"
      },
      {
        time: "12:30",
        title: "Tea & Relaxation",
        description: "Mint tea in the relaxation area"
      }
    ],
    host: "Royal Hammam Spa",
    rating: 4.7,
    reviews: 142
  },
  {
    title: "Essaouira Coastal Escape Day Trip",
    description: "Discover the charming coastal town of Essaouira, a UNESCO World Heritage site. Explore the historic medina, walk along the fortified ramparts, visit the fishing port, and enjoy fresh seafood. This relaxed day trip offers a refreshing break from Marrakech's heat with ocean breezes and laid-back vibes.",
    price: 40.00,
    category: "Day Trips from Marrakech",
    images: [
      "https://images.unsplash.com/photo-1509316975859-7d2d70e8bc86?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&h=600&fit=crop"
    ],
    duration: "10 hours",
    location: "Essaouira, Morocco",
    latitude: 31.5085,
    longitude: -9.7595,
    features: [
      "UNESCO World Heritage site",
      "Historic medina",
      "Fishing port",
      "Seaside ramparts",
      "Fresh seafood"
    ],
    included: [
      "Round-trip transportation",
      "Professional guide",
      "Medina tour",
      "Free time for exploration"
    ],
    whatToBring: [
      "Comfortable walking shoes",
      "Jacket (windy coast)",
      "Camera",
      "Cash for lunch"
    ],
    tags: ["Coast", "UNESCO", "Relaxing", "Day Trip", "Seafood"],
    itinerary: [
      {
        time: "08:00",
        title: "Departure",
        description: "Pickup from Marrakech hotels"
      },
      {
        time: "10:30",
        title: "Arrive in Essaouira",
        description: "Welcome to the coastal town"
      },
      {
        time: "11:00",
        title: "Medina Tour",
        description: "Explore the historic medina and souks"
      },
      {
        time: "12:30",
        title: "Lunch",
        description: "Fresh seafood at the port (own expense)"
      },
      {
        time: "14:00",
        title: "Ramparts Walk",
        description: "Walk along the fortified walls, enjoy ocean views"
      },
      {
        time: "15:30",
        title: "Free Time",
        description: "Explore at your own pace, shopping, café"
      },
      {
        time: "17:00",
        title: "Return Journey",
        description: "Drive back to Marrakech"
      }
    ],
    host: "Coastal Tours Marrakech",
    rating: 4.5,
    reviews: 98
  },
  {
    title: "Quad Biking Adrenaline Rush in Palmeraie",
    description: "Get your adrenaline pumping with an exciting quad biking adventure through the Palmeraie palm grove and desert landscapes. Suitable for beginners and experienced riders, this tour takes you through Berber villages, desert trails, and offers stunning views. Includes safety equipment and refreshments.",
    price: 40.00,
    category: "Desert & Adventure Activities",
    images: [
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1509316975859-7d2d70e8bc86?w=800&h=600&fit=crop"
    ],
    duration: "3 hours",
    location: "Palmeraie, Marrakech",
    latitude: 31.7000,
    longitude: -7.9500,
    features: [
      "Quad bike rental",
      "Desert trails",
      "Berber village visit",
      "Safety equipment",
      "Professional guide"
    ],
    included: [
      "Quad bike (2 hours)",
      "Helmet & safety gear",
      "Professional guide",
      "Mint tea break",
      "Hotel pickup & drop-off"
    ],
    whatToBring: [
      "Closed-toe shoes",
      "Sunglasses",
      "Scarf (for dust)",
      "Camera (with strap)"
    ],
    tags: ["Adventure", "Quad", "Desert", "Adrenaline", "Fun"],
    itinerary: [
      {
        time: "09:00",
        title: "Hotel Pickup",
        description: "Transport to quad biking base"
      },
      {
        time: "09:30",
        title: "Safety Briefing",
        description: "Equipment fitting, safety instructions, practice"
      },
      {
        time: "10:00",
        title: "Quad Adventure",
        description: "2-hour ride through palm grove and desert"
      },
      {
        time: "11:30",
        title: "Berber Village Stop",
        description: "Visit traditional village, mint tea"
      },
      {
        time: "12:00",
        title: "Return to Base",
        description: "Back to Marrakech"
      }
    ],
    host: "Desert Quad Adventures",
    rating: 4.6,
    reviews: 134
  },
  {
    title: "Ultimate Street Food Tasting Trail",
    description: "Embark on a culinary adventure through Marrakech's food scene with a local food expert. Taste authentic street food, visit hidden food stalls, learn about Moroccan cuisine, and discover flavors you won't find in restaurants. This evening tour takes you through Jemaa el-Fnaa and the medina's best-kept food secrets.",
    price: 45.00,
    category: "Cooking Classes & Food Experiences",
    images: [
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop"
    ],
    duration: "3.5 hours",
    location: "Jemaa el-Fnaa & Medina, Marrakech",
    latitude: 31.6258,
    longitude: -7.9891,
    features: [
      "Local food expert guide",
      "10+ food tastings",
      "Hidden food stalls",
      "Evening tour",
      "Cultural insights"
    ],
    included: [
      "Professional food guide",
      "All food tastings",
      "Drinks (water, tea, juice)",
      "Food safety tips",
      "Cultural stories"
    ],
    whatToBring: [
      "Appetite",
      "Comfortable shoes",
      "Camera",
      "Cash for extra purchases"
    ],
    tags: ["Food", "Street Food", "Evening", "Culture", "Local"],
    itinerary: [
      {
        time: "18:00",
        title: "Meeting Point",
        description: "Jemaa el-Fnaa square"
      },
      {
        time: "18:15",
        title: "Square Food Stalls",
        description: "Taste traditional snacks, fresh juices"
      },
      {
        time: "19:00",
        title: "Medina Food Tour",
        description: "Explore hidden food stalls, local favorites"
      },
      {
        time: "20:00",
        title: "Dinner Stop",
        description: "Traditional tagine or couscous"
      },
      {
        time: "21:00",
        title: "Dessert & Tea",
        description: "Moroccan pastries and mint tea"
      },
      {
        time: "21:30",
        title: "Tour Ends",
        description: "Back to Jemaa el-Fnaa"
      }
    ],
    host: "Marrakech Food Adventures",
    rating: 4.8,
    reviews: 167
  }
]

async function main() {
  console.log('🌱 Starting database seed...')

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@marrakech.com' },
    update: {
      role: 'ADMIN',
      password: adminPassword,
      name: 'Admin User'
    },
    create: {
      email: 'admin@marrakech.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      phone: '+212 600 000 000'
    }
  })
  console.log('✅ Created Admin user:', admin.email)

  // Create Provider User
  const providerPassword = await bcrypt.hash('provider123', 10)
  const provider = await prisma.user.upsert({
    where: { email: 'provider@marrakech.com' },
    update: {
      role: 'PROVIDER',
      password: providerPassword,
      name: 'Tour Provider'
    },
    create: {
      email: 'provider@marrakech.com',
      password: providerPassword,
      name: 'Tour Provider',
      role: 'PROVIDER',
      phone: '+212 600 000 001'
    }
  })
  console.log('✅ Created Provider user:', provider.email)

  // Create Customer Users
  const customer1Password = await bcrypt.hash('customer123', 10)
  const customer1 = await prisma.user.upsert({
    where: { email: 'customer1@example.com' },
    update: {
      role: 'CLIENT',
      password: customer1Password
    },
    create: {
      email: 'customer1@example.com',
      password: customer1Password,
      name: 'John Doe',
      role: 'CLIENT',
      phone: '+212 600 000 002'
    }
  })
  console.log('✅ Created Customer 1:', customer1.email)

  const customer2Password = await bcrypt.hash('customer123', 10)
  const customer2 = await prisma.user.upsert({
    where: { email: 'customer2@example.com' },
    update: {
      role: 'CLIENT',
      password: customer2Password
    },
    create: {
      email: 'customer2@example.com',
      password: customer2Password,
      name: 'Jane Smith',
      role: 'CLIENT',
      phone: '+212 600 000 003'
    }
  })
  console.log('✅ Created Customer 2:', customer2.email)

  // Clean existing services
  await prisma.service.deleteMany({})
  console.log('🧹 Cleaned existing services')

  // Create Activities with Short IDs
  const { generateShortId, ShortIdPrefix } = await import('../src/lib/id-generator')

  for (const activity of marrakechActivities) {
    const service = await prisma.service.create({
      data: {
        shortId: generateShortId(ShortIdPrefix.SERVICE),
        title: activity.title,
        description: activity.description,
        price: activity.price,
        category: activity.category,
        images: activity.images,
        duration: activity.duration,
        location: activity.location,
        latitude: activity.latitude,
        longitude: activity.longitude,
        features: activity.features,
        included: activity.included,
        whatToBring: activity.whatToBring,
        tags: activity.tags,
        itinerary: activity.itinerary as any, // Prisma Json type
        host: activity.host,
        rating: activity.rating,
        reviews: activity.reviews
      }
    })
    console.log(`✅ Created activity: ${service.title} (${service.shortId})`)
  }

  console.log(`\n🎉 Seed completed successfully!`)
  console.log(`📊 Created:`)
  console.log(`   - 1 Admin user`)
  console.log(`   - 1 Provider user`)
  console.log(`   - 2 Customer users`)
  console.log(`   - ${marrakechActivities.length} Activities`)
  console.log(`\n🔑 Test Credentials:`)
  console.log(`   Admin: admin@marrakech.com / admin123`)
  console.log(`   Provider: provider@marrakech.com / provider123`)
  console.log(`   Customer: customer1@example.com / customer123`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
