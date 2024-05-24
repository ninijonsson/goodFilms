import "../../global/components/header/header.js";
import "./editList.js";
import { PubSub } from "../../global/logic/PubSub.js";

PubSub.publish({
    event: "renderEditList",
    detail: null
});