
import axios from 'axios';

export const getAIResponse = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.json({ success: false, message: "Query is required" });
    }

    // Prepare query for Wikipedia (basic formatting)
    // Wikipedia API expects "HTML" or "React_(software)" etc.
    // We'll try to capitalize the first letter and keep it simple.
    const formattedQuery = query.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('_');
    
    console.log("Searching Wikipedia for:", formattedQuery);

    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(formattedQuery)}`;
    
    // Try primary search
    let response;
    try {
        response = await axios.get(wikiUrl);
    } catch (err) {
        // Fallback: If direct match fails, try searching for the first word or just standard formatting
         console.log("Direct match failed, trying standard search...");
         const params = {
            action: 'query',
            list: 'search',
            srsearch: query,
            format: 'json',
            origin: '*'
         };
         const searchResp = await axios.get('https://en.wikipedia.org/w/api.php', { params });
         if (searchResp.data.query.search.length > 0) {
             const bestTitle = searchResp.data.query.search[0].title.replace(/ /g, '_');
             response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestTitle)}`);
         } else {
             throw new Error("No results found");
         }
    }

    if (response && response.data) {
        return res.json({ 
            success: true, 
            answer: response.data.extract, 
            sourceLink: response.data.content_urls.desktop.page 
        });
    } else {
        throw new Error("No data returned");
    }

  } catch (error) {
    console.error("Wikipedia Search Error:", error.message);
    return res.json({ 
        success: true, 
        answer: "I couldn't find a direct answer on Wikipedia for that. Please try a more specific term.",
        sourceLink: `https://www.google.com/search?q=${encodeURIComponent(req.body.query)}`
    });
  }
};
