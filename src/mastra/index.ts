import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";

import { jtemizeAgent } from "./agents/jtemize-agent.js";

export const mastra = new Mastra({
  agents: {
    jtemizeAgent,
  },
  logger: new PinoLogger({
    name: "Jtemize",
    level: "info",
  }),
});
