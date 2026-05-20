
import google from 'googlethis';

const run = async () => {
    const query = "what is html";
    const options = {
        page: 0, 
        safe: false,
        additional_params: { hl: 'en' }
    };

    console.log("Searching for:", query);
    try {
        const response = await google.search(query, options);
        console.log(JSON.stringify(response, null, 2));
    } catch (e) {
        console.error(e);
    }
}

run();
