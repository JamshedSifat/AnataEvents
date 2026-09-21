"""Import every piece of content that used to be hardcoded in the frontend.

Sources (all under `apps/content/seed/`, extracted from the old JSX/JSON files):

* `artists_*.json`        → Artist rows for all five categories
* `testimonials.json`     → Testimonial
* `gallery.json`          → GalleryImage
* `blogs.json`/`blog_full.json` → BlogPost
* `about.json`            → TeamMember + ContentBlock (stats, values)
* `corporate_events.json` / `exhibition_stall.json` → ServiceEntry
* `special_event_list.json` + `special_events.json` → the Special Events service
  (the 7 previously hardcoded detail pages + the list page)
* `pages.json`            → ContentBlock sections, FAQs, Video, SiteSettings copy
* `talent_hunt.json`      → Talent showcase (Artist rows marked featured)

Usage:
    python manage.py seed_demo_data               # create or update everything
    python manage.py seed_demo_data --skip-existing
    python manage.py seed_demo_data --reset       # delete seeded content first
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.content.models import (
    FAQ,
    Artist,
    BlogPost,
    ContentBlock,
    GalleryImage,
    HeroSlide,
    InfluencerProfile,
    JobPosting,
    PortfolioItem,
    Service,
    ServiceEntry,
    ServiceEntryImage,
    SiteSettings,
    TeamMember,
    Testimonial,
    Video,
)

SEED_DIR = Path(__file__).resolve().parents[2] / "seed"


def load(name: str) -> Any:
    return json.loads((SEED_DIR / name).read_text())


def _minutes(value) -> int:
    """'5 min read' / '5' / None → int."""
    if not value:
        return 4
    match = re.search(r"\d+", str(value))
    return int(match.group()) if match else 4


def html(paragraphs: list[str]) -> str:
    return "\n".join(f"<p>{p}</p>" for p in paragraphs if p)


class Command(BaseCommand):
    help = "Seed the database with the content that used to be hardcoded in the frontend."

    def add_arguments(self, parser):
        parser.add_argument(
            "--skip-existing",
            action="store_true",
            help="Do not overwrite rows that already exist (safe for redeploys).",
        )
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete seeded content before loading (does not touch users).",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        self.skip = options["skip_existing"]
        self.created = 0
        self.updated = 0

        if options["reset"]:
            self.stdout.write(self.style.WARNING("Removing existing content rows…"))
            for model in (
                ServiceEntryImage,
                ServiceEntry,
                Service,
                HeroSlide,
                ContentBlock,
                Artist,
                InfluencerProfile,
                PortfolioItem,
                GalleryImage,
                Video,
                BlogPost,
                Testimonial,
                TeamMember,
                FAQ,
                JobPosting,
            ):
                model.objects.all().delete()

        self.seed_site_settings()
        self.seed_hero()
        self.seed_services()
        self.seed_special_events()
        self.seed_blocks()
        self.seed_faqs()
        self.seed_artists()
        self.seed_influencers()
        self.seed_testimonials()
        self.seed_team()
        self.seed_gallery()
        self.seed_videos()
        self.seed_blogs()
        self.seed_portfolio()
        self.seed_jobs()
        self.seed_talent_showcase()

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed complete — {self.created} created, {self.updated} updated "
                f"(source: {SEED_DIR})."
            )
        )

    # ------------------------------------------------------------------ #
    def upsert(self, model, lookup: dict, defaults: dict, *, label: str | None = None):
        """Create or update a single row, honouring --skip-existing."""
        defaults = {k: v for k, v in defaults.items() if k not in lookup}
        obj = model.objects.filter(**lookup).first()
        if obj is None:
            obj = model.objects.create(**lookup, **defaults)
            self.created += 1
            return obj, True
        if not self.skip:
            changed = False
            for key, value in defaults.items():
                if getattr(obj, key) != value:
                    setattr(obj, key, value)
                    changed = True
            if changed:
                obj.save()
                self.updated += 1
        return obj, False

    # ------------------------------------------------------------------ #
    def seed_site_settings(self):
        settings_obj = SiteSettings.load()
        defaults = {
            "company_name": "Ananta Events",
            "tagline": "Event Management & Entertainment Company in Bangladesh",
            "phone": "+8801713 693245",
            "phone_alt": "01813340400",
            "email": "info@anantabd.net",
            "address": "House 12, Road 5, Dhanmondi, Dhaka 1205, Bangladesh",
            "facebook": "https://www.facebook.com/anantaevents",
            "instagram": "https://www.instagram.com/anantaevents",
            "youtube": "https://www.youtube.com/@anantaevents",
            "linkedin": "https://www.linkedin.com/company/ananta-events",
            "about_short": (
                "Ananta Events and Entertainment is an award-winning event management "
                "company in Dhaka, Bangladesh with 16+ years of experience delivering "
                "corporate events, exhibitions, brand activations, concerts and weddings."
            ),
            "footer_text": "© Ananta Events — Event Management & Entertainment Company in Bangladesh.",
            "default_seo_title": "Ananta Events | Best Event Management Company in Bangladesh",
            "default_seo_description": (
                "Ananta Events is a leading event management company in Dhaka, Bangladesh — "
                "corporate events, exhibitions, brand activations, concerts and weddings."
            ),
        }
        for key, value in defaults.items():
            if not getattr(settings_obj, key):
                setattr(settings_obj, key, value)
        settings_obj.save()
        self.stdout.write("· site settings ready")

    def seed_hero(self):
        slides = [
            {
                "subtitle": "Luxury Events",
                "heading": "Ananta Events",
                "description": (
                    "Transform your special moments into unforgettable experiences with our "
                    "premium event planning services."
                ),
                "image_url": "https://www.anantabd.net/wp-content/uploads/2022/10/IMG_0386.jpg",
                "stats": "500+ Events Planned",
                "cta_label": "Explore our services",
                "cta_url": "/services",
                "order": 1,
            },
            {
                "subtitle": "Events",
                "heading": "Corporate & Cultural",
                "description": (
                    "Elevate your business gatherings with sophisticated corporate event "
                    "planning that impresses and inspires."
                ),
                "image_url": "https://www.anantabd.net/wp-content/uploads/2020/01/iscea-night-10.jpg",
                "stats": "1000+ Happy Clients",
                "cta_label": "Book a consultation",
                "cta_url": "/contact",
                "order": 2,
            },
        ]
        for slide in slides:
            defaults = {k: v for k, v in slide.items() if k != "subtitle"}
            self.upsert(HeroSlide, {"subtitle": slide["subtitle"]}, defaults)

    def seed_services(self):
        pages = load("pages.json")
        specs = [
            {
                "slug": "corporate-events",
                "name": "Corporate Event Management",
                "badge": "CORPORATE SOLUTIONS",
                "heading": "Corporate Event Management",
                "heading_highlight": "Company in Bangladesh",
                "icon": "🎯",
                "color_from": "from-red-500",
                "color_to": "to-pink-500",
                "summary": (
                    "360° corporate event management: conferences, product launches, brand "
                    "activations, team building and gala nights across Bangladesh."
                ),
                "body": html(pages.get("corporate", {}).get("paragraphs", [])),
                "features": [
                    "Corporate Event Planners",
                    "Event Organizers For Corporate",
                    "Corporate Event Organisers",
                    "Corporate Event Promotion Planners",
                ],
                "order": 1,
            },
            {
                "slug": "exhibition-stall-design",
                "name": "Exhibition Stall Design & Fabrication",
                "badge": "EXHIBITION EXPERTS",
                "heading": "Best Exhibition Stall Design",
                "heading_highlight": "& Fabrication Company in Dhaka",
                "icon": "🏗️",
                "color_from": "from-blue-500",
                "color_to": "to-cyan-500",
                "summary": (
                    "Exhibition stand design, fabrication, booth production and venue "
                    "procurement for trade fairs and expos."
                ),
                "body": html(pages.get("exhibition", {}).get("paragraphs", [])),
                "features": [
                    "Stall Design",
                    "Fabrication",
                    "Booth Production",
                    "Venue Procurement",
                ],
                "order": 2,
            },
            {
                "slug": "influencer-marketing",
                "name": "Influencer Marketing Agency",
                "badge": "DIGITAL MARKETING",
                "heading": "Influencer Marketing",
                "heading_highlight": "Agency in Bangladesh",
                "icon": "📈",
                "color_from": "from-purple-500",
                "color_to": "to-pink-500",
                "summary": (
                    "End-to-end influencer campaigns, social media marketing and SEO that "
                    "connect brands with the right creators."
                ),
                "body": html(
                    pages.get("influencer_seo", {}).get("paragraphs", [])
                    + pages.get("influencer_what", {}).get("paragraphs", [])
                ),
                "features": [
                    "Influencer Campaigns",
                    "Social Media Marketing",
                    "Search Engine Optimisation",
                    "Content Production",
                ],
                "order": 3,
            },
            {
                "slug": "singer-celebrity-booking",
                "name": "Singer & Celebrity Booking",
                "badge": "ARTIST MANAGEMENT",
                "heading": "Singer & Celebrity",
                "heading_highlight": "Booking Agency",
                "icon": "🎤",
                "color_from": "from-amber-500",
                "color_to": "to-orange-500",
                "summary": (
                    "Book Bangladeshi singers, bands, DJs, comedians, magicians and dancers "
                    "for concerts, weddings and corporate shows."
                ),
                "body": html(pages.get("book_artists_paragraphs", [])),
                "features": ["Singers & Bands", "DJs", "Comedians", "Magicians", "Dancers"],
                "order": 4,
            },
            {
                "slug": "wedding-planner",
                "name": "Wedding Planner & Management",
                "badge": "WEDDING PLANNING",
                "heading": "Wedding Planner",
                "heading_highlight": "& Management",
                "icon": "💍",
                "color_from": "from-rose-500",
                "color_to": "to-red-600",
                "summary": (
                    "Full-service wedding planning: venue selection, décor design, catering, "
                    "entertainment and day-of coordination."
                ),
                "body": (
                    "<p>Ananta Events plans and manages weddings of every size — from intimate "
                    "family ceremonies to grand multi-day celebrations. We handle venue "
                    "selection, theme and décor design, catering, entertainment, guest "
                    "management and on-site coordination so that you can enjoy your own "
                    "wedding.</p>"
                ),
                "features": [
                    "Venue Selection",
                    "Decor Design",
                    "Catering Management",
                    "Coordination",
                ],
                "order": 5,
            },
            {
                "slug": "photography-video",
                "name": "Photography & Video Services",
                "badge": "MEDIA PRODUCTION",
                "heading": "Photography & Video",
                "heading_highlight": "Services",
                "icon": "📸",
                "color_from": "from-slate-600",
                "color_to": "to-slate-800",
                "summary": (
                    "Event photography, cinematic videography, drone coverage and post "
                    "production for corporate and social events."
                ),
                "body": html(pages.get("photography", {}).get("paragraphs", [])),
                "features": [
                    "Event Photography",
                    "Cinematic Videography",
                    "Drone Coverage",
                    "Post Production",
                ],
                "order": 6,
            },
            {
                "slug": "special-events",
                "name": "Special Events",
                "badge": "SIGNATURE SHOWS",
                "heading": "Special Events",
                "heading_highlight": "We Organise",
                "icon": "✨",
                "color_from": "from-violet-500",
                "color_to": "to-indigo-600",
                "summary": (
                    "Award shows, convocations, reunions, fashion shows, music concerts, "
                    "laser shows and sports management."
                ),
                "body": (
                    "<p>From glamorous award shows to university convocations, reunions, "
                    "fashion shows, live concerts, laser and fireworks displays and complete "
                    "sports event management — Ananta Events delivers signature experiences "
                    "across Bangladesh.</p>"
                ),
                "features": [
                    "Award Shows",
                    "Convocation",
                    "Reunion",
                    "Fashion Show",
                    "Music Concert",
                    "Laser Show",
                    "Sports Management",
                ],
                "order": 7,
            },
            {
                "slug": "virtual-events",
                "name": "Virtual & Hybrid Events",
                "badge": "ONLINE EVENTS",
                "heading": "Virtual & Hybrid",
                "heading_highlight": "Event Production",
                "icon": "🛰️",
                "color_from": "from-teal-500",
                "color_to": "to-emerald-600",
                "summary": (
                    "Studio-grade live streaming, virtual conferences, virtual exhibitions "
                    "and hybrid event experiences."
                ),
                "body": html(pages.get("virtual_paragraphs", [])),
                "features": [
                    "Live Streaming",
                    "Virtual Conference",
                    "Virtual Exhibition",
                    "Hybrid Events",
                    "Studio Production",
                    "Virtual Networking",
                ],
                "order": 8,
            },
        ]
        for spec in specs:
            slug = spec.pop("slug")
            self.upsert(Service, {"slug": slug}, spec)

        self.seed_service_entries()
        self.stdout.write(f"· services ready ({Service.objects.count()})")

    def seed_service_entries(self):
        """Corporate events / exhibition stalls / photography entries."""
        parent = {
            "corporate-events": "corporate_events",
            "exhibition-stall-design": "exhibition_stall",
            "photography-video": "corporate_events",
        }
        for service_slug, filename in parent.items():
            service = Service.objects.get(slug=service_slug)
            for index, item in enumerate(load(f"{filename}.json"), start=1):
                images = item.get("images") or ([item.get("image")] if item.get("image") else [])
                defaults = {
                    "title": item.get("title", f"Entry {index}"),
                    "subtitle": item.get("category", ""),
                    "category": item.get("category", ""),
                    "summary": (item.get("excerpt") or item.get("description") or "")[:400],
                    "body": html((item.get("content") and [item["content"]]) or []),
                    "image_url": (images[0] if images else ""),
                    "client": item.get("author", ""),
                    "stats": [],
                    "features": [],
                    "order": index,
                    "is_published": True,
                }
                entry, _ = self.upsert(
                    ServiceEntry,
                    {"service": service, "slug": item.get("_id") or f"entry-{index}"},
                    defaults,
                )
                for img_index, url in enumerate(images):
                    if not url:
                        continue
                    self.upsert(
                        ServiceEntryImage,
                        {"entry": entry, "image_url": url},
                        {"caption": entry.title, "order": img_index},
                    )
        self.stdout.write(f"· service entries ready ({ServiceEntry.objects.count()})")

    def seed_special_events(self):
        service = Service.objects.get(slug="special-events")
        for index, item in enumerate(load("special_events.json"), start=1):
            defaults = {
                "title": item.get("title") or item["slug"].replace("-", " ").title(),
                "subtitle": item.get("hero_subtitle", ""),
                "badge": item.get("badge", ""),
                "hero_subtitle": item.get("hero_subtitle", ""),
                "category": item.get("type", ""),
                "summary": item.get("description", "")[:400],
                "body": html(item.get("intro", [])),
                "intro_title": item.get("intro_title", ""),
                "gallery_title": item.get("gallery_title", ""),
                "highlights_title": item.get("highlights_title", ""),
                "features_title": item.get("features_title", ""),
                "features": item.get("features") or item.get("services") or [],
                "highlights": item.get("highlights", []),
                "extra_sections": item.get("extra_sections", []),
                "stats": item.get("stats", []),
                "cta_title": item.get("cta_title")
                or f"Ready to Plan Your {item.get('title', 'Event')}?",
                "cta_text": item.get("cta_text")
                or "Let Ananta Events create an unforgettable experience for your guests.",
                "cta_button_label": item.get("cta_button", "Contact Us Today"),
                "cta_button_url": "/contact",
                "image_url": item.get("image", ""),
                "order": index,
            }
            entry, _ = self.upsert(
                ServiceEntry, {"service": service, "slug": item["slug"]}, defaults
            )
            for img_index, image in enumerate(item.get("gallery", [])):
                self.upsert(
                    ServiceEntryImage,
                    {"entry": entry, "image_url": image["image_url"]},
                    {"caption": image.get("title", ""), "order": img_index},
                )
        self.stdout.write(f"· special events ready ({service.serviceentry_set.count()})")

    def seed_blocks(self):
        pages = load("pages.json")

        def add(section, title, order, **extra):
            self.upsert(
                ContentBlock,
                {"section": section, "title": title},
                {"order": order, **extra},
            )

        for index, feature in enumerate(pages.get("why_choose_us", []), start=1):
            add(
                ContentBlock.Section.WHY_CHOOSE_US,
                feature["title"],
                index,
                icon=feature.get("icon", ""),
                description=feature.get("description", ""),
                value=feature.get("highlight", ""),
            )
        for index, client in enumerate(pages.get("clients", []), start=1):
            add(
                ContentBlock.Section.CLIENT,
                client["name"],
                index,
                image_url=client.get("logo", ""),
            )
        for index, city in enumerate(pages.get("cities", []), start=1):
            add(ContentBlock.Section.COVERAGE, city, index)
        for index, card in enumerate(pages.get("book_artist_cards", []), start=1):
            add(
                ContentBlock.Section.BOOK_ARTIST,
                card.get("title", f"Artist {index}"),
                index,
                description=card.get("description", ""),
            )
        for index, card in enumerate(pages.get("opportunity_cards", []), start=1):
            add(
                ContentBlock.Section.OPPORTUNITY,
                card.get("title", f"Opportunity {index}"),
                index,
                description=card.get("description", ""),
            )
        for index, item in enumerate(load("about.json").get("values", []), start=1):
            if isinstance(item, str):
                add(ContentBlock.Section.ABOUT_VALUE, item, index)
            else:
                add(
                    ContentBlock.Section.ABOUT_VALUE,
                    item.get("title") or item.get("name") or f"Value {index}",
                    index,
                    icon=item.get("icon", ""),
                    description=item.get("description", ""),
                )
        for index, stat in enumerate(load("about.json").get("stats", []), start=1):
            add(
                ContentBlock.Section.STATISTIC,
                stat.get("label", f"Stat {index}"),
                index,
                value=stat.get("number", ""),
                icon=stat.get("icon", ""),
            )
        # Virtual event features + influencer features keep their own sections.
        for index, title in enumerate(
            [
                "Live Streaming",
                "Virtual Conference",
                "Virtual Exhibition",
                "Hybrid Events",
                "Studio Production",
                "Virtual Networking",
            ],
            start=1,
        ):
            add(ContentBlock.Section.VIRTUAL_EVENT, title, index)
        for key, section in (
            ("influencer_why", ContentBlock.Section.INFLUENCER),
            ("photography", ContentBlock.Section.PHOTOGRAPHY),
        ):
            block = pages.get(key, {})
            for index, item in enumerate(block.get("items", []), start=1):
                add(
                    section,
                    item.get("title", f"Item {index}"),
                    index,
                    description=item.get("description", ""),
                )
        self.stdout.write(f"· content blocks ready ({ContentBlock.objects.count()})")

    def seed_faqs(self):
        pages = load("pages.json")
        for index, faq in enumerate(pages.get("home_faqs", []), start=1):
            question = faq.get("question") or "What is Ananta Events?"
            self.upsert(
                FAQ,
                {"question": question, "section": FAQ.Section.HOME},
                {"answer": faq.get("answer", ""), "order": index},
            )
        for index, faq in enumerate(pages.get("corporate_faqs", []), start=1):
            question = faq.get("question") or "Do you organise corporate events?"
            self.upsert(
                FAQ,
                {"question": question, "section": FAQ.Section.CORPORATE},
                {"answer": faq.get("answer", ""), "order": index},
            )
        show_specs = [
            ("What does an event management company in Bangladesh do?", FAQ.Section.GENERAL),
            ("Which cities do you cover?", FAQ.Section.GENERAL),
            ("How do we start planning an event with Ananta Events?", FAQ.Section.GENERAL),
        ]
        answers = [
            "An event management company plans, designs and executes events end to end — venue, "
            "décor, technical production, entertainment, guest management and on-site coordination.",
            "We are based in Dhaka and deliver events nationwide: Chattogram, Sylhet, Cox's Bazar, "
            "Khulna, Rajshahi, Cumilla, Barishal, Rangpur and Mymensingh.",
            "Send us your requirement through the contact form. We share a proposal and budget "
            "within two working days, then handle everything from design to execution.",
        ]
        for index, ((question, section), answer) in enumerate(
            zip(show_specs, answers, strict=True), start=50
        ):
            self.upsert(
                FAQ, {"question": question, "section": section}, {"answer": answer, "order": index}
            )
        self.stdout.write(f"· FAQs ready ({FAQ.objects.count()})")

    def seed_artists(self):
        mapping = [
            ("artists_singers.json", "singer", True),
            ("artists_djs.json", "dj", False),
            ("artists_comedians.json", "comedian", False),
            ("artists_magicians.json", "magician", False),
            ("artists_dancers.json", "dancer", False),
            ("artists_choreographers.json", "dancer", False),
        ]
        for filename, category, _wrapped in mapping:
            data = load(filename)
            items = data.get("singers") if isinstance(data, dict) else data
            for index, item in enumerate(items or [], start=1):
                name = item.get("name") or f"Artist {index}"
                defaults = {
                    "category": category,
                    "country": item.get("country", "Bangladesh"),
                    "city": item.get("city", "Dhaka"),
                    "bio": item.get("bio") or item.get("description") or item.get("fullBio") or "",
                    "genre": item.get("genre", ""),
                    "styles": item.get("styles")
                    or item.get("genres")
                    or item.get("dance_styles")
                    or item.get("specialties")
                    or [],
                    "famous_for": item.get("famous_for", ""),
                    "famous_show": item.get("famous_show", ""),
                    "experience_years": item.get("experience_years"),
                    "rating": item.get("rating"),
                    "price": item.get("price", ""),
                    "availability": item.get("availability", "Available"),
                    "languages": item.get("languages", []),
                    "popular_songs": item.get("popularSongs") or item.get("popular_songs") or [],
                    "achievements": item.get("achievements")
                    or item.get("awards")
                    or item.get("notable_specials")
                    or [],
                    "media_presence": item.get("media_presence", ""),
                    "social_followers": item.get("social_followers", ""),
                    "contact_email": item.get("contactEmail", ""),
                    "image_url": item.get("image", ""),
                    "video_url": item.get("videoUrl", ""),
                    "order": index,
                }
                self.upsert(Artist, {"name": name, "category": category}, defaults)
        self.stdout.write(f"· artists ready ({Artist.objects.count()})")

    def seed_influencers(self):
        influencers = [
            (
                "Rafiath Rashid Mithila",
                "@mithila",
                "Instagram",
                "1.4M",
                "3.8%",
                "Actor & Presenter",
            ),
            ("Salman Muqtadir", "@salmanmuqtadir", "Instagram", "2.1M", "4.1%", "Creator & Actor"),
            ("Nabela Noor", "@nabela", "YouTube", "1.9M", "5.2%", "Lifestyle"),
            ("Tawhid Afridi", "@tawhidafridi", "Facebook", "8.4M", "2.6%", "Comedy & Food"),
            ("Marzia Prince", "@marzia", "YouTube", "2.3M", "3.1%", "Beauty & Travel"),
        ]
        for index, (name, handle, platform, followers, engagement, niche) in enumerate(
            influencers, 1
        ):
            self.upsert(
                InfluencerProfile,
                {"name": name},
                {
                    "handle": handle,
                    "platform": platform,
                    "followers": followers,
                    "engagement_rate": engagement,
                    "niche": niche,
                    "order": index,
                    "is_featured": index <= 3,
                },
            )
        self.stdout.write(f"· influencers ready ({InfluencerProfile.objects.count()})")

    def seed_testimonials(self):
        for index, item in enumerate(load("testimonials.json"), start=1):
            self.upsert(
                Testimonial,
                {"name": item.get("name", f"Client {index}")},
                {
                    "designation": item.get("designation", ""),
                    "company": item.get("company", ""),
                    "rating": item.get("rating", 5),
                    "review": item.get("review", ""),
                    "image_url": item.get("image", ""),
                    "order": index,
                },
            )
        self.stdout.write(f"· testimonials ready ({Testimonial.objects.count()})")

    def seed_team(self):
        for index, member in enumerate(load("about.json").get("team", []), start=1):
            self.upsert(
                TeamMember,
                {"name": member.get("name", f"Member {index}")},
                {
                    "role": member.get("role", "Team member"),
                    "description": member.get("description", ""),
                    "image_url": member.get("image", ""),
                    "order": index,
                },
            )
        self.stdout.write(f"· team ready ({TeamMember.objects.count()})")

    def seed_gallery(self):
        for index, item in enumerate(load("gallery.json"), start=1):
            self.upsert(
                GalleryImage,
                {"image_url": item.get("src", ""), "title": item.get("title", "")},
                {
                    "album": item.get("category", "events"),
                    "caption": item.get("caption", ""),
                    "order": index,
                },
            )
        self.stdout.write(f"· gallery ready ({GalleryImage.objects.count()})")

    def seed_videos(self):
        pages = load("pages.json")
        for index, item in enumerate(pages.get("virtual_videos", []), start=1):
            url = item.get("url", "")
            if "/embed/" in url:
                url = url.replace("/embed/", "/watch?v=")
            self.upsert(
                Video,
                {"title": item.get("title", f"Video {index}")},
                {
                    "youtube_url": url,
                    "description": item.get("description", ""),
                    "category": "virtual-events",
                    "order": index,
                },
            )
        for index, item in enumerate(pages.get("virtual_gallery", []), start=20):
            self.upsert(
                GalleryImage,
                {"image_url": item.get("url", "")},
                {"title": item.get("title", ""), "album": "virtual-events", "order": index},
            )
        self.stdout.write(f"· videos ready ({Video.objects.count()})")

    def seed_blogs(self):
        merged: dict[str, dict] = {}
        for filename in ("blogs.json", "blog_full.json"):
            for item in load(filename):
                key = item.get("_id") or item.get("id") or item.get("title")
                merged.setdefault(key, {})
                merged[key].update({k: v for k, v in item.items() if v})
        for index, item in enumerate(merged.values(), start=1):
            title = item.get("title", f"Blog post {index}")
            content = item.get("content", "")
            if "<" not in content:
                content = html([p.strip() for p in content.split("\n") if p.strip()])
            self.upsert(
                BlogPost,
                {"slug": item.get("_id") or f"blog-{index}"},
                {
                    "title": title,
                    "category": item.get("category", ""),
                    "excerpt": (item.get("excerpt") or "")[:500],
                    "content": content,
                    "author_name": item.get("author", "Ananta Events"),
                    "image_url": item.get("image", ""),
                    "is_featured": bool(item.get("featured")),
                    "is_published": True,
                    "tags": item.get("tags", []),
                    "read_minutes": _minutes(item.get("readTime")),
                },
            )
        self.stdout.write(f"· blog posts ready ({BlogPost.objects.count()})")

    def seed_portfolio(self):
        items = [
            {
                "slug": "iscea-night-2024",
                "title": "ISCEEA Annual Night 2024",
                "client": "ISCEEA",
                "category": "Corporate",
                "description": "Annual gala night with stage production, awards and live music.",
                "image_url": "https://www.anantabd.net/wp-content/uploads/2020/01/iscea-night-10.jpg",
            },
            {
                "slug": "fashion-show-bangladesh",
                "title": "Bangladesh Fashion Week Showcase",
                "client": "Fashion Council",
                "category": "Fashion Show",
                "description": "Runway production with lighting design, model management and press wall.",
                "image_url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200",
            },
            {
                "slug": "corporate-product-launch",
                "title": "National Product Launch",
                "client": "FMCG Client",
                "category": "Product Launch",
                "description": "Brand activation, press conference and dealer meet under one roof.",
                "image_url": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200",
            },
            {
                "slug": "exhibition-stall-build",
                "title": "International Trade Fair Stall",
                "client": "Export House",
                "category": "Exhibition",
                "description": "Custom double-decker stall fabrication and on-site management.",
                "image_url": "https://images.unsplash.com/photo-1540575467063-178f50002cbc?w=1200",
            },
            {
                "slug": "music-concert-dhaka",
                "title": "Dhaka Live Music Concert",
                "client": "Open-air concert",
                "category": "Concert",
                "description": "Stage, sound, lighting, ticketing and crowd management for 8,000 guests.",
                "image_url": "https://www.anantabd.net/wp-content/uploads/2025/07/SPG01829-768x512.jpg",
            },
            {
                "slug": "wedding-destination",
                "title": "Destination Wedding, Cox's Bazar",
                "client": "Private client",
                "category": "Wedding",
                "description": "Three-day destination wedding with décor, catering and entertainment.",
                "image_url": "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1200",
            },
        ]
        for index, item in enumerate(items, start=1):
            slug = item.pop("slug")
            self.upsert(
                PortfolioItem, {"slug": slug}, {"order": index, "is_featured": index <= 3, **item}
            )
        self.stdout.write(f"· portfolio ready ({PortfolioItem.objects.count()})")

    def seed_jobs(self):
        jobs = [
            {
                "slug": "senior-event-executive",
                "title": "Senior Event Executive",
                "department": "Operations",
                "location": "Dhaka, Bangladesh",
                "employment_type": "full_time",
                "experience": "3-5 years",
                "salary": "Negotiable",
                "description": "<p>Lead corporate event execution from planning to on-site delivery.</p>",
                "requirements": [
                    "3+ years in event management",
                    "Strong vendor network in Dhaka",
                    "Excellent communication in Bangla and English",
                ],
                "responsibilities": [
                    "Own event budgets and timelines",
                    "Coordinate vendors and crew",
                    "Report to the operations manager",
                ],
                "vacancies": 2,
                "order": 1,
            },
            {
                "slug": "graphic-designer",
                "title": "Graphic Designer (Events & Branding)",
                "department": "Creative",
                "location": "Dhaka, Bangladesh",
                "employment_type": "full_time",
                "experience": "2+ years",
                "salary": "Negotiable",
                "description": "<p>Design event branding, stalls, stage backdrops and campaign creatives.</p>",
                "requirements": ["Adobe Illustrator & Photoshop", "3D visualisation is a plus"],
                "responsibilities": [
                    "Deliver event creative assets",
                    "Coordinate with printers and fabricators",
                ],
                "vacancies": 1,
                "order": 2,
            },
            {
                "slug": "photographer-videographer",
                "title": "Photographer / Videographer",
                "department": "Media",
                "location": "Dhaka / nationwide",
                "employment_type": "freelance",
                "experience": "1+ years",
                "salary": "Per project",
                "description": "<p>Cover corporate events, concerts and weddings with photo and video teams.</p>",
                "requirements": ["Own camera kit", "Available on weekends"],
                "responsibilities": [
                    "Shoot assigned events",
                    "Deliver edited assets within 5 working days",
                ],
                "vacancies": 3,
                "order": 3,
            },
        ]
        for job in jobs:
            slug = job.pop("slug")
            self.upsert(JobPosting, {"slug": slug}, {**job, "is_published": True})
        self.stdout.write(f"· job postings ready ({JobPosting.objects.count()})")

    def seed_talent_showcase(self):
        """Talent-hunt showcase entries become featured artists (category 'other' → singer)."""
        talents = load("talent_hunt.json").get("talents", [])
        for index, talent in enumerate(talents, start=1):
            name = talent.get("name", f"Talent {index}")
            category = (talent.get("category") or "singer").lower()
            if category not in {"singer", "dj", "comedian", "magician", "dancer"}:
                category = "singer"
            self.upsert(
                Artist,
                {"name": name, "category": category},
                {
                    "bio": talent.get("fullBio") or talent.get("bio", ""),
                    "genre": talent.get("category", ""),
                    "city": talent.get("location", "Dhaka"),
                    "rating": talent.get("rating"),
                    "price": talent.get("price", ""),
                    "achievements": talent.get("achievements", []),
                    "video_url": (talent.get("videoUrl") or "").replace("/embed/", "/watch?v="),
                    "instagram": talent.get("instagram", ""),
                    "website": talent.get("portfolio", ""),
                    "is_featured": True,
                    "order": 100 + index,
                },
            )
        self.stdout.write(
            f"· talent showcase ready ({Artist.objects.filter(is_featured=True).count()} featured)"
        )
