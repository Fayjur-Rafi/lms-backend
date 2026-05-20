
import { search } from 'google-sr';

const run = async () => {
    const query = "what is html";
    console.log("Searching for:", query);
    try {
        const results = await search({
            query: query,
        });
        console.log(JSON.stringify(results, null, 2));
    } catch (e) {
        console.error(e);
    }
}

run();
