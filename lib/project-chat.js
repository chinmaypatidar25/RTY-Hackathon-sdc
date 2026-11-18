import { INR } from "./analyze.js";
import {evidence, landUses} from "./investor-tools.js";

export function answerProjectQuestion(report, question) {
  const answers = [];
  const sources = new Map();
  const add = (text, ...urls) => {
    answers.push(text);
    for (const url of urls) {
      const source = report.sources.find(item => item.url === url);
      if (source) sources.set(url, source);
    }
  };
  const asks = pattern => pattern.test(question);
  for (const [pattern, label] of [
    [/\b(soil|foundation|geotechnical|bearing)\b/i,"Soil and foundations"],
    [/\b(water|borewell|flood|drainage|tds|waterlogging)\b/i,"Water and drainage"],
    [/\b(owner|owners|ownership|deed|mortgagee)\b/i,"Ownership and title"],
    [/\b(zoning|clu|land use)\b/i,"Permitted use"]
  ]) {
    if (asks(pattern)) add(label + " is unverified in this case study. " + evidence[label]);
  }
  for (const [use, guidance] of Object.entries(landUses)) {
    if (question.toLowerCase().includes(use.toLowerCase()) && asks(/\b(build|development|suitable|use|develop)\b/i)) {
      add("For a prospective " + use.toLowerCase() + " site, confirm the permitted use for that parcel. " + guidance);
    }
  }

  if (asks(/\b(commute|traffic|nearby|neighbou?rhood|location|schools?|hospitals?|metro|connectivity|access|distance|minutes|roads?|mall|how far|travel time)\b/i)) {
    add(report.location, report.developerPage, report.sources.find(source => source.label.startsWith("GMDA"))?.url);
    if (asks(/\b(how far|distance|minutes|how long|travel time)\b/i)) {
      add("I don’t have measured travel times or distances for this route.");
    }
  }
  if (asks(/\b(risks?|cons|downsides?|problems?|unsafe|red flags?|disadvantages?|issues?)\b/i)) {
    add(report.risks.map(([title, detail]) => title + ". " + detail).join("\n\n"), report.record, report.certificate);
  }
  if (asks(/\b(alternatives?|compar\w*|options?|other projects?|similar projects?|versus|vs)\b/i)) {
    add("You can compare " + report.alternatives.map(option => option.name + " (" + option.location + ")").join(" and ") + ". Start with the same unit size, price basis and completion stage. If you need rent soon, also look at completed units with recent leases.");
    for (const option of report.alternatives) {
      sources.set(option.record, {label:option.name + " RERA record", url:option.record});
    }
  }
  if (asks(/\b(rera|registration|developer|promoter|builder|legal|title|oc|paperwork|documents?|approvals?|handover|possession|delivery|completion|delay|ready|finish(?:ed)?|move in)\b/i)) {
    add(report.name + " is listed under " + report.developer + " with registration " + report.registration + ". " + report.facts, report.record, report.certificate);
    if (asks(/\b(title|legal|safe|oc|documents?|approvals?|paperwork)\b/i)) {
      add("For the specific unit, ask for the agreement, payment schedule, applicable approvals and a tower occupancy certificate if marketed as ready. Arrange a separate title and encumbrance check.");
    }
  }
  if (asks(/\b(price|pricing|costs?|quote|rent(?:al)?|yield|returns?|roi|earn|appreciation|resale|lease)\b/i)) {
    if (report.advertisedStartingPrice) {
      add("The developer advertises a starting price of " + INR(report.advertisedStartingPrice) + ". Confirm the unit’s written quote and total fees before using that figure.", report.developerPage);
      if (asks(/\b(rent(?:al)?|yield|returns?|roi|earn|lease)\b/i)) {
        const target = Number(question.match(/(?:^|[^a-z0-9])(-?\d+(?:\.\d+)?)\s*(?:%|percent\b)/i)?.[1] ?? 3);
        if (target > 0 && target <= 100) {
          add("At that advertised price, an illustrative " + target + "% yearly rental return before costs would require " + INR(report.advertisedStartingPrice * target / 1200) + " per month. The report has no verified rent for the unit. Compare with recent signed leases and account for expenses and empty months.");
        } else {
          add("Enter a rental return target above 0% and up to 100%.");
        }
      }
    } else {
      add("The current case study has no verified unit price or signed rent. Use the written unit quote and a rent estimate in the optional calculator below.");
    }
    if (asks(/\b(appreciation|resale)\b/i)) {
      add("The current evidence does not establish a resale value or future price growth.");
    }
  }
  if (asks(/\b(pros|benefits?|advantages?|positives?|worth|buy|invest(?:ing|ment)?|shortlist|suit)\b/i) && (answers.length === 0 || asks(/\b(pros|benefits?|positives?|worth|buy|shortlist)\b/i))) {
    add([report.thesis, ...report.strengths].join("\n\n"), report.record, report.certificate, report.developerPage);
  }
  if (!answers.length) {
    add("I couldn’t find an answer in the current " + report.name + " case study. Try asking about its risks, commute, possession date, registration, rent or alternatives.");
  }
  return { answer:answers.join("\n\n"), sources:[...sources.values()] };
}
