import { NextResponse } from "next/server";
export const runtime = "nodejs";
// Extract only supplied facts: never create a comparable transaction, approval, or legal status.
function parseMoney(text,pattern){
 const m=text.match(pattern);if(!m)return undefined;
 const value=Number(m[1].replace(/,/g,""));const unit=(m[2]||"").toLowerCase();
 return Math.round(value*(unit==="cr"||unit==="crore"||unit==="crores"?10000000:unit==="lakh"||unit==="lakhs"||unit==="lac"||unit==="lacs"?100000:unit==="k"||unit==="thousand"?1000:1));
}
function fallback(text){
 const price=parseMoney(text,/(?:asking\s*price|listed\s*at|priced?\s*at|price|cost|₹|rs\.?|inr)\s*[:=]?\s*(?:₹|rs\.?|inr)?\s*([\d,.]+)\s*(crores?|cr|lakhs?|lacs?|k|thousand)?/i);
 const rent=parseMoney(text,/(?:monthly\s*rent|rent\s*per\s*month|rent|rental\s*income)\s*[:=]?\s*(?:₹|rs\.?|inr)?\s*([\d,.]+)\s*(crores?|cr|lakhs?|lacs?|k|thousand)?/i);
 const area=text.match(/([\d,.]+)\s*(?:sq\.?\s*ft|square\s*feet|sqft)/i);
 const advertised=text.match(/(?:advertised|promised|claimed|guaranteed)\s*(?:annual\s*)?(?:rental\s*)?(?:yield|roi|return)[^\d]{0,12}([\d.]+)\s*%/i)||text.match(/([\d.]+)\s*%\s*(?:yield|roi|annual return)/i);
 return {price:price??"",monthlyRent:rent??"",area:area?Number(area[1].replace(/,/g,"")):"",advertisedYield:advertised?Number(advertised[1]):"",name:"Property extracted from listing"};
}
export async function POST(request){
 try{
 const {text}=await request.json();
 if(typeof text!=="string"||!text.trim())return NextResponse.json({error:"Property listing text is required."},{status:400});
 if(text.length>15000)return NextResponse.json({error:"Maximum 15,000 characters allowed."},{status:400});
 const apiKey=process.env.OPENAI_API_KEY;
 if(!apiKey)return NextResponse.json({deal:fallback(text),mode:"fallback"});
 const response=await fetch("https://api.openai.com/v1/chat/completions",{
  method:"POST",headers:{"Authorization":`Bearer ${apiKey}`,"Content-Type":"application/json"},signal:AbortSignal.timeout(18000),
  body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-4.1-mini",temperature:0,response_format:{type:"json_object"},messages:[{role:"system",content:"You extract structured real estate listing facts only. Return a JSON object with keys name, location, assetType, price, monthlyRent, area, advertisedYield. Values price and monthlyRent must be INR numbers (1 lakh=100000; 1 crore=10000000), area is sq ft, yield is annual percent. If a field is not stated, use empty string. Do not infer rents, prices, approvals, RERA status or missing facts. No commentary."},{role:"user",content:text}]})});
 if(!response.ok)return NextResponse.json({deal:fallback(text),mode:"fallback"});
 const payload=await response.json();const parsed=JSON.parse(payload.choices?.[0]?.message?.content||"{}");
 const result={};
 for(const key of ["name","location","assetType"])if(typeof parsed[key]==="string")result[key]=parsed[key].slice(0,180);
 for(const key of ["price","monthlyRent","area","advertisedYield"])if(parsed[key]!==""&&parsed[key]!==null&&Number.isFinite(Number(parsed[key])))result[key]=Math.max(0,Number(parsed[key]));
 return NextResponse.json({deal:result,mode:"ai"});
 }catch(e){return NextResponse.json({error:"Could not extract details. Paste a shorter listing and try again."},{status:500})}
}
