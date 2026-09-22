"""Seed the database with ALL content currently hardcoded in the frontend.

Sources (read-only, in priority order — first existing path wins):
  1. ``--source`` CLI argument
  2. ``SEED_SOURCE_DIR`` env var
  3. ``<repo-root>/public`` (the checked-out frontend's JSON files)
  4. bundled inline defaults (same data as the old frontend fallbacks)

Idempotent: matching items (by slug / legacy_id / name) are updated, not
duplicated. Safe to run multiple times, including against an empty DB.
"""

import json
from datetime import date
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from artists.models import Artist, InfluencerProfile, TalentProfile
from content.models import (
    FAQ,
    BlogPost,
    GalleryImage,
    HeroSlide,
    PortfolioItem,
    Service,
    ServiceEntry,
    SiteSettings,
    TeamMember,
    Testimonial,
    Video,
)
from engagement.models import JobPosting

# Order of the eight service lines as linked from the navbar.
SERVICES = [
    {
        "slug": "corporate-events",
        "name": "Corporate Event Management",
        "category": "Corporate",
        "icon": "🏢",
        "short_description": "Conferences, product launches, annual parties and summits, planned end-to-end.",
        "price": "From ৳50,000",
        "link": "/services/corporate-events",
        "features": [
            "Concept & theme design",
            "Venue & logistics",
            "AV production",
            "On-ground management",
        ],
    },
    {
        "slug": "exhibition-stall-design",
        "name": "Exhibition Stall Design",
        "category": "Exhibition",
        "icon": "🏗️",
        "short_description": "Eye-catching custom stalls that make brands stand out at any expo.",
        "price": "From ৳1,50,000",
        "link": "/services/exhibition-stall-design",
        "features": [
            "3D design concept",
            "Fabrication & setup",
            "Brand integration",
            "Teardown support",
        ],
    },
    {
        "slug": "influencer-marketing",
        "name": "Influencer Marketing",
        "category": "Marketing",
        "icon": "📱",
        "short_description": "Campaigns with Bangladesh's top creators — from brief to reporting.",
        "price": "From ৳30,000",
        "link": "/services/influencer-marketing",
        "features": [
            "Influencer sourcing",
            "Campaign strategy",
            "Content review",
            "Performance reporting",
        ],
    },
    {
        "slug": "artist-celebrity-booking",
        "name": "Singer & Celebrity Booking",
        "category": "Entertainment",
        "icon": "🎤",
        "short_description": "Book singers, DJs, comedians, magicians and dancers for any event.",
        "price": "On request",
        "link": "/services/artist-celebrity-booking",
        "features": ["Artist availability", "Contracting", "Technical rider", "Show management"],
    },
    {
        "slug": "wedding-planning",
        "name": "Wedding Planning & Management",
        "category": "Wedding",
        "icon": "💍",
        "short_description": "Dream weddings, from intimate ceremonies to grand receptions.",
        "price": "From ৳1,00,000",
        "link": "/services/wedding-planning",
        "features": [
            "Venue styling",
            "Catering coordination",
            "Guest management",
            "Photography & video",
        ],
    },
    {
        "slug": "photography-video",
        "name": "Photography & Video Services",
        "category": "Media",
        "icon": "📸",
        "short_description": "Conference, product, industrial and wedding photo/video coverage.",
        "price": "From ৳30,000",
        "link": "/services/photography-video",
        "features": ["Professional crew", "4K video", "Drone coverage", "Post-production"],
    },
    {
        "slug": "special-events",
        "name": "Special Events",
        "category": "Special",
        "icon": "🎆",
        "short_description": "Award shows, concerts, laser shows, convocations, reunions and more.",
        "price": "On request",
        "link": "/services/special-events",
        "features": ["Award shows", "Music concerts", "Laser & fireworks", "Sports management"],
    },
    {
        "slug": "virtual-events",
        "name": "Virtual Events",
        "category": "Virtual",
        "icon": "💻",
        "short_description": "Hybrid and online events with professional streaming production.",
        "price": "From ৳40,000",
        "link": "/services/virtual-events",
        "features": [
            "Live streaming",
            "Virtual stage",
            "Audience engagement",
            "Recording & editing",
        ],
    },
]

HERO_SLIDES = [
    {
        "subtitle": "Luxury Events",
        "description": "Transform your special moments into unforgettable experiences with our premium event planning services.",
        "image": "https://www.anantabd.net/wp-content/uploads/2022/10/IMG_0386.jpg",
        "stats": "500+ Events Planned",
        "order": 0,
    },
    {
        "subtitle": "Events",
        "description": "Elevate your business gatherings with sophisticated corporate event planning that impresses and inspires.",
        "image": "https://www.anantabd.net/wp-content/uploads/2020/01/iscea-night-10.jpg",
        "stats": "1000+ Happy Clients",
        "order": 1,
    },
]

INFLUENCERS = [
    {
        "slug": "nodi-chowdhury",
        "name": "Nodi Chowdhury",
        "category": "Fashion",
        "followers": "250K",
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPrYP2N4PqKhrbzA0fT9vsJtQ26ti9OUf4Eg&s",
        "description": "Fashion influencer with trending styles",
        "engagement": "4.2%",
        "posts": "14",
        "platforms": ["Instagram", "TikTok", "YouTube"],
        "bio": "Fashion enthusiast sharing latest trends and styling tips",
        "avg_reach": "125K per post",
    },
    {
        "slug": "ayman-sadiq",
        "name": "Ayman Sadiq",
        "category": "Education",
        "followers": "2.3M+",
        "image": "https://yt3.googleusercontent.com/NtAHSyzlrYdBt_Mpbr5UeV3Vs2OMEseNRB6VdCufotcWIOfC2842LlfsshCpYyO3J0HoZ0gw=s900-c-k-c0x00ffffff-no-rj",
        "description": "Founder of 10 Minute School, motivational speaker",
        "engagement": "5.5%",
        "posts": "25",
        "platforms": ["YouTube", "Facebook"],
        "bio": "Education, skills, and self-development content",
        "avg_reach": "500K per post",
    },
]

PORTFOLIO = [
    {
        "slug": "luxury-garden-wedding",
        "title": "Luxury Garden Wedding",
        "category": "Weddings",
        "image": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        "description": "An enchanting outdoor ceremony with 200 guests in a botanical garden setting",
        "client": "Sarah & Michael",
        "event_date": "June 2023",
        "budget": "$75,000",
        "gallery": [
            "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1465056836643-15cea6d4e866?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        ],
    },
    {
        "slug": "tech-conference-2024",
        "title": "Tech Conference 2024",
        "category": "Corporate",
        "image": "https://www.anantabd.net/wp-content/uploads/2020/01/lead-speak-conference-7.jpg",
        "description": "Two-day technology conference with 800+ attendees, international speakers and live streaming.",
        "client": "Leading Telco",
        "event_date": "March 2024",
        "budget": "৳25,00,000",
        "gallery": [
            "https://www.anantabd.net/wp-content/uploads/2020/01/lead-speak-conference-7.jpg",
            "https://www.anantabd.net/wp-content/uploads/2020/01/lead-speak-conference-8.jpg",
            "https://www.anantabd.net/wp-content/uploads/2020/01/lead-speak-conference-13.jpg",
        ],
    },
    {
        "slug": "charity-gala-night",
        "title": "Charity Gala Night",
        "category": "Galas",
        "image": "https://www.anantabd.net/wp-content/uploads/2020/01/FB_IMG_1537774282179.jpg",
        "description": "Sophisticated evening fundraiser with live auction, dinner and celebrity performances.",
        "client": "NGO Foundation",
        "event_date": "December 2023",
        "budget": "৳15,00,000",
        "gallery": ["https://www.anantabd.net/wp-content/uploads/2020/01/FB_IMG_1537774282179.jpg"],
    },
    {
        "slug": "anniversary-celebration",
        "title": "Golden Anniversary Celebration",
        "category": "Private",
        "image": "https://www.anantabd.net/wp-content/uploads/2020/01/lead-speak-conference-8.jpg",
        "description": "Intimate family celebration with personal touches and a nostalgic memory wall.",
        "client": "The Rahman Family",
        "event_date": "January 2024",
        "budget": "৳5,00,000",
        "gallery": [
            "https://www.anantabd.net/wp-content/uploads/2020/01/lead-speak-conference-8.jpg"
        ],
    },
    {
        "slug": "product-launch-showcase",
        "title": "Product Launch Showcase",
        "category": "Corporate",
        "image": "https://www.anantabd.net/wp-content/uploads/2020/01/iscea-night-6.jpg",
        "description": "Creative product launch with interactive displays and press coverage.",
        "client": "Consumer Electronics Brand",
        "event_date": "February 2024",
        "budget": "৳18,00,000",
        "gallery": ["https://www.anantabd.net/wp-content/uploads/2020/01/iscea-night-6.jpg"],
    },
    {
        "slug": "royal-wedding-ceremony",
        "title": "Royal Wedding Ceremony",
        "category": "Weddings",
        "image": "https://www.anantabd.net/wp-content/uploads/2020/01/iscea-night-12.jpg",
        "description": "Grand traditional wedding with luxurious decorations and cultural performances.",
        "client": "The Chowdhury Family",
        "event_date": "November 2023",
        "budget": "৳30,00,000",
        "gallery": ["https://www.anantabd.net/wp-content/uploads/2020/01/iscea-night-12.jpg"],
    },
]

VIDEOS = [
    {
        "title": "Corporate Event Highlight",
        "category": "corporate",
        "youtube_id": "dQw4w9WgXcQ",
        "description": "Professional corporate event management and execution",
    },
    {
        "title": "Concert Aftermovie",
        "category": "concert",
        "youtube_id": "jNQXAC9IVRw",
        "description": "Live music concert production highlights",
    },
    {
        "title": "Wedding Cinematography",
        "category": "wedding",
        "youtube_id": "aqz-KE-bpKQ",
        "description": "Cinematic wedding film coverage",
    },
]

JOBS = [
    {
        "slug": "event-manager",
        "title": "Event Manager",
        "department": "Event Management",
        "experience": "2-3 years",
        "salary": "৳30,000 - ৳50,000",
        "description": "Looking for an experienced event manager to handle corporate events and large-scale functions.",
        "requirements": ["Event planning experience", "Team management", "Client communication"],
        "responsibilities": ["Manage event planning", "Client coordination", "Team supervision"],
    },
    {
        "slug": "graphic-designer",
        "title": "Graphic Designer",
        "department": "Creative",
        "experience": "1-2 years",
        "salary": "৳20,000 - ৳35,000",
        "description": "Creative designer for event branding, stage design renders and social media assets.",
        "requirements": ["Adobe Creative Suite", "3D design basics", "Portfolio of event work"],
        "responsibilities": ["Event branding", "Social media creatives", "Stage design renders"],
    },
]

HOME_FAQS = [
    {
        "question": "What services does Ananta Events & Entertainment provide?",
        "answer": "Ananta Events & Entertainment offers a wide range of event management services, including corporate events, brand activations, weddings, social events, product launches, conferences, exhibitions, concerts, fairs, and cultural programs. We provide both creative planning and flawless execution to make every event a success.",
    },
    {
        "question": "Why choose Ananta as your event management partner in Bangladesh?",
        "answer": "Choosing Ananta means choosing professionalism, creativity, and reliability. Our team pays attention to every detail, ensures timely delivery, and provides customized solutions tailored to your event needs. We focus on client satisfaction and have a proven track record of managing both local and international events with excellence.",
    },
    {
        "question": "Do you provide exhibition stand fabrication services?",
        "answer": "Yes, we provide exhibition stand fabrication and design services. From concept to execution, our team creates visually appealing and functional stands that highlight your brand and engage visitors effectively.",
    },
    {
        "question": "Can Ananta handle both small and large-scale events?",
        "answer": "Absolutely. Whether it's a small private gathering, a corporate meeting, or a large-scale concert or exhibition, Ananta has the expertise, resources, and team strength to manage events of any size.",
    },
    {
        "question": "Do you organize conferences and seminars?",
        "answer": "Yes, Ananta specializes in organizing professional conferences, seminars, and workshops. We take care of venue management, audio-visual setup, logistics, registration, and overall coordination so you can focus on your content and guests.",
    },
    {
        "question": "What makes Ananta different from other event planners in Bangladesh?",
        "answer": "What sets Ananta apart is our commitment to creativity, precision, and client satisfaction. We don't just plan events-we craft experiences. Our dedicated team ensures innovative ideas, flawless execution, and personalized service, making every event truly memorable.",
    },
    {
        "question": "Can you provide end-to-end solutions for brand activations?",
        "answer": "Yes. We provide complete end-to-end solutions for brand activations, including concept development, creative design, promotional strategies, logistics, on-ground execution, and post-event reporting. Our goal is to maximize your brand's visibility and audience engagement.",
    },
    {
        "question": "Where does Ananta provide event services in Bangladesh?",
        "answer": "Ananta provides event management services all across Bangladesh, including major cities like Dhaka, Chattogram, Khulna, Sylhet, Rajshahi, Barishal, Bogura, and more. We have the flexibility and capacity to manage events nationwide.",
    },
    {
        "question": "How can I request a quotation for my event?",
        "answer": "Requesting a quotation is simple. You can contact us through our official website, social media channels, or directly via phone/email. Share your event details with us, and our team will provide you with a customized quotation tailored to your specific requirements.",
    },
]

INFLUENCER_FAQS = [
    {
        "question": "How to choose the right social Influencer for your brand?",
        "answer": "To choose the right influencer for your business in Bangladesh, verify: Is the influencer creating content applicable to your business? Do they engage with their following? Is their content consistent? How often is their content shared? Is the influencer someone your brand wants to be affiliated with? Influencer content must match your brand values, be scandal-free, and share the same social message — this ensures a long and successful relationship.",
    },
    {
        "question": "What is a social media influencer?",
        "answer": "A social media influencer is a person who has built a dedicated online following and can influence their audience's opinions and purchasing decisions through the content they create on platforms like Facebook, Instagram, YouTube and TikTok.",
    },
    {
        "question": "Why choose us to find your right Influencers for your Brand?",
        "answer": "We maintain a curated database of verified Bangladeshi influencers across every niche, handle negotiation, contracts, content review and campaign analytics end-to-end, so your brand gets measurable results without the risk.",
    },
]

ABOUT_STATS = [
    {"number": "500+", "label": "Events Planned", "icon": "🎭"},
    {"number": "15+", "label": "Years Experience", "icon": "⏰"},
    {"number": "98%", "label": "Client Satisfaction", "icon": "⭐"},
    {"number": "50+", "label": "Luxury Venues", "icon": "🏛️"},
]

ABOUT_VALUES = [
    {
        "icon": "💎",
        "title": "Excellence",
        "description": "We strive for perfection in every detail, ensuring your event exceeds expectations.",
    },
    {
        "icon": "🤝",
        "title": "Trust",
        "description": "Building lasting relationships through transparency, reliability, and exceptional service.",
    },
    {
        "icon": "✨",
        "title": "Innovation",
        "description": "Creative solutions and cutting-edge ideas that make your event truly unique.",
    },
    {
        "icon": "❤️",
        "title": "Passion",
        "description": "Every celebration is personal to us. Your joy is our greatest achievement.",
    },
]

SETTINGS_DEFAULTS = {
    "site_name": "Ananta Events",
    "tagline": "Best Event Management Company in Bangladesh",
    "email": "anantaevents@gmail.com",
    "phone": "+8801813340400",
    "whatsapp": "8801813340400",
    "address": "Level-7, Suite-2, A K Complex, 19 Green Road, Dhanmondi, Dhaka-1205, Bangladesh",
    "facebook": "https://www.facebook.com/anantaeventsbd/",
    "instagram": "https://www.instagram.com/anantaeventsbd/",
    "youtube": "https://www.youtube.com/@anantaeventsbd",
    "linkedin": "https://www.linkedin.com/company/ananta-events-bangladesh/",
    "pinterest": "https://www.pinterest.com/anantabd/",
    "footer_text": "Ananta Events & Entertainment — crafting unforgettable corporate events, exhibitions, concerts and weddings across Bangladesh since 2009.",
    "seo_title": "Ananta Events | Best Event Management Company in Bangladesh",
    "seo_description": "Ananta Events & Entertainment is a leading event management company in Bangladesh — corporate events, exhibitions, concerts, celebrity booking and luxury weddings.",
    "about_stats": ABOUT_STATS,
    "about_values": ABOUT_VALUES,
}


class Command(BaseCommand):
    help = "Seed demo content: imports everything currently hardcoded in the frontend JSON files."

    def add_arguments(self, parser):
        parser.add_argument(
            "--source", default="", help="Path to the frontend public/ dir with the JSON data."
        )
        parser.add_argument(
            "--flush", action="store_true", help="Delete existing content rows first (not users)."
        )

    # ------------------------------------------------------------ helpers --
    def _load_json(self, *parts):
        path = self.source.joinpath(*parts)
        if not path.exists():
            return None
        with open(path, encoding="utf-8") as fh:
            return json.load(fh)

    def warn(self, msg):
        self.stdout.write(self.style.WARNING(f"  ! {msg}"))

    def ok(self, msg):
        self.stdout.write(f"  + {msg}")

    # --------------------------------------------------------------- main --
    def handle(self, *args, **options):
        source = options.get("source") or getattr(settings, "SEED_SOURCE_DIR", "") or ""
        candidates = [
            Path(source) if source else None,
            Path(settings.BASE_DIR).parent / "public",
            Path(settings.BASE_DIR) / "public",
            Path("/app/public"),
        ]
        self.source = next((c for c in candidates if c and c.exists()), None)
        if self.source:
            self.stdout.write(f"Data source: {self.source}")
        else:
            raise CommandError(
                "Could not locate the frontend public/ data directory. "
                "Pass --source /path/to/public or set SEED_SOURCE_DIR."
            )

        if options.get("flush"):
            self._flush()

        self.seed_settings()
        self.seed_hero()
        self.seed_services()
        self.seed_service_entries()
        self.seed_artists()
        self.seed_influencers()
        self.seed_talent_profiles()
        self.seed_portfolio()
        self.seed_gallery()
        self.seed_videos()
        self.seed_blogs()
        self.seed_testimonials()
        self.seed_team()
        self.seed_faqs()
        self.seed_jobs()

        self.stdout.write(self.style.SUCCESS("\nSeed complete."))

    def _flush(self):
        self.stdout.write(self.style.WARNING("Flushing existing content rows…"))
        for model in [
            HeroSlide,
            Service,
            ServiceEntry,
            FAQ,
            Testimonial,
            TeamMember,
            PortfolioItem,
            GalleryImage,
            Video,
            BlogPost,
            Artist,
            InfluencerProfile,
            TalentProfile,
            JobPosting,
        ]:
            model.objects.all().delete()

    # ------------------------------------------------------------- seeders --
    def seed_settings(self):
        s = SiteSettings.load()
        for key, value in SETTINGS_DEFAULTS.items():
            setattr(s, key, value)
        s.save()
        self.ok("Site settings (contact, social, SEO, about stats/values)")

    def seed_hero(self):
        for data in HERO_SLIDES:
            HeroSlide.objects.update_or_create(
                subtitle=data["subtitle"],
                defaults={**data, "is_published": True},
            )
        self.ok(f"Hero slides: {HeroSlide.objects.count()}")

    def seed_services(self):
        for svc in SERVICES:
            Service.objects.update_or_create(
                slug=svc["slug"], defaults={**svc, "is_published": True}
            )
        self.ok(f"Services: {Service.objects.count()}")

    def seed_service_entries(self):
        total = 0
        # Corporate events + exhibition stalls share the blog-like shape.
        mapping = [
            ("corporate_event", "CorporateEvents/CorporateEvents.json"),
            ("exhibition_stall", "ExhibitionStallData/ExhibitionStallData.json"),
        ]
        for entry_type, rel in mapping:
            rows = self._load_json(rel) or []
            for row in rows:
                legacy_id = row.get("_id") or ""
                # legacy JSON reuses the same _ids across corporate/exhibition
                # files, so slugs are namespaced by entry type; the original
                # id is kept in legacy_id for old-URL lookups.
                obj, created = ServiceEntry.objects.update_or_create(
                    slug=f"{entry_type.replace('_', '-')}-{legacy_id}",
                    defaults={
                        "entry_type": entry_type,
                        "title": row.get("title", ""),
                        "category": row.get("category", ""),
                        "excerpt": row.get("excerpt", ""),
                        "content": row.get("content", ""),
                        "author": row.get("author", ""),
                        "date": row.get("date") or date.today(),
                        "featured": bool(row.get("featured")),
                        "cover_image": (row.get("images") or [""])[0] if row.get("images") else "",
                        "images": row.get("images") or [],
                        "legacy_id": legacy_id,
                        "is_published": True,
                    },
                )
                total += 1
        # Special events (with services + stats).
        special = self._load_json("Services", "SpecialEvent.json") or []
        if isinstance(special, dict):
            special = special.get("events", [])
        for row in special:
            legacy_id = row.get("id") or row.get("type") or ""
            obj, created = ServiceEntry.objects.update_or_create(
                slug=legacy_id,
                defaults={
                    "entry_type": "special_event",
                    "title": row.get("title", ""),
                    "category": "Special Event",
                    "excerpt": row.get("description", ""),
                    "content": row.get("details", ""),
                    "author": "Ananta Events",
                    "featured": True,
                    "cover_image": row.get("image", ""),
                    "included_services": row.get("services", []),
                    "stats": row.get("stats", []),
                    "legacy_id": legacy_id,
                    "is_published": True,
                },
            )
            total += 1
        # Photography & video services (legacy hardcoded array).
        photo = self._load_json("PhotographyServices", "photography.json")
        if photo is None:
            photo = self.PHOTOGRAPHY_SERVICES
        for row in photo:
            obj, created = ServiceEntry.objects.update_or_create(
                slug=f"photography-{row['id']}",
                defaults={
                    "entry_type": "photography_service",
                    "title": row["title"],
                    "category": row.get("category", "Photography"),
                    "excerpt": row.get("details", ""),
                    "content": row.get("details", ""),
                    "cover_image": row.get("image", ""),
                    "images": row.get("gallery", []),
                    "legacy_id": str(row["id"]),
                    "is_published": True,
                },
            )
            total += 1
        self.ok(f"Service entries (corporate/exhibition/special/photography): {total}")

    PHOTOGRAPHY_SERVICES = [
        {
            "id": 1,
            "title": "Conference Photography",
            "category": "Photography",
            "image": "https://www.anantabd.net/wp-content/uploads/2020/03/CONFERENCE-PHOTOGRAPHY1-768x513.jpg",
            "gallery": [
                "https://www.anantabd.net/wp-content/uploads/2020/03/CONFERENCE-PHOTOGRAPHY1-768x513.jpg",
                "https://www.anantabd.net/wp-content/uploads/2020/03/CONFERENCE-PHOTOGRAPHY2-768x513.jpg",
                "https://www.anantabd.net/wp-content/uploads/2020/03/CONFERENCE-PHOTOGRAPHY3-768x513.jpg",
                "https://www.anantabd.net/wp-content/uploads/2020/03/CONFERENCE-PHOTOGRAPHY5-768x576.jpg",
                "https://www.anantabd.net/wp-content/uploads/2020/03/CONFERENCE-PHOTOGRAPHY4-768x513.jpg",
            ],
            "details": "Full day coverage • Professional editing • High-resolution images • Digital album • Print-ready files • Drone photography available • Same-day preview • Post-event album",
        },
        {
            "id": 2,
            "title": "Industrial Photography",
            "category": "Photography",
            "image": "https://www.anantabd.net/wp-content/uploads/2020/03/Industrial-Photogr-1-768x449.jpg",
            "gallery": [
                "https://www.anantabd.net/wp-content/uploads/2020/03/Industrial-Photography-of-BM-Energy-Ltd2-768x512.jpg",
                "https://www.anantabd.net/wp-content/uploads/2020/03/Industrial-Photography-of-BM-Energy-Ltd5-768x496.jpg",
                "https://www.anantabd.net/wp-content/uploads/2020/03/Industrial-Photography-of-BM-Energy-Ltd4-768x512.jpg",
                "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=600&q=80",
            ],
            "details": "2-8 hours coverage • Edited photos • Digital copies • Corporate branding • Facility documentation • Team photography • Product showcase • Professional retouching",
        },
        {
            "id": 3,
            "title": "Corporate Video Production",
            "category": "Video",
            "image": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
            "gallery": [
                "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1537381052736-fe75ced3e34c?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1535016120754-fd58615ccbf5?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1533627519674-87af27127a8d?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
            ],
            "details": "Scriptwriting • Professional shooting • 4K video quality • Color grading • Sound design • Motion graphics • Multiple camera angles • Post-production editing",
        },
        {
            "id": 4,
            "title": "Modeling Photography",
            "category": "Photography",
            "image": "https://www.anantabd.net/wp-content/uploads/2020/01/7.jpg",
            "gallery": [
                "https://www.anantabd.net/wp-content/uploads/2020/01/model-photoshoot-in-dhaka-6-350x350-1.jpg",
                "https://www.anantabd.net/wp-content/uploads/2020/01/model-photoshoot-in-dhaka.jpg",
                "https://www.anantabd.net/wp-content/uploads/2020/01/model-photography-9.jpg",
                "https://www.anantabd.net/wp-content/uploads/2020/01/DSC_3371-350x350-1-300x300.jpg",
            ],
            "details": "Studio setup • Multiple angles • Various backgrounds • Professional lighting • Wardrobe styling • Hair & makeup coordination • Retouching services • Fashion portfolio creation",
        },
        {
            "id": 5,
            "title": "Product Photography",
            "category": "Video",
            "image": "https://www.anantabd.net/wp-content/uploads/2020/01/product-Photography-1.jpg",
            "gallery": [
                "https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1537381052736-fe75ced3e34c?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1525565565265-20668516635a?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
            ],
            "details": "Concept development • Professional production • Post-production editing • Motion graphics • E-commerce optimization • Multiple product angles • Lifestyle shoots • Behind-the-scenes content",
        },
        {
            "id": 6,
            "title": "Wedding Photography & Videography",
            "category": "Photography",
            "image": "https://www.anantabd.net/wp-content/uploads/2019/12/wedding-photography-11.jpg",
            "gallery": [
                "https://www.anantabd.net/wp-content/uploads/2019/12/wedding-photography-12.jpg",
                "https://www.anantabd.net/wp-content/uploads/2019/12/wedding-photography-11.jpg",
                "https://www.anantabd.net/wp-content/uploads/2019/12/wedding-photography-10.jpg",
                "https://www.anantabd.net/wp-content/uploads/2019/12/wedding-photography-9.jpg",
                "https://www.anantabd.net/wp-content/uploads/2019/12/wedding-photography-8.jpg",
                "https://www.anantabd.net/wp-content/uploads/2019/12/wedding-photography-7.jpg",
            ],
            "details": "Full day coverage • Bridal photography • Candid moments • Venue decoration shots • Guest interactions • Reception highlights • Same-day edit video • Drone footage included",
        },
    ]

    def seed_artists(self):
        total = 0

        def import_rows(rows, category, transform):
            nonlocal total
            for row in rows or []:
                data = transform(row)
                data.setdefault("is_published", True)
                Artist.objects.update_or_create(slug=data.pop("slug"), defaults=data)
                total += 1

        def base(row, extra=None):
            data = {
                "name": row.get("name", ""),
                "image": row.get("image", ""),
                "rating": row.get("rating", 4.5),
                "city": row.get("city", ""),
                "country": row.get("country", "Bangladesh"),
                "bio": row.get("bio", ""),
                "experience_years": row.get("experience_years"),
                "awards": row.get("awards", []),
                "followers": str(row.get("followers", row.get("social_followers", ""))),
            }
            if extra:
                data.update(extra)
            return data

        singers = self._load_json("SingersData", "singersData.json")
        if isinstance(singers, dict):
            singers = singers.get("singers", [])
        import_rows(
            singers,
            "singer",
            lambda r: base(
                r,
                {
                    "slug": f"singer-{str(r.get('name', '')).lower().replace(' ', '-')}",
                    "category": "singer",
                    "genre": r.get("genre", ""),
                    "price": str(r.get("price", "")),
                    "description": r.get("description", ""),
                    "experience": str(r.get("experience", "")),
                    "languages": r.get("languages", []),
                    "popular_songs": r.get("popularSongs", []),
                    "availability": r.get("availability", "Available"),
                    "location": r.get("location", ""),
                    "contact_email": r.get("contactEmail", ""),
                    "specialties": r.get("specialties", []),
                    "social_media": r.get("socialMedia", {}),
                },
            ),
        )

        import_rows(
            self._load_json("DjData", "DjData.json"),
            "dj",
            lambda r: base(
                r,
                {
                    "slug": f"dj-{str(r.get('name', '')).lower().replace(' ', '-')}",
                    "category": "dj",
                    "genre": r.get("genre", ""),
                    "description": r.get("famous_for", ""),
                    "famous_for": r.get("famous_for", ""),
                    "experience": (
                        f"{r.get('experience_years', '')} years"
                        if r.get("experience_years")
                        else ""
                    ),
                    "media_presence": r.get("media_presence", ""),
                    "tour_status": "Active",
                },
            ),
        )

        import_rows(
            self._load_json("ComedianData", "comedians.json"),
            "comedian",
            lambda r: base(
                r,
                {
                    "slug": f"comedian-{str(r.get('name', '')).lower().replace(' ', '-')}",
                    "category": "comedian",
                    "famous_show": r.get("famous_show", ""),
                    "experience": (
                        f"{r.get('experience_years', '')} years"
                        if r.get("experience_years")
                        else ""
                    ),
                    "tour_status": r.get("tour_status", "Active"),
                    "specialties": r.get("genres", []),
                    "styles": r.get("notable_specials", []),
                },
            ),
        )

        import_rows(
            self._load_json("MagiciansData", "MagiciansData.json"),
            "magician",
            lambda r: base(
                r,
                {
                    "slug": f"magician-{str(r.get('name', '')).lower().replace(' ', '-')}",
                    "category": "magician",
                    "famous_show": r.get("famous_show", ""),
                    "experience": (
                        f"{r.get('experience_years', '')} years"
                        if r.get("experience_years")
                        else ""
                    ),
                    "tour_status": r.get("tour_status", "Active"),
                    "specialties": r.get("genres", []),
                },
            ),
        )

        import_rows(
            self._load_json("CoreographerData", "CoreographerData.json"),
            "dancer",
            lambda r: base(
                r,
                {
                    "slug": f"dancer-{str(r.get('name', '')).lower().replace(' ', '-')}",
                    "category": "dancer",
                    "description": r.get("famous_work", ""),
                    "famous_for": r.get("famous_work", ""),
                    "experience": (
                        f"{r.get('experience_years', '')} years"
                        if r.get("experience_years")
                        else ""
                    ),
                    "styles": r.get("dance_styles", []),
                    "tour_status": r.get("status", "Active"),
                },
            ),
        )

        self.ok(f"Artists: {total} (singers/djs/comedians/magicians/dancers)")

    def seed_influencers(self):
        for row in INFLUENCERS:
            InfluencerProfile.objects.update_or_create(
                slug=row["slug"], defaults={**row, "is_published": True}
            )
        self.ok(f"Influencers: {InfluencerProfile.objects.count()}")

    def seed_talent_profiles(self):
        data = self._load_json("TalentHunt", "TalentHunt.json") or {}
        rows = data.get("talents", []) if isinstance(data, dict) else data or []
        for i, row in enumerate(rows):
            TalentProfile.objects.update_or_create(
                name=row.get("name", f"Talent {i + 1}"),
                defaults={
                    "category": row.get("category", ""),
                    "image": str(row.get("image", "")),
                    "rating": row.get("rating", 4.5),
                    "experience": row.get("experience", ""),
                    "bio": row.get("bio", ""),
                    "full_bio": row.get("fullBio", ""),
                    "video_url": row.get("videoUrl") or "",
                    "audio_url": row.get("audioUrl") or "",
                    "portfolio": row.get("portfolio") or "",
                    "instagram": row.get("instagram") or "",
                    "achievements": row.get("achievements", []),
                    "rates": row.get("rates", ""),
                    "order": i,
                    "is_published": True,
                },
            )
        self.ok(f"Talent profiles: {TalentProfile.objects.count()}")

    def seed_portfolio(self):
        for row in PORTFOLIO:
            PortfolioItem.objects.update_or_create(
                slug=row["slug"], defaults={**row, "is_published": True}
            )
        self.ok(f"Portfolio items: {PortfolioItem.objects.count()}")

    def seed_gallery(self):
        rows = self._load_json("gallery.json") or []
        for i, row in enumerate(rows):
            GalleryImage.objects.update_or_create(
                title=row.get("title", f"Gallery image {i + 1}"),
                defaults={
                    "category": row.get("category", ""),
                    "image": row.get("src", ""),
                    "description": row.get("description", ""),
                    "order": i,
                    "is_published": True,
                },
            )
        self.ok(f"Gallery images: {GalleryImage.objects.count()}")

    def seed_videos(self):
        for row in VIDEOS:
            Video.objects.update_or_create(
                title=row["title"],
                defaults={**row, "is_published": True},
            )
        self.ok(f"Videos: {Video.objects.count()}")

    def seed_blogs(self):
        rows = self._load_json("Blog.json") or []
        for row in rows:
            legacy_id = row.get("_id") or ""
            BlogPost.objects.update_or_create(
                slug=legacy_id,
                defaults={
                    "title": row.get("title", ""),
                    "category": row.get("category", ""),
                    "image": row.get("image", ""),
                    "excerpt": row.get("excerpt", ""),
                    "content": row.get("content", ""),
                    "author": row.get("author", "webadmin"),
                    "published_date": row.get("date") or date.today(),
                    "featured": bool(row.get("featured")),
                    "read_time": row.get("readTime", ""),
                    "tags": row.get("tags", []),
                    "legacy_id": legacy_id,
                    "is_published": True,
                },
            )
        self.ok(f"Blog posts: {BlogPost.objects.count()}")

    def seed_testimonials(self):
        rows = self._load_json("Testimonals.json") or []
        for i, row in enumerate(rows):
            Testimonial.objects.update_or_create(
                name=row.get("name", f"Client {i + 1}"),
                defaults={
                    "designation": row.get("designation", ""),
                    "company": row.get("company", ""),
                    "image": row.get("image", ""),
                    "rating": row.get("rating", 5),
                    "review": row.get("review", ""),
                    "event_type": row.get("eventType", ""),
                    "order": i,
                    "is_published": True,
                },
            )
        self.ok(f"Testimonials: {Testimonial.objects.count()}")

    def seed_team(self):
        about = self._load_json("About", "About.json") or {}
        rows = about.get("team", [])
        for i, row in enumerate(rows):
            TeamMember.objects.update_or_create(
                name=row.get("name", f"Member {i + 1}"),
                defaults={
                    "role": row.get("role", ""),
                    "image": row.get("image", ""),
                    "description": row.get("description", ""),
                    "order": i,
                    "is_published": True,
                },
            )
        self.ok(f"Team members: {TeamMember.objects.count()}")

    def seed_faqs(self):
        for i, row in enumerate(HOME_FAQS):
            FAQ.objects.update_or_create(
                question=row["question"],
                defaults={
                    "answer": row["answer"],
                    "page": "home",
                    "order": i,
                    "is_published": True,
                },
            )
        for i, row in enumerate(INFLUENCER_FAQS):
            FAQ.objects.update_or_create(
                question=row["question"],
                defaults={
                    "answer": row["answer"],
                    "page": "influencer",
                    "order": i,
                    "is_published": True,
                },
            )
        # Corporate FAQ mirrors the home list on the live site.
        corporate = self._load_json("CorporateFAQ", "corporateFAQs.json")
        if corporate is None:
            corporate = HOME_FAQS[:3]
        for i, row in enumerate(corporate):
            FAQ.objects.update_or_create(
                question=row["question"],
                defaults={
                    "answer": row["answer"],
                    "page": "corporate",
                    "order": i,
                    "is_published": True,
                },
            )
        self.ok(f"FAQs: {FAQ.objects.count()} (home/corporate/influencer)")

    def seed_jobs(self):
        for row in JOBS:
            JobPosting.objects.update_or_create(
                slug=row["slug"], defaults={**row, "is_published": True}
            )
        self.ok(f"Job postings: {JobPosting.objects.count()}")
