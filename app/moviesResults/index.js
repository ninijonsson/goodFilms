import "../../global/components/header/header.js";
import "./moviesResults.js";
import { PubSub } from "../../global/logic/PubSub.js";

PubSub.publish({
    event: "renderMoviesResults",
    detail: "wrapper"
});
