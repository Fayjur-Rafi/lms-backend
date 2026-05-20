
import axios from 'axios';

const run = async () => {
    const query = "HTML";
    console.log("Searching Wikipedia for:", query);
    try {
        const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${query}`);
        console.log(JSON.stringify(response.data, null, 2));
    } catch (e) {
        console.error("Wikipedia Error:", e.message);
    }
}

run();
