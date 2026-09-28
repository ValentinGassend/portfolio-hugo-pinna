// Exporte les collections Firestore vers src/data/content.json (snapshot statique).
// Usage : node scripts/export-firestore.mjs
import {writeFile} from "node:fs/promises";

const PROJECT = "portfolio-hugo-pinna";
const COLLECTIONS = ["assets", "landing", "projects", "gallery", "gallery_part", "about", "contact"];
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/`;

const decode = (v) => {
    if ("stringValue" in v) return v.stringValue;
    if ("integerValue" in v) return Number(v.integerValue);
    if ("doubleValue" in v) return v.doubleValue;
    if ("booleanValue" in v) return v.booleanValue;
    if ("nullValue" in v) return null;
    if ("timestampValue" in v) return v.timestampValue;
    if ("referenceValue" in v) return v.referenceValue;
    if ("geoPointValue" in v) return v.geoPointValue;
    if ("arrayValue" in v) return (v.arrayValue.values || []).map(decode);
    if ("mapValue" in v) return decodeFields(v.mapValue.fields || {});
    return null;
};
const decodeFields = (fields) => Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, decode(v)]));

const content = {};
for (const name of COLLECTIONS) {
    const docs = [];
    let pageToken = "";
    do {
        const res = await fetch(`${BASE}${name}?pageSize=300${pageToken ? `&pageToken=${pageToken}` : ""}`);
        if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
        const json = await res.json();
        for (const d of json.documents || []) {
            docs.push({id: d.name.split("/").pop(), ...decodeFields(d.fields || {})});
        }
        pageToken = json.nextPageToken || "";
    } while (pageToken);
    content[name] = docs;
    console.log(`${name}: ${docs.length} documents`);
}

await writeFile(new URL("../src/data/content.json", import.meta.url), JSON.stringify(content, null, 2) + "\n");
console.log("-> src/data/content.json");
