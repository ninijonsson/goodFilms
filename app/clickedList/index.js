import "../../global/components/header/header.js";
import "./clickedList.js";
import { PubSub } from "../../global/logic/PubSub.js";

PubSub.publish({
    event: "renderClickedList",
    detail: "wrapper"
});