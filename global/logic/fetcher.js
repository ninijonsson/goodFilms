export async function fetcher (rqst) {
   try {
    const response = await fetch(rqst);
    if (response.ok) {
        const resource = await response.json();
        return resource;
    }
   } catch(error) {
        console.warn(error);
   }
}