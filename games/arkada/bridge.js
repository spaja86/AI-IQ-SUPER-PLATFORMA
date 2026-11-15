(() => {
    if (window.parent === window) return;
    const host = window.parent;
    let origin = "*";
    const send = payload => host.postMessage({ jsonrpc: "2.0", ...payload }, origin);
    const id = "sarasister-init";
    function initialize(event) {
        if (event.source !== host || event.data?.jsonrpc !== "2.0" || event.data.id !== id || !event.data.result) return;
        window.removeEventListener("message", initialize);
        origin = event.origin === "null" ? "*" : event.origin;
        send({ method: "ui/notifications/initialized" });
        const panel = document.querySelector("main");
        const resize = () => send({ method: "ui/notifications/size-changed",
            params: { height: Math.ceil(panel.getBoundingClientRect().height) } });
        new ResizeObserver(resize).observe(panel);
        resize();
    }
    window.addEventListener("message", initialize);
    send({ id, method: "ui/initialize", params: {
        protocolVersion: "2026-01-26",
        appInfo: { name: "sarasister", version: "0.1.0" },
        appCapabilities: {}
    } });
})();

