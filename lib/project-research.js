const gmda = "https://onemapdepts.gmda.gov.in/gmda/planning/";
const officialSearch = "https://haryanarera.gov.in/assistancecontrol/project_search_public/1";

export const researchProjects = [
  {
    name: "Godrej Aristocrat",
    aliases: ["Aristocrat"],
    sectors: ["49"],
    developer: "Godrej Properties Ltd",
    registration: "GGM/767/499/2023/111",
    record: "https://haryanarera.gov.in/view_project/searchprojectDetail/2670",
    certificate: "https://haryanarera.gov.in/view_project/view_certificate/MTYxMg%3D%3D",
    developerPage: "https://www.godrejproperties.com/gurugram/residential/godrej-aristocrat",
    advertisedStartingPrice: 61300000,
    thesis: "Worth shortlisting for a longer-horizon residential investment if the all-in quote is competitive with similar units and you can fund the construction-period instalments without rental income.",
    facts: "Haryana RERA identifies a group housing project in Sector 49. The registration certificate records 31 December 2030 as the promoter’s declared completion date, subject to extension. Confirm the latest filings and the possession date in the agreement for your unit.",
    location: "Godrej lists Golf Course Extension Road, St. Xavier’s High School and Worldmark Mall in its neighbourhood material. These are places to map from the actual gate. Use GMDA’s planning map to check the road network, then test the commute to your tenant’s likely office hub at peak hours.",
    strengths: [
      "The public registration and certificate give you a starting point for checking the project and its delivery schedule.",
      "If a prospective tenant works along Golf Course Extension Road, the Sector 49 location may suit their commute. Compare it with occupied buildings serving the same work location."
    ],
    risks: [
      ["Delivery and cash flow", "A unit still under construction generates no rent. Ask for the instalment schedule and test a one-year delay before judging the return."],
      ["Premium and resale", "An expensive entry price can make it harder to resell or earn enough rent. Compare the full quote per carpet sq ft against equivalent units and ask how long comparable resale listings have been on the market."],
      ["Access and operating costs", "Inspect the approach road after rain and at peak traffic. Confirm maintenance charges and what amenities or parking cost extra."]
    ]
  },
  {
    name: "Sobha Crescent Phase 1",
    aliases: ["Sobha Crescent"],
    sectors: ["63a"],
    developer: "Sobha Limited",
    registration: "GGM/1054/786/2026/26",
    record: "https://haryanarera.gov.in/view_project/searchprojectDetail/3992",
    thesis: "Worth comparing if Sector 63A fits the intended tenant’s commute and the unit’s total cost and payment schedule are competitive with alternatives.",
    facts: "Haryana RERA identifies Phase 1 in Sector 63A, Village Behrampur, and records that its registration certificate was uploaded. Check that the quoted unit belongs to this phase and ask for the latest construction filings.",
    location: "Map the route from the actual gate to the office or school your target tenant uses. Check peak-hour access and locate occupied societies for rental evidence.",
    strengths: [
      "The public record identifies the phase and promoter, which helps match the quoted unit to the correct filings.",
      "This project gives investors a way to compare a different Gurugram location and commute with Sector 49."
    ],
    risks: [
      ["Phase and delivery", "Confirm the specific tower, contractual possession date, payment milestones and latest construction status."],
      ["Rent and exit", "Use signed lease evidence from occupied societies where available, and confirm transfer charges and restrictions before assuming you can resell."]
    ]
  },
  {
    name: "DLF Privana South",
    aliases: ["Privana South"],
    sectors: ["76", "77"],
    developer: "DLF Limited",
    registration: "GGM/772/504/2023/116",
    record: "https://haryanarera.gov.in/view_project/searchprojectDetail/2540",
    thesis: "Worth comparing if the Sectors 76/77 location, payment timeline and purchase amount suit your investment horizon and the unit measures up against similar alternatives.",
    facts: "The original Haryana RERA project record identifies Sectors 76/77 and DLF Limited. Confirm the registration and filings that apply to the specific tower and unit on offer.",
    location: "Use the site gate as the starting point for comparing drive times to your chosen work hub. Compare the route with sectors you would realistically consider instead.",
    strengths: [
      "The original registration record identifies the promoter and project location for follow-up.",
      "The Sectors 76/77 location provides a separate option for comparing commute and access across Gurugram."
    ],
    risks: [
      ["Tower and timing", "Check the tower’s current filings, instalment milestones, contract possession date and the cost of any delay."],
      ["Large cash commitment", "Compare all-in purchase cost, carrying costs and resale evidence with a completed unit before accepting a long hold."]
    ]
  }
];

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function researchProject(name, location) {
  const area = normalize(location);
  const sector = area.match(/\bsectors?\s*(\d+[a-z]?)(?=\s|$)/)?.[1];
  const gurugram = /\b(gurgaon|gurugram)\b/.test(area);
  const sectorOnly = /^sectors?\s*\d+[a-z]?(?: \d+[a-z]?)?$/.test(area);
  const matches = researchProjects.filter(project => {
    const sameName = [project.name, ...project.aliases].some(alias => normalize(alias) === normalize(name));
    return sameName && (gurugram || sectorOnly) && (!sector || project.sectors.includes(sector));
  });
  if (matches.length !== 1) return null;

  const [project] = matches;
  return {
    ...project,
    locationLabel: `Sector ${project.sectors.join("/").toUpperCase()}, Gurugram`,
    evidenceDate: "2026-11-18",
    alternatives: researchProjects.filter(option => option !== project).map(({name, sectors, record}) => ({
      name, location: `Sector ${sectors.join("/").toUpperCase()}, Gurugram`, record
    })),
    sources: [
      {label:"Haryana RERA project record", url:project.record},
      ...(project.certificate ? [{label:"Registration certificate and declared completion date", url:project.certificate}] : []),
      ...(project.developerPage ? [{label:"Developer’s published starting price and neighbourhood", url:project.developerPage}] : []),
      {label:"GMDA OneMap planning and infrastructure map", url:gmda},
      {label:"Haryana RERA public project search", url:officialSearch}
    ]
  };
}
