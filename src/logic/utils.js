export const authString = (server, song) =>
	(server || []).find(
		(s) => s.url == song?.server && s.profile == song?.profile
	)?.authString;
