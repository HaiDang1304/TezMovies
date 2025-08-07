import axios from "axios";

export async function movieRecommended(describe, slug) {
    try {
        const url = `https://phimapi.com/v1/api/${describe}/${slug}?limit=12`
        const res = await axios.get(url)
        console.log("res", res);

        if (res.status !== 200) {
            return {
                items: []
            };

        }
        const data = res.data.data
        return {
            items: data.items
        }
    } catch (error) {
        return {
            items: []
        };

    }


}
