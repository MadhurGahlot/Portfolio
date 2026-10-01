export const PORTFOLIO_CATEGORIES = [
  { id: "all", name: "All Works" },
  { id: "AI/ML", name: "AI & ML Tool" },
  { id: "Backend", name: "Backend Development" },
  { id: "Cpp", name: "C++ & Graphics" },
  { id: "Intergration", name: "Backend & Integration" },
];

export const PORTFOLIO_PROJECTS = [
  {
    id: "1",
    slug: "reflect-ai",
    title: "REFLECT AI",
    subtitle: "AI-Powered Personal Diary Workspace",
    category: "AI/ML",
    category_name: "Artificial Intelligence",
    year: "2026",
    client: "Open for All",
    role: "Full-Stack Developer & AI Integration",
    hero_image: "/Reflectai2.png",
    cover_aspect: "wide",
    github_url: "https://github.com/MadhurGahlot/reflectai",
    live_url: " ",
    description : [ "REFLECT AI is a secure, AI-powered personal journaling workspace designed to help users reflect ",
         " understand their thoughts, and turn journal entries into meaningful insights. The application combines ",
           " Google authentication, Cloud Firestore, Gemini AI ",
          "  multi-turn conversations, AI-generated summaries ",
         " and personalized reflection workflows in a private user-focused environment." ],

    details: [
            "Built a secure authenticated journaling workspace using Firebase Authentication and Google Sign-In.",
        "Integrated Google Gemini through a server-side proxy to keep AI credentials protected from the client.",
        "Implemented AI-generated journal summaries, key takeaways, deep reflection, brainstorming, and action-step assistance.",
        "Used Cloud Firestore with owner-bound security rules to isolate each user's journals and conversations.",
        "Added persistent multi-turn AI conversations so users can continue reflection threads with contextual follow-up questions.",
        "Implemented journal history, search, tag filtering, Markdown export, deletion, profile management, and image upload.",
        "Designed defense-in-depth protections against prompt injection, unauthorized data access, API key exposure, and unsafe tool execution.",
        "Deployed the application using Google Cloud Run and Google Cloud Secret Manager."
        ],
    gallery: ["/Reflectai2.png", "/Reflectai1.png"],
  },

  {
    id: "2",
    slug: "grade-book",
    title: "Grade Book",
    subtitle: "AI-Based Assignment Similarity, Handwritten OCR & Automated Grading",
    category: "AI/ML",
    category_name: "Artificial Intelligence",
    year: "2026",
    client: "Academic Project",
    role: "Backend & AI Developer",
    hero_image: "/Gradebook/gd1.webp",
    cover_aspect: "wide",
    github_url: "https://github.com/MadhurGahlot/BCE-P663",
    live_url: "",
    description:
      "A FastAPI-based academic system designed to detect similarity between student assignments, including handwritten PDF submissions. The system combines PDF processing, handwritten OCR, semantic similarity detection, JWT authentication, assignment management, submission handling, and automated grading into a unified platform..",
    details: [
      "Built the backend using FastAPI, Uvicorn and Pydantic.",
        "Implemented JWT-based user authentication and secure API access.",
        "Added assignment management and PDF submission workflows.",
        "Implemented handwritten assignment processing using TrOCR.",
        "Converted handwritten PDF pages into images for OCR processing.",
        "Used Sentence Transformers to generate embeddings for semantic similarity detection.",
        "Implemented an automated grading system.",
        "Organized AI, OCR and similarity functionality into dedicated backend modules.",
        "Integrated Swagger UI for interactive API documentation and endpoint testing.",
        "Designed the system with separate backend, frontend, AI, similarity-engine and utility modules.",
    ],
    gallery: [
      "/Gradebook/gd2.webp",
      "/Gradebook/gd3.webp",
      "/Gradebook/gd4.webp",
      "/Gradebook/gd5.webp",
    ],
  },

  {
    id: "3",
    slug: "eeye",
    title: "EEYE",
    subtitle: "Software-Based Radar",
    category: "Cpp",
    category_name: "C++ & Graphics",
    year: "2026",
    client: "College Project",
    role: "C++ & Computer Graphics Developer",
    hero_image: "/EEye/eeye1.png",
    cover_aspect: "square",
    github_url: "https://github.com/MadhurGahlot/EEYE",
    live_url: "",
    description: [
      "EEYE (Electronic Eye) is a software-based air-surveillance radar ",
        "simulation developed using C++ and Raylib. The project recreates ",
        "the visual interface and workflow of a radar command center ",
        "through real-time graphics and modular software architecture.", ] ,
    details: [
      "Built the radar engine using C++ and Raylib.",
        "Implemented a real-time radar sweep animation.",
        "Designed radar grid and range rings for spatial visualization.",
        "Created a military-style radar command-center interface.",
        "Developed a modular C++ project architecture.",
        "Currently expanding the simulation with target visualization",
        " radar animations and dynamic status information."
    ],
    gallery: ["/EEye/eeye1.png",
        "https://images.openai.com/static-rsc-4/PLZeVzoAJMRMAWVDcuT_M9nYtFe3PxV3xS_Ltz-WFFXMeR5honoH3reUV1gMgOMiK3Lz0ntgB9aKN7M0k2mPj5Wgfd3V3-PQcrqeBVvTcm_dZffN9OTIHULothxJGje5oAZ6YXdPI47sn6AOUnEJ_-hjN-fw47ka7qNl0dSzclE?purpose=inline",
        "https://images.openai.com/static-rsc-4/Xj86g-5-nDyM6e_R9A0A_2HSBsrQJMkA3CTF7tCR9JuBTfLxzikGGOVoVQcnhlZpr9P24DfKmNWpZ58YMt7tbX9R37iUR_ETVnF__41Lb68Mep5L7ohjzTvtMqzw_YiBoU5jYLy3ImzFIVYb19VHpxrbLZmCWxxURPqHWod_ErrKmhRg5gTHzvsbj4_UxvjZ?purpose=fullsize",
        "https://images.openai.com/static-rsc-4/uFO40TnjX_EPBmAo7SxeAgGgd9J4ldLZsq375iHQVd-yRZobvoc1YIlC3fmsDnBrahxtDjI3dBGQKNcpg09Q89_f0yJkhej5JLES38YR6jn71rtFM7aC4Hceo0_t0O2Pdl3L3V3UbokwvDloqGEmLI3inZgE0XfoiLosxG-zHrqBGiiJcyK30dtEYWyav5Vn?purpose=fullsize"

    ],
  },
];

export const CERTIFICATES = [
     {
        "id": "cpp-programming",
        "title": "C++ Programming",
        "issuer": "Codsoft",
        "date": "2025",
        "image": "/certificates/c6.webp",
        "credential_url": "https://drive.google.com/file/d/1ZxCA0XTTcv8puXZtP6kZA4I-7Qs8lV1Y/view",
    },
     {
        "id": "Python",
        "title": "Problem solving using python",
        "issuer": "Hackerrank",
        "date": "2025",
        "image": "/certificates/c4.webp",
        "credential_url": "https://www.hackerrank.com/certificates/1869569b0482",
    },
    {
        "id": "NPTEL",
        "title": "Computer Architecture",
        "issuer": "NPTEL",
        "date": "NOV 2024",
        "image": "/certificates/c10.webp",
        "credential_url": "",

    },
   {
        "id": "Machine Learing",
        "title": "Machine Learning Using Python",
        "issuer": "Simplilearn",
        "date": "19 Jan 2026",
        "image": "/certificates/c7.webp",
        "credential_url": "",
 },
   { 
         "id": "Cloud Computing",
         "title": "Cloud Computing Fundamentals",
         "issuer": "IBMSKILLSBUILD",
         "date": "28 AUG 2025",
         "image" : "/certificates/c2.webp",
         "credential_url": "https://www.credly.com/badges/7a7f71d4-bfe0-47ba-9c43-ea58d93c0dc3/public_url",
  },
   {
        "id": "Mysql",
        "title": "Problem Solving Using the MYSQL",
        "issuer": "HackerRank",
        "date": "2025",
        "image": "/certificates/c5.webp",
        "credential_url": "https://www.hackerrank.com/certificates/5d589d893ce9",
    },
 {
        "id": "Pandas",
        "title": "Pandas",
        "issuer": "Kaggle",
        "date": "2026",
        "image": "/certificates/c8.webp",
        "credential_url": "https://www.kaggle.com/learn/certification/madhurgahlot/pandas",
    },
    {
      "id" : "AI/ML",
      "title" : " Get Started With Artifical Intelligence ",
      "issuer" : "IBMSKILLSBUILD",
      "date" : "10 SEP 2025",
      "image" : "/certificates/c1.webp",
      "credential_url" : "https://www.credly.com/badges/a1f4fa0c-b30c-4492-9924-44833f9276dc/public_url"
  },
  {
    "id" : "Mysql",
    "title" : "Problem Solving Using the MYSQL(Intermidate)" ,
    "issuer" : "HackerRank ",
    "date" : "27-09-2026",
    "image" : "/certificates/c9.webp",
    "credential_url" : "https://www.hackerrank.com/certificates/cc090689b092"
  },
   {
    "id" : "EXCEL",
    "title" : "MICROSOFT EXCEL BASIC TO ADVANCE" ,
    "issuer" : "SKILLCOURSE ",
    "date" : "29-09-2026",
    "image" : "/certificates/C11.webp",
    "credential_url" : "https://edu.skillcourse.in/view-certificate/SC-0Y9LQ0JED0"
  },
];

export const EDUCATION = [

 {
  id: "HIGH SCHOOL",
  year: "2021",
  month: "April",
  title: "HIGH SCHOOL (Class 10th)",
  institution: "Uttar Pradesh Madhyamik Shiksha Parishad (UP Board)",
  location: "Uttar Pradesh, India",
  description:
    "Completed HIGHSCHOOL (Class 10th) with 86% from the Uttar Pradesh Board, building a strong foundation in academics .",
  tags: ["Class 10th", "UP Board", "86%", "Science","MATHS","SOCIAL SCIENCE","HINDI","ENGLISH","DRAWING"],
  side: "top",
},
{
  id: "Intermediate",
  year: "2023",
  month: "April",
  title: "Intermediate (Class 12th)",
  institution: "Uttar Pradesh Madhyamik Shiksha Parishad (UP Board)",
  location: "Uttar Pradesh, India",
  description:
    "Completed Intermediate (Class 12th) with 86% from the Uttar Pradesh Board, building a strong foundation in academics and preparing for higher studies in Computer Science.",
  tags: ["Class 12th", "UP Board", "81%", "Science","Physics",],
  side: "bottom",
},

  {
    id: "edu-2027",
    year: "2027",
    month: "EXPECTED",
    title: "B.Tech Graduation",
    institution: "Gurukula Kangri Vishwavidyalaya",
    location: "Haridwar, Uttarakhand",
    description:
      "Expected completion of my B.Tech in Computer Science & Engineering and transition into a software engineering or AI/ML engineering role.",
    tags: ["Graduation", "Career", "AI/ML"],
    side: "top",
  },
];