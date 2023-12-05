
import os from "os";

function formatRAM(ramInMB: number): string {
	if (ramInMB >= 1024) {
		const ramInGB = ramInMB / 1024;
		return `${ramInGB.toFixed(2)} GB`;
	} else {
		return `${ramInMB} MB`;
	}
}

export function getMaxRAM(): string {
	const totalRam = os.totalmem(); // Total RAM in bytes
	const maxRamInMB = Math.round(totalRam / (1024 * 1024)); // Convert to MB
	return formatRAM(maxRamInMB);
}

export function getUsedRAM(): string {
	const usedRamInMB = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
	return formatRAM(usedRamInMB);
}

export function formatUptime(timestamp: Date | null | undefined): string {
	if (!timestamp) return "0 seconds";
	const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
	const uptimeParts = [
		Math.floor(seconds / 86400),
		Math.floor((seconds % 86400) / 3600),
		Math.floor((seconds % 3600) / 60),
		seconds % 60,
	]
		.map((time, index) => (time > 0 ? `${time} ${['day', 'hour', 'minute', 'second'][index]}${time !== 1 ? 's' : ''}` : ''))
		.filter((time) => time !== '');

	return uptimeParts.join(', ');
}