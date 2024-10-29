export default async function APICall(url){
    console.log("Executing API Call " + url);
    try {
        let response = await fetch(`http://localhost:3000${url}`);
        let responseJSON = await response.json();
        if("error" in responseJSON){
            console.log("ERROR OCCURRED");
            return {error: "ERROR"}
        } else {
            return responseJSON
        }
    } catch(error) {
        return {error: "ERROR"}
    }
}