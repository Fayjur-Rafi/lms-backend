
import { search } from 'duck-duck-scrape';

const run = async () => {
    const query = "what is html";
    console.log("Searching DDG for:", query);
    try {
        const searchResults = await search(query, {
            safeSearch: 0 // 0 = off, 1 = moderate, 2 = strict
        });
        
        console.log("Results found:", searchResults.results.length);
        if (searchResults.results.length > 0) {
            console.log(JSON.stringify(searchResults.results[0], null, 2));
        }
    } catch (e) {
        console.error(e);
    }
}

run();
