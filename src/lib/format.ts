const compactFormatter = new Intl.NumberFormat("en", { notation: "compact" , maximumFractionDigits: 1});
const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

// Intl.RelativeTimeFormat can’t choose a unit for you. It only formats what you give it: 
// console.log(relativeTimeFormatter.format(-1, "day")); // "yesterday"
// console.log(relativeTimeFormatter.format(-2, "day")); // "2 days ago"
// console.log(relativeTimeFormatter.format(0, "day")); // "today"
// console.log(relativeTimeFormatter.format(1, "day")); // "tomorrow"
// console.log(relativeTimeFormatter.format(2, "year")); // "in 2 years"
// console.log(relativeTimeFormatter.format(-2, "year")); // "2 years ago"

export function formatCount(n: number): string {
  return compactFormatter.format(n);
}

// 1. The unit is always (day) - I wrote this code
// export function timeAgo(dateString: string): string {  
//     return relativeTimeFormatter.format(
//         Math.round((new Date(dateString).getTime() - Date.now()) / 1000 / 60 / 60 / 24),
//         "day"
//     );
// }


// Right way to do it is to choose the unit based on the difference in time.
const SECONDS_IN:[Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
]

export function timeAgo(dateString: string, now: Date = new Date()): string {   
    const date = new Date(dateString);
    // check if the date is valid, if not return an empty string
    if(Number.isNaN(date.getTime())) return "";
    const diffInSeconds = (date.getTime() - now.getTime()) / 1000; // negative if date is in the past, positive if date is in the future
    for (const [unit, seconds] of SECONDS_IN) {
        // console.log(unit, seconds);
        if (Math.abs(diffInSeconds) >= seconds || unit === "second") { // if the difference is greater than or equal to the unit, or if we are at the smallest unit (second), use this unit
            return relativeTimeFormatter.format(Math.round(diffInSeconds / seconds), unit);
        }
    }
    return "";
}
// this function gets the languages and their lines of codes as a parameter and returns the percentages for each language and total should be 100. 
// if the percentage is 100, based on the how many lines of codes the project has, it will show which language used the most or show the what languages used and how much it is used.
// parameter will be an object ex:  {"Ruby": 1, "JS": 3, "JSX": 7} 
// export function languagePercentages(languageBytes: Record<string, number>): Record<string, number> {
//     // 1. calculate the total bytes of all languages
//     const totalBytes = Object.values(languageBytes).reduce((sum, bytes) => sum + bytes, 0); // 1+3+7=11
//     // what is the percentage of 1  = 10%
//     // 7 => 70% out of 100% ... so on

//     // this will hold the percentages for each language and {} will be returned if the input object is empty
//     const percentages: Record<string, number> = {}; 

//     // if totalBytes is 0, return an empty object to avoid division by zero
//     if (totalBytes === 0) {
//         return {}
//     }
//     // calculate the percentage for each language and store it in the percentages object and return it
//     //return percentages from for loop as {JavaScript: 50.5, TypeScript: 33.5, Python: 20.3} total should be 100%
//     for (const [language, bytes] of Object.entries(languageBytes)) {
//         percentages[language] = (bytes / totalBytes) * 100;
//     } 
    
//     // calculate the remainder percentage for each language and store it in the remainderPercentage object
//     const remainderPercetage: Record<string, number> = {};
//     const percentagesRounded: Record<string,number> = {}

//     for( const [language, percentage] of Object.entries(percentages)) {
//         const mathFloor = Math.floor(percentage);
//         percentagesRounded[language] = mathFloor // output will be 55.6-> 55 but we need to save the remaining as well
//         remainderPercetage[language] = percentage - mathFloor // will be 0.6
//     } 

//     const totalPecentages = Object.values(percentagesRounded).reduce((sum, percentage) => sum + percentage, 0);

//     // now check which language gets the extra percentage
//     if(totalPecentages !== 100){
//         const missing = 100 - totalPecentages; 
//         // sort the remainderPercentage from the highest to lowest points 
//         const byScoreDesc = Object.entries(remainderPercetage).sort(
//             ([, remainderA], [, remainderB]) => remainderB - remainderA
//         );

//         // now give the 1 to correct language
//         for (const [language] of byScoreDesc.slice(0, missing)) {
//             percentagesRounded[language] = (percentagesRounded[language] ?? 0) + 1;
//         }
//     }
//     return percentagesRounded;
// }


// Improved version
import type { LanguageBytes } from "./github-types";

export type LanguageShares = { language: string; percent: number } // return type of languagePercentages

export function languagePercentages(languageBytes: LanguageBytes): LanguageShares[] {
    const entries = Object.entries(languageBytes); 
    const totalBytes = entries.reduce((sum, [,byte]) => sum + byte, 0);

    if (totalBytes === 0) return [];

    const rows = entries.map(([language, bytes]) => {
        const exact = (bytes * 100) / totalBytes; 
        const floor = Math.floor(exact);
        return {language, floor, remainder: exact - floor}
    })

    const missing = 100 - rows.reduce((sum, r) => sum + r.floor, 0);

    const sorted = rows.toSorted((a, b) => b.remainder - a.remainder)
    .map((r, i) => ({
        language: r.language,
        percent: r.floor + (i < missing ? 1 : 0) // checking the indexs!!
    })).toSorted((a, b) => b.percent - a.percent);

	return sorted;
};

console.log(languagePercentages({A: 0}))


// The Rules of Thumb

// • Keep it as an Object when you just need to instantly look up a specific piece of data by its name (e.g., config.apiBaseUrl).
// • Convert it to an Array when you need to loop, count, filter, sort, or modify the dataset as a whole.


console.log(languagePercentages( { TypeScript: 6, CSS: 3, HTML: 1, Shell: 1 }))

