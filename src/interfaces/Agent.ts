import { Agent as HttpAgent } from "http";
import { Agent as HttpsAgent } from "https";

export type Agent = HttpAgent | HttpsAgent;