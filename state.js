import { fetcher } from "./global/logic/fetcher.js";

export const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZjJhYjRlMGQ2MWMxY2MxNDUzOTVmYjhmYWI1ZGZiMSIsInN1YiI6IjY2MThmMDVjMTA5Y2QwMDE2NWEzODEzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nj98FemKpT0B2H3wU6gj47MrwtNhMTHRQ4Z3om_-I5E"
    }
};

export const token = "c62f39ace22172680875af13e02f6a6313ea1125";

let _state = {};

function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
}

export const STATE = {
    get: async (entity, request) => {
        if (_state[entity]) {
            return cloneData(_state[entity]);
        }

        const response = await fetcher(request);

        if (!response) {
            return console.log("Error in GET");
        }

        _state[entity] = response;
        console.log(_state);
        return STATE.get(entity);
    }
};