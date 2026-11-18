// All financial maths is deterministic. Never ask an LLM to calculate returns.
export const INR = n => Number.isFinite(n) ? new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n) : "Not available";
export const pct = n => Number.isFinite(n) ? n.toFixed(2)+"%" : "Not available";
export function num(v) { const x = Number(String(v ?? "").replace(/[^0-9.-]/g,"")); return Number.isFinite(x) && x>=0 ? x : 0; }
export function assess(deal) {
 const price=num(deal.price), rent=num(deal.monthlyRent), area=num(deal.area), costs=num(deal.closingCosts), annualFees=num(deal.annualExpenses), vacancy=Math.max(0,Math.min(100,num(deal.vacancyRate)));
 const totalCost=price+costs, annualGross=rent*12, annualEffective=annualGross*(1-vacancy/100), annualNet=annualEffective-annualFees;
 const grossYield=price>0 ? 100*annualGross/price : null;
 const netYield=totalCost>0 && rent>0 ? 100*annualNet/totalCost : null;
 const pricePerSqft=price>0&&area>0?price/area:null;
 const advertised=num(deal.advertisedYield);
 const gap=advertised>0&&grossYield!==null?advertised-grossYield:null;
 const risks=[];
 if(!price) risks.push({level:"high",title:"Purchase price missing",detail:"Price is required to calculate investment returns."});
 if(!rent) risks.push({level:"medium",title:"Rental income unverified",detail:"No rent amount supplied. Yield cannot be validated."});
 if(gap!==null&&gap>0.5)risks.push({level:"high",title:"Advertised yield mismatch",detail:"Advertised "+pct(advertised)+" versus calculated "+pct(grossYield)+" gross yield — a "+gap.toFixed(2)+" percentage-point gap."});
 if(!deal.rera)risks.push({level:"medium",title:"RERA status not verified",detail:"A RERA registration number or exemption rationale has not been supplied. Check applicability and verify on the official portal."});
 if(!deal.titleVerified)risks.push({level:"high",title:"Title documentation not verified",detail:"Verify the chain of title, encumbrances and ownership with qualified professionals."});
 if(!deal.approvalsVerified)risks.push({level:"medium",title:"Approvals not verified",detail:"Land-use, construction and occupancy permissions require independent checks where applicable."});
 if(netYield!==null&&netYield<2)risks.push({level:"medium",title:"Thin estimated net rental yield",detail:"Net yield below 2% based on supplied assumptions; benchmark against suitable local alternatives."});
 let verdict=!price||!rent?"Insufficient data":risks.some(r=>r.level==="high")?"Investigate before investing":"Review with due diligence";
 const scenarios=[{name:"Conservative",rentFactor:.85,vacancy:Math.min(100,vacancy+8),expenseFactor:1.15},{name:"Base case",rentFactor:1,vacancy,expenseFactor:1},{name:"Upside",rentFactor:1.1,vacancy:Math.max(0,vacancy-3),expenseFactor:1}].map(s=>{const net=rent*s.rentFactor*12*(1-s.vacancy/100)-annualFees*s.expenseFactor;return {name:s.name,annualNet:net,yield:totalCost>0&&rent>0?net/totalCost*100:null}});
 const missing=["Independent comparable sales and rental transactions","Ownership/title and encumbrance verification","Local permissions and zoning verification","Maintenance, taxes and financing review"];
 if(!deal.rera)missing.unshift("Applicable RERA record verification");
 return {price,rent,area,totalCost,annualGross,annualEffective,annualNet,grossYield,netYield,pricePerSqft,gap,advertised:advertised||null,risks,scenarios,missing,verdict,vacancy};
}
export const samples=[
 {name:"Bhopal Apartment · Advertised 8% yield",location:"Hoshangabad Road, Bhopal",assetType:"Residential apartment",price:8000000,area:1400,monthlyRent:25000,advertisedYield:8,closingCosts:550000,annualExpenses:36000,vacancyRate:5,notes:"Broker advertises 8% annual rental returns. Listed at ₹80 lakh with ₹25,000 monthly rent. Title and approvals not yet provided.",rera:"",titleVerified:false,approvalsVerified:false},
 {name:"Warehouse · Stronger income case",location:"Mandideep, Madhya Pradesh",assetType:"Industrial warehouse",price:18000000,area:6000,monthlyRent:105000,advertisedYield:7,closingCosts:1100000,annualExpenses:175000,vacancyRate:5,notes:"Warehouse listed at ₹1.8 crore, 6,000 sq ft. Indicative monthly rent ₹1.05 lakh; advertised yield 7%. Documentation still requires review.",rera:"",titleVerified:false,approvalsVerified:false}
];
