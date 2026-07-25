-- Run this in the Neon SQL Editor to add the 8 new experiences.
-- Safe to re-run: uses ON CONFLICT ("slug") to upsert.

BEGIN;

INSERT INTO "Experience" (id, title, slug, category, location, duration, price, currency, "shortDescription", "fullDescription", highlights, included, "notIncluded", "meetingPoint", "pickupAvailable", gallery, faqs, enabled, featured, popularity, "createdAt", "updatedAt", "imageConcepts", "importantInfo", itinerary, "relatedExperiences", "avgRating", "reviewCount")
VALUES (gen_random_uuid()::text, $$Gnawa Live Music & Rooftop Sessions$$, $$gnawa-live-music-rooftop-sessions$$, $$Entertainment$$, $$Marrakech Medina$$, $$2 hours$$, 28, $$EUR$$, $$An intimate evening of Gnawa trance music performed live on a candlelit rooftop, followed by mint tea and open conversation with the musicians.$$, $$Gnawa music is one of Morocco's most powerful cultural exports — a hypnotic blend of West African rhythm, Sufi devotion, and centuries of shared history. This evening session brings a small ensemble of Gnawa musicians to an intimate rooftop setting away from the crowds of Jemaa el-Fnaa, where you can experience the deep bass tones of the guembri and the metallic clang of the qraqeb up close. The set moves through both traditional trance pieces and more contemporary arrangements, with musicians happy to explain the spiritual roots of each song. The evening winds down with mint tea, Moroccan pastries, and an open Q&A about the Gnawa brotherhood tradition. Limited to small groups to keep the atmosphere personal and acoustic.$$, ARRAY[$$Live performance by a professional Gnawa ensemble$$, $$Intimate rooftop setting, no big crowds$$, $$Learn the spiritual history behind the music$$, $$Mint tea and pastries included$$, $$Small group of max 20 guests$$]::text[], ARRAY[$$Live music performance$$, $$Mint tea and Moroccan pastries$$, $$Seating and cushions$$]::text[], ARRAY[$$Hotel pickup$$, $$Alcoholic beverages$$, $$Gratuities$$]::text[], $$Rooftop venue near Jemaa el-Fnaa, exact address sent after booking$$, false, ARRAY[$$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$, $$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$, $$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$]::text[], $$[{"q":"Is this a religious ceremony?","a":"No, this is a music performance inspired by Gnawa tradition, presented respectfully for a general audience."},{"q":"Can I take photos or video?","a":"Yes, photography is welcome, but please ask before using flash during the performance."}]$$::jsonb, true, false, 0, now(), now(), $$["Musicians playing guembri under string lights","Close up of qraqeb metal castanets","Rooftop crowd silhouette against Medina skyline"]$$::jsonb, $$["Sessions run rain or shine, indoor backup space available.","Recommended for ages 8 and up.","Seating is floor-level cushions; chairs available on request."]$$::jsonb, $$[{"title":"Welcome & Seating","description":"Arrive at the rooftop venue and settle in with cushions and low seating around the performance area."},{"title":"Live Performance","description":"The ensemble performs a 60-75 minute set moving from traditional trance rhythms to more melodic arrangements."},{"title":"Tea & Conversation","description":"Mint tea and pastries are served while musicians share stories about the Gnawa tradition and answer questions."}]$$::jsonb, $$["Evening Jemaa El Fna: Mythic Square & Souk Tasting","Fantasia Dinner Show - 1001 Nights"]$$::jsonb, 0, 0)
ON CONFLICT ("slug") DO UPDATE SET
title = EXCLUDED.title,
  category = EXCLUDED.category,
  location = EXCLUDED.location,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  "shortDescription" = EXCLUDED."shortDescription",
  "fullDescription" = EXCLUDED."fullDescription",
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  "notIncluded" = EXCLUDED."notIncluded",
  "meetingPoint" = EXCLUDED."meetingPoint",
  "pickupAvailable" = EXCLUDED."pickupAvailable",
  gallery = EXCLUDED.gallery,
  faqs = EXCLUDED.faqs,
  enabled = EXCLUDED.enabled,
  featured = EXCLUDED.featured,
  popularity = EXCLUDED.popularity,
  "updatedAt" = EXCLUDED."updatedAt",
  "imageConcepts" = EXCLUDED."imageConcepts",
  "importantInfo" = EXCLUDED."importantInfo",
  itinerary = EXCLUDED.itinerary,
  "relatedExperiences" = EXCLUDED."relatedExperiences",
  "avgRating" = EXCLUDED."avgRating",
  "reviewCount" = EXCLUDED."reviewCount"
;

INSERT INTO "Experience" (id, title, slug, category, location, duration, price, currency, "shortDescription", "fullDescription", highlights, included, "notIncluded", "meetingPoint", "pickupAvailable", gallery, faqs, enabled, featured, popularity, "createdAt", "updatedAt", "imageConcepts", "importantInfo", itinerary, "relatedExperiences", "avgRating", "reviewCount")
VALUES (gen_random_uuid()::text, $$Escape Room & Arcade Night in Gueliz$$, $$escape-room-arcade-night-in-gueliz$$, $$Entertainment$$, $$Gueliz, Marrakech$$, $$2.5 hours$$, 22, $$EUR$$, $$A fun night out solving themed escape room puzzles followed by retro arcade games and VR pods in Marrakech's modern new town.$$, $$Looking for something different from tagines and camel rides? This is a lighthearted evening of team-based entertainment in Gueliz, Marrakech's modern district. Start with a 60-minute themed escape room — choose from a Moroccan-mystery or sci-fi storyline — where your group races against the clock to crack codes and find the way out. Afterwards, unwind in the adjoining arcade and VR lounge with classic cabinet games, racing simulators, and virtual reality pods. It's a great way to spend an air-conditioned evening with friends, family, or as a fun date activity, and a nice contrast to the more traditional Marrakech experiences.$$, ARRAY[$$60-minute themed escape room for your group$$, $$Unlimited arcade credits for one hour after$$, $$VR pod session included$$, $$Great rainy-day or evening activity$$, $$Fun for families, couples, and groups of friends$$]::text[], ARRAY[$$Escape room session$$, $$1 hour unlimited arcade credits$$, $$VR pod session$$, $$Game master guidance$$]::text[], ARRAY[$$Hotel pickup$$, $$Food and drinks$$, $$Gratuities$$]::text[], $$Gaming lounge, Avenue Mohammed V, Gueliz$$, false, ARRAY[$$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$, $$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$, $$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$]::text[], $$[{"q":"Is the escape room in English?","a":"Yes, rooms are available in English, French, and Arabic."},{"q":"Can we book a private group?","a":"Yes, the room can be booked exclusively for your group at no extra cost."}]$$::jsonb, true, false, 0, now(), now(), $$["Group solving a puzzle wall in themed room","Neon-lit arcade cabinets","Guest wearing VR headset mid-game"]$$::jsonb, $$["Groups of 2-6 recommended per escape room.","Not recommended for guests prone to motion sickness for the VR portion.","Minimum age 10 for escape room, 12 for VR pods."]$$::jsonb, $$[{"title":"Check-in & Briefing","description":"Meet your game master, choose your escape room theme, and get the rules briefing."},{"title":"Escape Room Challenge","description":"60 minutes to solve puzzles and escape the room as a team."},{"title":"Arcade & VR Time","description":"Free play on arcade cabinets and a guided VR pod session."}]$$::jsonb, $$["Marrakech Photography Tour: Light & Shadow","Fantasia Dinner Show - 1001 Nights"]$$::jsonb, 0, 0)
ON CONFLICT ("slug") DO UPDATE SET
title = EXCLUDED.title,
  category = EXCLUDED.category,
  location = EXCLUDED.location,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  "shortDescription" = EXCLUDED."shortDescription",
  "fullDescription" = EXCLUDED."fullDescription",
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  "notIncluded" = EXCLUDED."notIncluded",
  "meetingPoint" = EXCLUDED."meetingPoint",
  "pickupAvailable" = EXCLUDED."pickupAvailable",
  gallery = EXCLUDED.gallery,
  faqs = EXCLUDED.faqs,
  enabled = EXCLUDED.enabled,
  featured = EXCLUDED.featured,
  popularity = EXCLUDED.popularity,
  "updatedAt" = EXCLUDED."updatedAt",
  "imageConcepts" = EXCLUDED."imageConcepts",
  "importantInfo" = EXCLUDED."importantInfo",
  itinerary = EXCLUDED.itinerary,
  "relatedExperiences" = EXCLUDED."relatedExperiences",
  "avgRating" = EXCLUDED."avgRating",
  "reviewCount" = EXCLUDED."reviewCount"
;

INSERT INTO "Experience" (id, title, slug, category, location, duration, price, currency, "shortDescription", "fullDescription", highlights, included, "notIncluded", "meetingPoint", "pickupAvailable", gallery, faqs, enabled, featured, popularity, "createdAt", "updatedAt", "imageConcepts", "importantInfo", itinerary, "relatedExperiences", "avgRating", "reviewCount")
VALUES (gen_random_uuid()::text, $$Padel & Tennis Session with a Pro Coach$$, $$padel-tennis-session-with-a-pro-coach$$, $$Sports & Adventure$$, $$Hivernage, Marrakech$$, $$1.5 hours$$, 40, $$EUR$$, $$Book a private or semi-private padel or tennis session with a certified coach at a modern club, equipment included.$$, $$Stay active on your trip with a private padel or tennis session at a modern sports club in Hivernage. Whether you're a complete beginner wanting to learn the basics of padel — one of the fastest-growing sports in Morocco — or an experienced tennis player wanting a hit on a well-maintained court, our certified coaches tailor the session to your level. Rackets, balls, and court time are all included, and sessions can be booked solo, as a couple, or in small groups. It's a great way to break up a busy sightseeing itinerary with some fresh air and movement.$$, ARRAY[$$Certified coach tailors session to your level$$, $$Padel or tennis, your choice$$, $$All equipment included$$, $$Modern courts in a shaded club setting$$, $$Solo, couple, or small group bookings$$]::text[], ARRAY[$$Court rental$$, $$Certified coach$$, $$Rackets and balls$$, $$Bottled water$$]::text[], ARRAY[$$Hotel pickup$$, $$Sports attire$$, $$Gratuities$$]::text[], $$Sports club reception, Hivernage$$, true, ARRAY[$$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$, $$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$, $$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$]::text[], $$[{"q":"I've never played padel, is that okay?","a":"Absolutely, most guests are beginners and the coach starts from the basics."},{"q":"Can two people share one session?","a":"Yes, semi-private sessions for 2 people are available at the same price per person."}]$$::jsonb, true, false, 0, now(), now(), $$["Coach demonstrating padel serve","Players mid-rally on outdoor court","Close up of racket and ball"]$$::jsonb, $$["Wear athletic shoes with non-marking soles.","Sessions available morning or late afternoon to avoid peak heat.","Court availability subject to confirmation at booking."]$$::jsonb, $$[{"title":"Warm-up","description":"Coach leads a short warm-up and assesses your level."},{"title":"Coached Play","description":"Technique drills followed by live points, adjusted to your ability."},{"title":"Cool Down & Tips","description":"Short cool-down with personalized tips to keep improving."}]$$::jsonb, $$["Golfing at the Foot of the Atlas","Wakeboarding at Waky Marrakech"]$$::jsonb, 0, 0)
ON CONFLICT ("slug") DO UPDATE SET
title = EXCLUDED.title,
  category = EXCLUDED.category,
  location = EXCLUDED.location,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  "shortDescription" = EXCLUDED."shortDescription",
  "fullDescription" = EXCLUDED."fullDescription",
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  "notIncluded" = EXCLUDED."notIncluded",
  "meetingPoint" = EXCLUDED."meetingPoint",
  "pickupAvailable" = EXCLUDED."pickupAvailable",
  gallery = EXCLUDED.gallery,
  faqs = EXCLUDED.faqs,
  enabled = EXCLUDED.enabled,
  featured = EXCLUDED.featured,
  popularity = EXCLUDED.popularity,
  "updatedAt" = EXCLUDED."updatedAt",
  "imageConcepts" = EXCLUDED."imageConcepts",
  "importantInfo" = EXCLUDED."importantInfo",
  itinerary = EXCLUDED.itinerary,
  "relatedExperiences" = EXCLUDED."relatedExperiences",
  "avgRating" = EXCLUDED."avgRating",
  "reviewCount" = EXCLUDED."reviewCount"
;

INSERT INTO "Experience" (id, title, slug, category, location, duration, price, currency, "shortDescription", "fullDescription", highlights, included, "notIncluded", "meetingPoint", "pickupAvailable", gallery, faqs, enabled, featured, popularity, "createdAt", "updatedAt", "imageConcepts", "importantInfo", itinerary, "relatedExperiences", "avgRating", "reviewCount")
VALUES (gen_random_uuid()::text, $$Mountain Biking in the Palm Grove$$, $$mountain-biking-in-the-palm-grove$$, $$Sports & Adventure$$, $$Palmeraie, Marrakech$$, $$3 hours$$, 45, $$EUR$$, $$Ride quality mountain bikes through the dirt trails of the historic Palmeraie palm grove with a local guide, away from city traffic.$$, $$Trade the souk crowds for open trails on this guided mountain biking ride through the Palmeraie, Marrakech's centuries-old palm oasis on the edge of the city. Well-maintained trail bikes and helmets are provided, and your guide leads a route through dirt tracks winding between date palms, past traditional Berber homes, and out toward quieter desert-fringe terrain with Atlas Mountain views on clear days. The pace is adjusted to the group, with options for a relaxed cruise or a more energetic ride for confident cyclists. A water and fruit break is included midway.$$, ARRAY[$$Guided ride through the historic Palmeraie oasis$$, $$Quality mountain bikes and helmets provided$$, $$Atlas Mountain views on clear days$$, $$Suitable for intermediate riders$$, $$Fruit and water break included$$]::text[], ARRAY[$$Mountain bike rental$$, $$Helmet$$, $$Local guide$$, $$Water and fruit break$$]::text[], ARRAY[$$Hotel pickup$$, $$Travel insurance$$, $$Gratuities$$]::text[], $$Bike center, Route de Fes, Palmeraie$$, true, ARRAY[$$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$, $$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$, $$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$]::text[], $$[{"q":"Is this suitable for kids?","a":"Recommended for ages 12 and up who are comfortable riding a bike."},{"q":"What if it rains?","a":"Trails can be muddy after rain; we'll reschedule or offer an alternative route."}]$$::jsonb, true, false, 0, now(), now(), $$["Cyclist riding dirt trail between palm trees","Group pausing for water break","Bike wheel close-up on sandy trail"]$$::jsonb, $$["Moderate fitness level required, some uneven terrain.","Not recommended for complete beginners to cycling.","Wear closed-toe shoes and bring sunscreen."]$$::jsonb, $$[{"title":"Bike Fitting & Safety Briefing","description":"Get fitted for your bike and helmet, quick safety and route briefing."},{"title":"Palmeraie Trail Ride","description":"Ride through palm groves and dirt trails with photo stops along the way."},{"title":"Refreshment Break","description":"Rest stop with water and seasonal fruit before heading back."}]$$::jsonb, $$["Quad Biking Adrenaline in Agafay Desert","Horse Riding: Royal Equestrian Club & Forest"]$$::jsonb, 0, 0)
ON CONFLICT ("slug") DO UPDATE SET
title = EXCLUDED.title,
  category = EXCLUDED.category,
  location = EXCLUDED.location,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  "shortDescription" = EXCLUDED."shortDescription",
  "fullDescription" = EXCLUDED."fullDescription",
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  "notIncluded" = EXCLUDED."notIncluded",
  "meetingPoint" = EXCLUDED."meetingPoint",
  "pickupAvailable" = EXCLUDED."pickupAvailable",
  gallery = EXCLUDED.gallery,
  faqs = EXCLUDED.faqs,
  enabled = EXCLUDED.enabled,
  featured = EXCLUDED.featured,
  popularity = EXCLUDED.popularity,
  "updatedAt" = EXCLUDED."updatedAt",
  "imageConcepts" = EXCLUDED."imageConcepts",
  "importantInfo" = EXCLUDED."importantInfo",
  itinerary = EXCLUDED.itinerary,
  "relatedExperiences" = EXCLUDED."relatedExperiences",
  "avgRating" = EXCLUDED."avgRating",
  "reviewCount" = EXCLUDED."reviewCount"
;

INSERT INTO "Experience" (id, title, slug, category, location, duration, price, currency, "shortDescription", "fullDescription", highlights, included, "notIncluded", "meetingPoint", "pickupAvailable", gallery, faqs, enabled, featured, popularity, "createdAt", "updatedAt", "imageConcepts", "importantInfo", itinerary, "relatedExperiences", "avgRating", "reviewCount")
VALUES (gen_random_uuid()::text, $$Couples Retreat: Private Hammam for Two$$, $$couples-retreat-private-hammam-for-two$$, $$Wellness$$, $$Marrakech Medina$$, $$2 hours$$, 110, $$EUR$$, $$A private hammam suite for two, with synchronized black soap scrub, argan oil massage, and rose water refreshments in a candlelit setting.$$, $$Designed for couples, honeymooners, or friends wanting to relax together, this private hammam experience takes place in an exclusive suite away from shared bathing areas. Two therapists work in tandem, guiding you both through the traditional steam, black soap exfoliation, and ghassoul clay mask before finishing with a side-by-side argan oil massage. The candlelit suite is yours alone for the full session, and the ritual concludes with rose water refreshments and Moroccan sweets in a private relaxation nook. A thoughtful way to unwind together after a day of exploring the Medina.$$, ARRAY[$$Fully private hammam suite, not shared$$, $$Two therapists working simultaneously$$, $$Traditional black soap and ghassoul ritual$$, $$Side-by-side argan oil massage$$, $$Rose water and sweets to finish$$]::text[], ARRAY[$$Private hammam suite$$, $$Black soap scrub$$, $$Ghassoul clay mask$$, $$30-minute couples massage$$, $$Rose water and sweets$$]::text[], ARRAY[$$Hotel pickup$$, $$Gratuities$$]::text[], $$Riad spa, Medina, exact address sent after booking$$, false, ARRAY[$$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$, $$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$, $$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$]::text[], $$[{"q":"Is this only for romantic couples?","a":"No, the private suite is open to any pair — friends, family, or partners."},{"q":"Can we request a specific time?","a":"Yes, morning and evening slots are both available, subject to booking."}]$$::jsonb, true, false, 0, now(), now(), $$["Candlelit private hammam suite","Rose petals and towels arranged on stone bench","Tea and sweets on a low table"]$$::jsonb, $$["Book at least 24 hours in advance for suite availability.","Swimwear or disposable underwear provided.","Not recommended during pregnancy without prior notice to staff."]$$::jsonb, $$[{"title":"Steam & Exfoliation","description":"Relax in the private steam room before a full-body black soap exfoliation."},{"title":"Clay Mask","description":"Ghassoul clay mask applied and rinsed, leaving skin soft and refreshed."},{"title":"Massage & Refreshments","description":"Side-by-side argan oil massage followed by rose water and sweets."}]$$::jsonb, $$["The Authentic Ritual: Traditional Hammam & Spa","Luxury Spa Day & Signature Massage"]$$::jsonb, 0, 0)
ON CONFLICT ("slug") DO UPDATE SET
title = EXCLUDED.title,
  category = EXCLUDED.category,
  location = EXCLUDED.location,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  "shortDescription" = EXCLUDED."shortDescription",
  "fullDescription" = EXCLUDED."fullDescription",
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  "notIncluded" = EXCLUDED."notIncluded",
  "meetingPoint" = EXCLUDED."meetingPoint",
  "pickupAvailable" = EXCLUDED."pickupAvailable",
  gallery = EXCLUDED.gallery,
  faqs = EXCLUDED.faqs,
  enabled = EXCLUDED.enabled,
  featured = EXCLUDED.featured,
  popularity = EXCLUDED.popularity,
  "updatedAt" = EXCLUDED."updatedAt",
  "imageConcepts" = EXCLUDED."imageConcepts",
  "importantInfo" = EXCLUDED."importantInfo",
  itinerary = EXCLUDED.itinerary,
  "relatedExperiences" = EXCLUDED."relatedExperiences",
  "avgRating" = EXCLUDED."avgRating",
  "reviewCount" = EXCLUDED."reviewCount"
;

INSERT INTO "Experience" (id, title, slug, category, location, duration, price, currency, "shortDescription", "fullDescription", highlights, included, "notIncluded", "meetingPoint", "pickupAvailable", gallery, faqs, enabled, featured, popularity, "createdAt", "updatedAt", "imageConcepts", "importantInfo", itinerary, "relatedExperiences", "avgRating", "reviewCount")
VALUES (gen_random_uuid()::text, $$Rooftop Mixology & Mocktail Workshop$$, $$rooftop-mixology-mocktail-workshop$$, $$Food & Drink$$, $$Marrakech Medina$$, $$2 hours$$, 38, $$EUR$$, $$Learn to craft Moroccan-inspired mocktails and cocktails on a rooftop with a local mixologist, using fresh mint, saffron, and citrus.$$, $$Marrakech's flavors go beyond tagines — this rooftop workshop explores the city's drink culture through a hands-on mixology class. Guided by a local bartender, you'll learn to build four signature drinks inspired by Moroccan ingredients: fresh mint and green tea, saffron and orange blossom, pomegranate and rose, and spiced date syrup. Both alcoholic and non-alcoholic versions of each recipe are taught, so the class works well for mixed groups. Set on a rooftop terrace with Medina views, the session ends with a tasting of everything you've made alongside light Moroccan snacks.$$, ARRAY[$$Hands-on class with a local mixologist$$, $$Four Moroccan-inspired drink recipes$$, $$Alcoholic and non-alcoholic options for every drink$$, $$Rooftop setting with Medina views$$, $$Recipe cards to take home$$]::text[], ARRAY[$$All ingredients and tools$$, $$Recipe cards$$, $$Light Moroccan snacks$$]::text[], ARRAY[$$Hotel pickup$$, $$Gratuities$$]::text[], $$Rooftop terrace near Jemaa el-Fnaa, exact address sent after booking$$, false, ARRAY[$$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$, $$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$, $$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$]::text[], $$[{"q":"Do I need bartending experience?","a":"No, the class is beginner-friendly and fully guided."},{"q":"Can we do a fully non-alcoholic version?","a":"Yes, just let us know when booking and every recipe will be made as a mocktail."}]$$::jsonb, true, false, 0, now(), now(), $$["Bartender shaking a cocktail on rooftop","Colorful drinks lined up with garnishes","Guests toasting at sunset"]$$::jsonb, $$["Non-alcoholic version available for all recipes on request.","Valid ID required if choosing alcoholic recipes.","Maximum group size of 12 for a hands-on experience."]$$::jsonb, $$[{"title":"Ingredient Introduction","description":"Meet your mixologist and learn about the Moroccan ingredients you'll be using."},{"title":"Hands-On Mixing","description":"Build four signature drinks step by step with guidance and tips."},{"title":"Tasting","description":"Sit back and enjoy your creations with light snacks on the rooftop."}]$$::jsonb, $$["The Art of Tea: Ceremony & Pastry Workshop","Market to Table: Traditional Cooking Class in a Riad"]$$::jsonb, 0, 0)
ON CONFLICT ("slug") DO UPDATE SET
title = EXCLUDED.title,
  category = EXCLUDED.category,
  location = EXCLUDED.location,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  "shortDescription" = EXCLUDED."shortDescription",
  "fullDescription" = EXCLUDED."fullDescription",
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  "notIncluded" = EXCLUDED."notIncluded",
  "meetingPoint" = EXCLUDED."meetingPoint",
  "pickupAvailable" = EXCLUDED."pickupAvailable",
  gallery = EXCLUDED.gallery,
  faqs = EXCLUDED.faqs,
  enabled = EXCLUDED.enabled,
  featured = EXCLUDED.featured,
  popularity = EXCLUDED.popularity,
  "updatedAt" = EXCLUDED."updatedAt",
  "imageConcepts" = EXCLUDED."imageConcepts",
  "importantInfo" = EXCLUDED."importantInfo",
  itinerary = EXCLUDED.itinerary,
  "relatedExperiences" = EXCLUDED."relatedExperiences",
  "avgRating" = EXCLUDED."avgRating",
  "reviewCount" = EXCLUDED."reviewCount"
;

INSERT INTO "Experience" (id, title, slug, category, location, duration, price, currency, "shortDescription", "fullDescription", highlights, included, "notIncluded", "meetingPoint", "pickupAvailable", gallery, faqs, enabled, featured, popularity, "createdAt", "updatedAt", "imageConcepts", "importantInfo", itinerary, "relatedExperiences", "avgRating", "reviewCount")
VALUES (gen_random_uuid()::text, $$Leatherworking Workshop in the Tanneries Quarter$$, $$leatherworking-workshop-in-the-tanneries-quarter$$, $$Workshops & Culture$$, $$Marrakech Medina$$, $$2 hours$$, 42, $$EUR$$, $$Learn traditional leather tooling and stitching from a master craftsman near the historic tanneries, and take home a piece you made yourself.$$, $$Marrakech's tanneries have shaped leather using centuries-old techniques since medieval times. In this hands-on workshop, a master leather craftsman welcomes you into his small workshop near the tanneries quarter to teach the fundamentals of hand-tooling, dyeing, and stitching leather. You'll design and stamp a pattern into a small leather good — choose from a wallet, pouch, or keychain — and hand-stitch it together using traditional saddle-stitch technique. Along the way, your host explains the tanning process and the history of the guild system that still governs leatherwork in the Medina today. You leave with your own handmade souvenir and a genuine understanding of the craft.$$, ARRAY[$$Taught by a working master craftsman$$, $$Hand-tool your own leather design$$, $$Learn traditional saddle-stitching$$, $$Take home your finished piece$$, $$Small group, hands-on setting$$]::text[], ARRAY[$$All leather and tools$$, $$Instruction from a master craftsman$$, $$Your finished leather piece$$]::text[], ARRAY[$$Hotel pickup$$, $$Gratuities$$]::text[], $$Leather workshop, near the Tanneries Quarter, Medina$$, false, ARRAY[$$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$, $$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$, $$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$]::text[], $$[{"q":"Will we visit the actual tanneries?","a":"The workshop is located near the tanneries; a short optional viewing can be arranged before or after."},{"q":"What can I make?","a":"Choose between a simple wallet, small pouch, or keychain depending on your session length."}]$$::jsonb, true, false, 0, now(), now(), $$["Craftsman stamping pattern into leather","Rows of dyed leather hides drying","Finished handmade leather pouch"]$$::jsonb, $$["The tanneries area can have a strong smell; this is normal and part of the traditional process.","Comfortable, closed-toe shoes recommended for the walk in.","Suitable for ages 10 and up."]$$::jsonb, $$[{"title":"Craft Introduction","description":"Meet your craftsman and learn about the tanning and leatherworking tradition."},{"title":"Design & Tooling","description":"Stamp your chosen pattern into the leather using traditional tools."},{"title":"Stitching & Finishing","description":"Hand-stitch your piece together and add final touches."}]$$::jsonb, $$["Clay & Color: Pottery and Zellige Workshop","Scent of Morocco: Perfume Creation Workshop"]$$::jsonb, 0, 0)
ON CONFLICT ("slug") DO UPDATE SET
title = EXCLUDED.title,
  category = EXCLUDED.category,
  location = EXCLUDED.location,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  "shortDescription" = EXCLUDED."shortDescription",
  "fullDescription" = EXCLUDED."fullDescription",
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  "notIncluded" = EXCLUDED."notIncluded",
  "meetingPoint" = EXCLUDED."meetingPoint",
  "pickupAvailable" = EXCLUDED."pickupAvailable",
  gallery = EXCLUDED.gallery,
  faqs = EXCLUDED.faqs,
  enabled = EXCLUDED.enabled,
  featured = EXCLUDED.featured,
  popularity = EXCLUDED.popularity,
  "updatedAt" = EXCLUDED."updatedAt",
  "imageConcepts" = EXCLUDED."imageConcepts",
  "importantInfo" = EXCLUDED."importantInfo",
  itinerary = EXCLUDED.itinerary,
  "relatedExperiences" = EXCLUDED."relatedExperiences",
  "avgRating" = EXCLUDED."avgRating",
  "reviewCount" = EXCLUDED."reviewCount"
;

INSERT INTO "Experience" (id, title, slug, category, location, duration, price, currency, "shortDescription", "fullDescription", highlights, included, "notIncluded", "meetingPoint", "pickupAvailable", gallery, faqs, enabled, featured, popularity, "createdAt", "updatedAt", "imageConcepts", "importantInfo", itinerary, "relatedExperiences", "avgRating", "reviewCount")
VALUES (gen_random_uuid()::text, $$Street Art & Modern Gueliz Walking Tour$$, $$street-art-modern-gueliz-walking-tour$$, $$City Tours$$, $$Gueliz, Marrakech$$, $$2.5 hours$$, 25, $$EUR$$, $$Discover the contemporary side of Marrakech on a walking tour through Gueliz, spotting street art murals, design galleries, and modern architecture.$$, $$While most visitors focus on the Medina, Marrakech's new town of Gueliz tells a different story — one of modern art, design, and a rapidly evolving creative scene. This walking tour takes you through Gueliz's tree-lined boulevards to discover striking street art murals by Moroccan and international artists, independent design galleries, and Art Deco architecture from the French colonial era. Your guide, a local creative, shares insight into Marrakech's contemporary art movement and points out lesser-known concept stores and cafés along the way. It's the perfect complement to a Medina visit, showing a side of the city many travelers miss entirely.$$, ARRAY[$$See large-scale street art murals up close$$, $$Visit independent design and art galleries$$, $$Learn about Marrakech's contemporary creative scene$$, $$Spot Art Deco colonial-era architecture$$, $$Guided by a local creative professional$$]::text[], ARRAY[$$Local guide$$, $$Gallery entries where applicable$$, $$Walking route map$$]::text[], ARRAY[$$Hotel pickup$$, $$Food and drinks$$, $$Gratuities$$]::text[], $$Place du 16 Novembre, Gueliz$$, false, ARRAY[$$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$, $$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$, $$IMAGE_PLACEHOLDER_PENDING_UPLOAD$$]::text[], $$[{"q":"Is this tour suitable if I already did a Medina tour?","a":"Yes, it's designed as a complementary contrast to the historic Medina experience."},{"q":"Can we buy art directly from artists?","a":"Some galleries sell directly; your guide can facilitate introductions if you're interested."}]$$::jsonb, true, false, 0, now(), now(), $$["Large colorful street mural on a Gueliz wall","Guide pointing out gallery artwork","Art Deco building facade"]$$::jsonb, $$["Comfortable walking shoes recommended, tour covers about 3km.","Some galleries may be closed on Sundays.","Tour available in English and French."]$$::jsonb, $$[{"title":"Gueliz Introduction","description":"Meet your guide and get an overview of Gueliz's history and transformation into a creative hub."},{"title":"Murals & Galleries","description":"Walk through key streets to see street art and pop into independent galleries."},{"title":"Architecture & Cafés","description":"Spot Art Deco buildings and finish near a favorite local café for recommendations."}]$$::jsonb, $$["Marrakech Photography Tour: Light & Shadow","Architectural Masterpieces: Bahia Palace & Ben Youssef"]$$::jsonb, 0, 0)
ON CONFLICT ("slug") DO UPDATE SET
title = EXCLUDED.title,
  category = EXCLUDED.category,
  location = EXCLUDED.location,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  "shortDescription" = EXCLUDED."shortDescription",
  "fullDescription" = EXCLUDED."fullDescription",
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  "notIncluded" = EXCLUDED."notIncluded",
  "meetingPoint" = EXCLUDED."meetingPoint",
  "pickupAvailable" = EXCLUDED."pickupAvailable",
  gallery = EXCLUDED.gallery,
  faqs = EXCLUDED.faqs,
  enabled = EXCLUDED.enabled,
  featured = EXCLUDED.featured,
  popularity = EXCLUDED.popularity,
  "updatedAt" = EXCLUDED."updatedAt",
  "imageConcepts" = EXCLUDED."imageConcepts",
  "importantInfo" = EXCLUDED."importantInfo",
  itinerary = EXCLUDED.itinerary,
  "relatedExperiences" = EXCLUDED."relatedExperiences",
  "avgRating" = EXCLUDED."avgRating",
  "reviewCount" = EXCLUDED."reviewCount"
;

COMMIT;
