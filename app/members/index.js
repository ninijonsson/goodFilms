import "../../global/components/header/header.js";
import "./renderMemberList.js";
import { PubSub } from "../../global/logic/PubSub.js";

PubSub.publish({
    event: "renderMemberList",
    detail: "wrapper"
});