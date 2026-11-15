import { serve } from "./server.mjs";

const port = Number(process.env.PORT || 3000);
serve().listen(port, process.env.HOST || "127.0.0.1", () => {
    console.log("SPAJA Igre MCP started on port " + port);
});




