import "../../global/components/header/header.js";
import "./moviePage.js";
import { PubSub } from "../../global/logic/PubSub.js";

PubSub.publish({
    event: "renderMoviePage",
    detail: "wrapper"
});
