# backend/data.py

PORTFOLIO_CATEGORIES = [
    {"id": "all", "name": "All Works"},
    {"id": "AI/ML", "name": "AI & ML Tool"},
    {"id": "Backend", "name": "Backend Develoment"},
    {"id": "Cpp", "name": "Cpp & Graphics"},
    {"id": "Intergration", "name": "Backend & Intergration"},
]

PORTFOLIO_PROJECTS = [
    {
        "id": "1",
        "slug": "reflect-ai",
        "title": "REFLECT AI ",
        "subtitle": " AI-Powered Personal Diary  Workspace",
        "category": "AI/ML",
        "category_name": "Artifical Intelligence",
        "year": "2026",
        "client": "OPEN FOR ALL ",
        "role": "Full-Stack Developer & AI Integration",
        "hero_image": "Reflectai2.png",
        "cover_aspect": "wide",
        "featured": True,
        "github_url": "https://github.com/MadhurGahlot/reflectai",
        "live_url": "https://rreflectai.ai.studio",
        "description": """REFLECT AI is a secure, AI-powered personal journaling workspace designed to help users reflect,
          understand their thoughts, and turn journal entries into meaningful insights. The application combines
            Google authentication, Cloud Firestore, Gemini AI,
            multi-turn conversations, AI-generated summaries,
          and personalized reflection workflows in a private user-focused environment.""",
        "details": [
            "Built a secure authenticated journaling workspace using Firebase Authentication and Google Sign-In.",
        "Integrated Google Gemini through a server-side proxy to keep AI credentials protected from the client.",
        "Implemented AI-generated journal summaries, key takeaways, deep reflection, brainstorming, and action-step assistance.",
        "Used Cloud Firestore with owner-bound security rules to isolate each user's journals and conversations.",
        "Added persistent multi-turn AI conversations so users can continue reflection threads with contextual follow-up questions.",
        "Implemented journal history, search, tag filtering, Markdown export, deletion, profile management, and image upload.",
        "Designed defense-in-depth protections against prompt injection, unauthorized data access, API key exposure, and unsafe tool execution.",
        "Deployed the application using Google Cloud Run and Google Cloud Secret Manager."
        ],
        "gallery": [
            "/Reflectai2.png",
            "/Reflectai1.png",
            "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200"
        ]
    },
    {
        "id": "2",
        "slug": "Pilgrim Detector",
        "title": "Grade Book",
        "subtitle": "AI-Based Assignment Similarity, Handwritten OCR & Automated Grading",
        "category": "AI/ML",
        "category_name": "Artificial Intelligence",
        "year": "2026",
        "client": "Academic Project",
        "role": "Backend & AI Developer",
        "hero_image": "/Gradebook/gd1.webp",
        "cover_aspect": "wide",
        "featured": True,
        "github_url": "https://github.com/MadhurGahlot/BCE-P663",
        "live_url": "/",
        "description": "A FastAPI-based academic system designed to detect similarity between student assignments, including handwritten PDF submissions. The system combines PDF processing, handwritten OCR, semantic similarity detection, JWT authentication, assignment management, submission handling, and automated grading into a unified platform.",
        "details": [
          "Built the backend using FastAPI, Uvicorn and Pydantic.",
        "Implemented JWT-based user authentication and secure API access.",
        "Added assignment management and PDF submission workflows.",
        "Implemented handwritten assignment processing using TrOCR.",
        "Converted handwritten PDF pages into images for OCR processing.",
        "Used Sentence Transformers to generate embeddings for semantic similarity detection.",
        "Implemented an automated grading system.",
        "Organized AI, OCR and similarity functionality into dedicated backend modules.",
        "Integrated Swagger UI for interactive API documentation and endpoint testing.",
        "Designed the system with separate backend, frontend, AI, similarity-engine and utility modules."
        ],
        "gallery": [
                 "Gradebook/gd2.webp",
                 "Gradebook/gd3.webp",
                 "Gradebook/gd4.webp",
                 "Gradebook/gd5.webp"
            
        ]
    },
    {
        "id": "3",
        "slug": "eeye",
        "title": "EEYE",
        "subtitle": "EEYE — Software-Based  Radar",
        "category": "Cpp",
        "category_name": "C++ & Graphics",
        "year": "2026",
        "client": "College Project",
        "role": "C++ & Computer Graphics Developer",
        "hero_image": "/EEye/eeye1.png",
        "cover_aspect": "square",
        "featured": True,
        "github_url": "https://github.com/MadhurGahlot/EEYE",
        "live_url": "/",
        "description": "EEYE (Electronic Eye) is a software-based air-surveillance radar "
        "simulation developed using C++ and Raylib. The project recreates "
        "the visual interface and workflow of a radar command center "
        "through real-time graphics and modular software architecture.",
        "details": [
             "Built the radar engine using C++ and Raylib.",
        "Implemented a real-time radar sweep animation.",
        "Designed radar grid and range rings for spatial visualization.",
        "Created a military-style radar command-center interface.",
        "Developed a modular C++ project architecture.",
        "Currently expanding the simulation with target visualization,"
        " radar animations and dynamic status information."
        ],
        "gallery": [
            "/EEye/eeye1.png",
            ""
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200"
        ]
    },
    {
        "id": "4",
        "slug": "aura-pavilion",
        "title": "Aura Pavilion",
        "subtitle": "Exhibition Design & Spatial Curation",
        "category": "spatial",
        "category_name": "Spatial & Exhibition",
        "year": "2026",
        "client": "Milano Design Week",
        "role": "Spatial Curator & Designer",
        "hero_image": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200",
        "cover_aspect": "tall",
        "featured": False,
        "github_url": "/",
        "live_url": "/",
        "description": "Immersive exhibition design utilizing ambient acoustic diffusion, translucent silk partitions, and directional light sculptures.",
        "details": [
            "Designed for Milan Design Week installation at Palazzo Clerici.",
            "Integrated circular lighting systems that shift temperature with visitor proximity.",
            "Constructed entirely from recycled aluminum and biodegradable polymer."
        ],
        "gallery": [
            "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=1200"
        ]
    },
    {
        "id": "5",
        "slug": "nordic-horizon-journal",
        "title": "Nordic Horizon",
        "subtitle": "Publication & Editorial Design",
        "category": "editorial",
        "category_name": "Editorial",
        "year": "2025",
        "client": "Kinfolk Studio",
        "role": "Art Director",
        "hero_image": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200",
        "cover_aspect": "wide",
        "featured": False,
        "description": "A 240-page hardcover publication celebrating craft, slow living, and organic design philosophies from Iceland to Finland.",
        "details": [
            "Curated over 40 interviews with master craftsmen and contemporary designers.",
            "Printed on 150gsm uncoated Munken Kristall paper with linen binding.",
            "Awarded Best Editorial Design at European Design Awards 2025."
        ],
        "gallery": [
            "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1200"
        ]
    },
    {
        "id": "6",
        "slug": "botanical-synth-packaging",
        "title": "Botanical Synth",
        "subtitle": "Sustainable Luxury Packaging",
        "category": "branding",
        "category_name": "Branding & Identity",
        "year": "2026",
        "client": "Aesop Lab",
        "role": "Packaging Designer",
        "hero_image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200",
        "cover_aspect": "square",
        "featured": True,
        "description": "Glass packaging and zero-waste outer boxing for an organic bio-fermented skincare line.",
        "details": [
            "Amber glass bottles with laser-engraved typography to eliminate paper stickers.",
            "Molded hemp pulp outer protection shell.",
            "Refined minimalist color hierarchy."
        ],
        "gallery": [
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=1200"
        ]
    }
]

CERTIFICATES = [
    {
        "id": "Pandas",
        "title": "Pandas",
        "issuer": "Kaggle",
        "date": "2026",
        "image": "https://media.licdn.com/dms/image/v2/D5622AQG_a328kv9idQ/feedshare-image-high-res/B56Z_cCkIDHIAU-/0/1786103088346?e=1790812800&v=beta&t=uVaAZjwtX10itAykG6_9nO_3nB0YJr9N9SFHJiz3ssA",
        "credential_url": "https://www.kaggle.com/learn/certification/madhurgahlot/pandas",
    },
    {
        "id": "Mysql",
        "title": "Problem Solving Using the MYSQL",
        "issuer": "HackerRank",
        "date": "2025",
        "image": "https://media.licdn.com/dms/image/v2/D562DAQHxWPBMlQe_uQ/profile-treasury-document-images_1280/B56ZrOh_RVI4AU-/1/1764401622163?e=1790208000&v=beta&t=BMt0sGDmORD42YDciBgdSOLGvJ2HC-QZ2U_G8_d8xM4",
        "credential_url": "https://www.hackerrank.com/certificates/5d589d893ce9",
    },
    {
        "id": "cpp-programming",
        "title": "C++ Programming",
        "issuer": "Codsoft",
        "date": "2025",
        "image": "https://media.licdn.com/dms/image/v2/D562DAQFgohDjR8Szxg/profile-treasury-image-shrink_8192_8192/B56ZrOkfzfIYAg-/0/1764402266571?e=1789657200&v=beta&t=e6OxNulq7paKj0IfsjqQ1hvq8QKj6LEMXWQKyIWZqKk",
        "credential_url": "https://drive.google.com/file/d/1ZxCA0XTTcv8puXZtP6kZA4I-7Qs8lV1Y/view",
    },
    {
        "id": "Python",
        "title": "Problem solving using python",
        "issuer": "Hackerrank",
        "date": "2025",
        "image": "https://media.licdn.com/dms/image/v2/D562DAQHw0aBERED2cA/profile-treasury-document-images_1280/B56ZrOjJisJ8AU-/1/1764401925862?e=1790208000&v=beta&t=H7-BwGXKvOxzXK1WVidPathDBx1zmbhceTYlHWfPKb0",
        "credential_url": "https://www.hackerrank.com/certificates/1869569b0482",
    },

    {
        "id": "NPTEL",
        "title": "Computer Architecture",
        "issuer": "NPTEL",
        "date": "NOV 2024",
        "image": "https://media.licdn.com/dms/image/v2/D5622AQEnJaytMLOAzw/feedshare-shrink_800/feedshare-shrink_800/0/1732463329747?e=1790812800&v=beta&t=BT451viOOBkN9S2YRoHUR115ViXbzmDOAX6WmmbGqgw",
        "credential_url": "",

    },

    {
        "id": "Machine Learing",
        "title": "Machine Learning Using Python",
        "issuer": "Simplilearn",
        "date": "19 Jan 2026",
        "image": "https://media.licdn.com/dms/image/v2/D561FAQG08CR2cQRwEg/feedshare-document-images_1920/B56ZvXHm1HKwAs-/1/1768840656223?e=1790208000&v=beta&t=ukAjEfG7IdLnWpiFxDSvlrz2dcc7ZTOQvHrOmcC7XUE",
        "credential_url": "",
 }
    
        
]

CONTACT_MESSAGES = []
