import "../../global/components/header/header.js";
import "./profile.js";
import { PubSub } from "../../global/logic/PubSub.js";

PubSub.publish({
    event: "renderProfile",
    detail: "wrapper"
});