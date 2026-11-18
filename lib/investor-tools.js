export const landUses = {
  Housing: "Compare neighbouring occupancy, drainage, water capacity and access to jobs.",
  School: "Walk the pupil drop-off route and inspect bus turning space, play areas and safe pedestrian access.",
  Hospital: "Check ambulance access at peak traffic, backup power, water continuity and waste handling.",
  Warehouse: "Inspect truck turning space, loading bays, highway access and floor-load requirements.",
  Office: "Compare transit access, parking, power redundancy and fibre availability.",
  "Theme park": "Test peak visitor access, parking, water availability and ride-specific engineering requirements.",
  Resort: "Review seasonal water availability, wastewater arrangements, access and environmental constraints."
};

export const evidence = {
  "Ownership and title": "Request the registered deed, parcel identifiers and a title review covering ownership, mortgages and disputes.",
  "Permitted use": "Match the parcel and intended use to the sanctioned plan. Ask the planning authority which permissions apply.",
  "Soil and foundations": "Request the site-specific geotechnical investigation and an engineer’s interpretation.",
  "Water and drainage": "Request supply records, water testing, site levels and local waterlogging history.",
  "Possession and approvals": "Match dated approvals and progress filings to the specific phase and tower. Request occupancy evidence for a ready unit."
};

export function financing(snapshot, amount, rate, years) {
  if (!snapshot.price || amount === "" || !Number.isFinite(Number(amount))) return null;
  const principal = Number(amount);
  if (principal < 0 || principal > snapshot.price) return null;
  const months = Number(years) * 12;
  const monthlyRate = Number(rate) / 1200;
  if (principal && (rate === "" || !Number.isFinite(monthlyRate) || monthlyRate < 0 || !Number.isInteger(months) || months < 1)) return null;
  const emi = !principal ? 0 : monthlyRate ? principal * monthlyRate / -Math.expm1(-months * Math.log1p(monthlyRate)) : principal / months;
  const annualCash = snapshot.annualNet - emi * 12;
  const equity = snapshot.totalCost - principal;
  return {emi, annualCash, equity, dscr:emi ? snapshot.annualNet / (emi * 12) : null,
    cashReturn:equity > 0 ? 100 * annualCash / equity : null};
}
