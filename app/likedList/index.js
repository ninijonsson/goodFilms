import "../../global/components/header/header.js";
import "./list.js";
import { PubSub } from "../../global/logic/PubSub.js";

PubSub.publish({
    event: "renderLikedList",
    detail: "wrapper"
});