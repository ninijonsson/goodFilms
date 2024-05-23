import "../../global/components/header/header.js";
import "./searchMovies.js";
import { PubSub } from "../../global/logic/PubSub.js";

PubSub.publish({
    event: "renderSearchMovies",
    detail: "wrapper"
});
