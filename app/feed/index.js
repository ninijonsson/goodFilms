import "../../global/components/header/header.js";
import "./feed.js";
import { PubSub } from "../../global/logic/PubSub.js";

PubSub.publish({
    event: "renderFeed",
    detail: "wrapper"
});