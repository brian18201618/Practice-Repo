//general contact titles
export function getContactTitles() {
	return ["Mr", "Prof", "Hon", "Sir", "Mrs", "Miss", "Dr", "Madam", "Other"];
}

export function getGendersList() {
	let gendersList = ["Male", "Female", "Not Specified"];
	return gendersList;
}

export function getExpensesCategories() {
	return [
		'Taxes',
		'Utilities',
		'Mortgage',
		'Office',
		'Entertainment',
		'Maintenance & Cleaning',
		'Advertising',
		'Insurance',
		'Legal & Other Professional Fees',
		'Auto & Travel',
		'Management Fees',
		'Supplies',
		'Repairs',
		'Other'
	]
}

//general property values
export function getPropertyTypes() {
	return [
		"Bedsitter",
		"One Bedroom",
		"Two Bedroom",
		"Single Room",
		"Double Room",
		"Shop",
	];
}

export function getPropertyBaths() {
	let baths = [];
	for (let i = 1; i <= 5; i++) {
		i === 1 ? baths.push(i + " Bath") : baths.push(i + " Baths");
	}
	return baths.concat([
		"1.5 Baths",
		"2.5 Baths",
		"3.5 Baths",
		"4.5 Baths",
		"5.5 Baths",
	]);
}

export function getPropertyBeds() {
	let beds = ["Studio"];
	for (let i = 1; i <= 5; i++) {
		i === 1 ? beds.push(i + " Bed") : beds.push(i + " Beds");
	}
	return beds;
}

export function getCheckOptions() {
	let check_options = [];
	for (let i = 1; i < 13; i++) {
		i === 1
			? check_options.push(i + " Check")
			: check_options.push(i + " Checks");
	}
	return check_options;
}

export function getFrequencyOptions() {
	return ["Per Day", "Week", "Month", "Quarter", "Half Year", "Year"];
}

export function getMeterTypes() {
	return ["Electric", "Gas", "Oil", "Sewer", "Water"];
}

export function getLeaseOptions() {
	let lease_options = [
		"Fixed",
		"Fixed w/rollover",
		"At Will"
	];
	return lease_options;
}

export function getPaymentOptions() {
	return ["Per Day", "Week", "Month", "Quarter", "Half Year", "Yearly"];
}
export function getFurnishedOptions() {
	return ["Yes", "No", "Partially"];
}

export function getTransactionTypes() {
	return ["Rental", "Sale", "Not Specified"];
}
