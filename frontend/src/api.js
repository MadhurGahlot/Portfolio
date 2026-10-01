import {
  CERTIFICATES,
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_PROJECTS,
  EDUCATION
} from "./data.js";

export function fetchCategories() {
  return PORTFOLIO_CATEGORIES;
}

export function fetchEducation() {
  return EDUCATION;
}

export function fetchProjects(category = "all") {
  if (category === "all") {
    return PORTFOLIO_PROJECTS;
  }

  return PORTFOLIO_PROJECTS.filter(
    (project) => project.category === category
  );
}

export function fetchProjectBySlug(slug) {
  return (
    PORTFOLIO_PROJECTS.find(
      (project) => project.slug === slug
    ) || null
  );
}

export function fetchCertificates() {
  return CERTIFICATES;
}

export function submitContact(payload) {
  const subject = encodeURIComponent(
    `Portfolio enquiry from ${payload.name}`
  );

  const body = encodeURIComponent(
    `Name: ${payload.name}
Email: ${payload.email}
Service: ${payload.service}
Budget: ${payload.budget}

${payload.message}`
  );

  window.location.href =
    `mailto:madhurgahlot20@gmail.com?subject=${subject}&body=${body}`;

  return {
    message: "Your email application is opening.",
  };
}
