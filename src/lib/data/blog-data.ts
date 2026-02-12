
import type { BlogPost } from "@/lib/types";

export const BLOG_POSTS: BlogPost[] = [
    {
        id: "1",
        slug: "ultimate-guide-marrakech-medina",
        title: "The Ultimate Guide to Navigating the Marrakech Medina",
        excerpt: "Discover the hidden gems, survive the souks, and find the best spots in the heart of the Red City.",
        content: `
            <p>The Medina of Marrakech is a sensory overload in the best way possible. A UNESCO World Heritage site, it’s a labyrinth of narrow alleyways, bustling souks, and stunning architecture. If you're visiting for the first time, it can be overwhelming, but with a few tips, you'll be navigating it like a local.</p>
            
            <h3>Getting Lost is Part of the Fun</h3>
            <p>Don't be afraid to put away your map. The Medina is designed to be explored. You might stumble upon a quiet courtyard, a craftsman at work, or a stunning riad door. If you do get truly lost, aim for the Koutoubia Minaret, which is visible from many rooftops, or simply ask a shopkeeper for "Jemaa el-Fnaa".</p>

            <h3>Key Souks to Visit</h3>
            <ul>
                <li><strong>Souk Semmarine:</strong> The main artery, perfect for textiles and souvenirs.</li>
                <li><strong>Souk Place des Épices:</strong> The spice square, incredibly photogenic and fragrant.</li>
                <li><strong>Souk Haddadine:</strong> The blacksmith's quarter, full of sounds and sparks.</li>
            </ul>

            <h3>Dining in the Medina</h3>
            <p>Street food is safe and delicious if you stick to busy stalls. Try the <em>Msemen</em> (Moroccan pancakes) or a fresh orange juice in the main square. for a sit-down meal, look for rooftop restaurants to enjoy the sunset over the terracotta roofs.</p>

            <blockquote>"Marrakech is not just a place, it is a feeling."</blockquote>

            <p>Remember to dress modestly out of respect for the local culture, especially when exploring the traditional quarters. Enjoy the chaos, the colors, and the incredible energy of the Medina.</p>
        `,
        image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&q=80",
        category: "Travel Guide",
        author: "Sarah Jenkins",
        publishedAt: "2025-10-15",
        readTime: "5 min read",
        featured: true
    },
    {
        id: "2",
        slug: "best-rooftop-restaurants",
        title: "Top 5 Rooftop Restaurants for Sunset Views",
        excerpt: "Where to eat, drink, and watch the sun dip below the Atlas Mountains in style.",
        content: `
            <p>Marrakech comes alive at sunset. As the call to prayer echoes across the city, the sky turns shades of pink and orange. There is no better place to witness this magic than from a rooftop terrace.</p>

            <h3>1. Cafe des Épices</h3>
            <p>Located in the heart of the spice square, this is a classic. Great for a light lunch or a mint tea while watching the bustle below.</p>

            <h3>2. Nomad</h3>
            <p>Just across larger square, Nomad offers modern Moroccan cuisine. The rooftop is chic, and the food is a fresh take on traditional tagines.</p>

            <h3>3. El Fenn</h3>
            <p>For a touch of luxury, head to El Fenn. Their rooftop bar is lush with plants, has a pool, and offers some of the best cocktails in the city alongside Koutoubia views.</p>

            <h3>4. Kabana</h3>
            <p>A tropical oasis in the Medina. It has a vibrant atmosphere, live music often, and a great international menu if you need a break from couscous.</p>

            <h3>5. Le Jardin</h3>
            <p>While known for its courtyard, its upper terraces offer a green sanctuary. Perfect for a romantic dinner under the stars.</p>

            <p><strong>Tip:</strong> Always book your table in advance, especially for the golden hour!</p>
        `,
        image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80",
        category: "Food & Drink",
        author: "Karim Alami",
        publishedAt: "2025-11-02",
        readTime: "4 min read"
    },
    {
        id: "3",
        slug: "marrakech-safety-tips",
        title: "Is Marrakech Safe? Essential Safety Tips for Tourists",
        excerpt: "Everything you need to know to stay safe, avoid scams, and enjoy your trip worry-free.",
        content: `
            <p>Marrakech is generally a very safe destination for tourists, but like any major tourist hub, it has its annoyances. Most "danger" here is actually just aggressive sales tactics or minor scams.</p>

            <h3>Common Scams to Avoid</h3>
            <ul>
                <li><strong>The "Road is Closed" Guy:</strong> Friendly locals telling you a street is closed (it's not) to guide you to their shop or tannery. Politely ignore and keep walking/checking your GPS.</li>
                <li><strong>Unwanted Henna:</strong> Women in the square might grab your hand to start a henna tattoo without asking, then demand payment. Keep your hands in your pockets if you're not interested.</li>
                <li><strong>Photo Money:</strong> Snake charmers and monkeys in Jemaa el-Fnaa will demand money if you take a photo, even from a distance.</li>
            </ul>

            <h3>Solo Female Travel</h3>
            <p>Marrakech is safe for women, but attention is common. Dress modestly (covering shoulders and knees) to reduce unwanted stares. A firm "No, thank you" is your best tool.</p>

            <h3>Night Safety</h3>
            <p>The main streets of the Medina are safe at night, but the quiet residential alleyways can be dark and confusing. Stick to the well-lit thoroughfares or take a taxi to your door.</p>

            <p>Stay alert, be polite but firm, and you will have a wonderful and safe trip!</p>
        `,
        image: "https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&q=80",
        category: "Travel Tips",
        author: "Emma Wilson",
        publishedAt: "2025-09-20",
        readTime: "6 min read"
    },
    {
        id: "4",
        slug: "day-trip-atlas-mountains",
        title: "Escape the City: A Day Trip to the Atlas Mountains",
        excerpt: "Trade the chaos of the city for the fresh air and stunning vistas of the high Atlas.",
        content: `
            <p>Just an hour's drive from Marrakech lies a completely different world. The Atlas Mountains offer snow-capped peaks, lush valleys, and traditional Berber villages.</p>

            <h3>Ourika Valley</h3>
            <p>The most accessible valley. You can hike to the seven waterfalls of Setti Fatma. It’s popular with locals, especially on weekends, offering a lively riverside atmosphere with restaurants in the water.</p>

            <h3>Imlil</h3>
            <p>The starting point for climbing Mount Toubkal. Even if you aren't summiting, the walks around Imlil offer breathtaking views of walnut groves and mountain peaks.</p>

            <h3>Agafay Desert</h3>
            <p>Not the mountains, but a stone desert nearby with mountain views. Perfect for a luxury lunch in a tent or a quad bike adventure if you don't have time for the Sahara.</p>

            <h3>What to bring</h3>
            <ul>
                <li>Comfortable walking shoes (essential!)</li>
                <li>A warm layer (it gets cooler at altitude)</li>
                <li>Sunscreen and water</li>
            </ul>
        `,
        image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80",
        category: "Excursions",
        author: "Youssef Benali",
        publishedAt: "2025-10-28",
        readTime: "5 min read",
        featured: true
    },
    {
        id: "5",
        slug: "budget-marrakech",
        title: "Marrakech on a Budget: Luxury for Less",
        excerpt: "How to experience the royal treatment without the royal price tag.",
        content: `
            <p>Marrakech is famous for its luxury hotels, but it is also one of the best value destinations in the world. You can live like a king for a fraction of the cost of Europe.</p>

            <h3>Accommodation</h3>
            <p>Skip the big hotels and book a Riad. You can find stunning, authentic Riads with breakfast included for under €50 a night. They are quieter and more atmospheric.</p>

            <h3>Food</h3>
            <p>Eat where the locals eat. A sandwich with fresh bread, olives, and meat is often €2-3. Tagines in local cafes away from the main square are around €4-5.</p>

            <h3>Sightseeing</h3>
            <p>Many of the best sights are cheap. The Bahia Palace and Saadian Tombs have modest entry fees. Walking around the Medina and soaking in the atmosphere is completely free!</p>

            <h3>Transport</h3>
            <p>Taxis are cheap if you use the meter ("compteur"). If they refuse, agree on a price before getting in (usually 20-30 dirhams for a short city trip). Buses are even cheaper but can be crowded.</p>
        `,
        image: "https://images.unsplash.com/photo-1549141013-0941da74d49a?auto=format&fit=crop&q=80",
        category: "Budget Travel",
        author: "Sarah Jenkins",
        publishedAt: "2025-11-10",
        readTime: "4 min read"
    }
];
