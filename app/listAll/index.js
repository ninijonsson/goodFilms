import "../../global/components/header/header.js";
import "./listAll.js";
import { PubSub } from "../../global/logic/PubSub.js";

PubSub.publish({
    event: "renderListAll",
    detail: "wrapper"
});