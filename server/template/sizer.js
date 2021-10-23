const byteSize = require("byte-size");

function prettySize(byte) {
	const size = byteSize(byte, { units: "iec", precision: 2 });
	let {unit} = size;
	// iec unit might create confusion sometime, let's keep the units in SI formate for end-user
	if (size.unit === "B") unit = "bytes";
	if (size.unit === "KiB") unit = "kb";
	if (size.unit === "MiB") unit = "mb";
	return size.value + unit;
}

module.exports = {prettySize}
