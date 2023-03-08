import {
	endOfMonth, endOfYear, startOfToday, eachMonthOfInterval,
	startOfMonth, startOfYear, subMonths, subYears, addMonths, getMonth
} from "date-fns";

const monthsInYear = eachMonthOfInterval({
	start: startOfYear(startOfToday()),
	end: endOfYear(startOfToday()),
})
//general contact titles
const TITLES_LIST = ["Mr", "Prof", "Hon", "Sir", "Mrs", "Miss", "Dr", "Madam", "Other"]
const GENDERS_LIST = ["Male", "Female", "Unspecified"];
const EXPENSES_CATEGORIES = [
	'Security Deposit Refund',
	'Water Deposit Refund',
	'Management Fees',
	'Utilities',
	'Taxes',
	'Mortgage',
	'Office',
	'Maintenance & Cleaning',
	'Advertising',
	'Insurance',
	'Legal & Other Professional Fees',
	'Auto & Travel',
	'Supplies',
	'Other Refund',
	'Repairs',
	'Other'
]
const PROPRERTY_TYPES = [
	"Residential",
	"Condo/Townhouse",
	"Multi-family",
	"Single-family",
]
const UNIT_TYPES = [
	"Bed Sitter",
	"One Bedroom",
	"Two Bedroom",
	"Single Room",
	"Double Room",
	"Shop",
	"Other",
];
const LEASE_OPTIONS = [
	"Fixed",
	"Fixed w/rollover",
];
const METER_TYPES = [
	{ id: "electric", displayValue: "Electric" },
	{ id: "sewer", displayValue: "Sewer" },
	{ id: "water", displayValue: "Water" },
];

const CHARGE_OPTIONS = [
	{ id: "rent", displayValue: "Rent" },
	{ id: "security_deposit", displayValue: "Security Deposit" },
	{ id: "electric", displayValue: "Electric" },
	{ id: "sewer", displayValue: "Sewer" },
	{ id: "water", displayValue: "Water" },
	{ id: "other", displayValue: "Other" }
];
const FREQUENCY_OPTIONS = ["Per Day", "Week", "Month", "Quarter", "Half Year", "Year"];
const PAYMENT_FREQUENCY_OPTIONS = ["Daily", "Weekly", "Monthly", "Quarterly", "Half-Yearly", "Yearly"];

//functions to get the above values
export function getContactTitles() {
	return TITLES_LIST;
}

export function getGendersList() {
	return GENDERS_LIST;
}

export function getExpensesCategories() {
	return EXPENSES_CATEGORIES;
}

//general property types
export function getPropertyTypes() {
	return PROPRERTY_TYPES;
}

//general unit types
export function getUnitTypes() {
	return UNIT_TYPES;
}

export function getPropertyBaths() {
	const baths = [];
	for (let i = 1; i <= 5; i++) {
		baths.push(i);
	}
	return baths.concat("5+");
}

export function getPropertyBeds() {
	const beds = [];
	for (let i = 1; i <= 5; i++) {
		beds.push(i);
	}
	return beds;
}

export function getFrequencyOptions() {
	return FREQUENCY_OPTIONS;
}

export function getChargeOptions() {
	return CHARGE_OPTIONS;
}

export function getMeterTypes() {
	return METER_TYPES;
}

export function getLeaseOptions() {
	return LEASE_OPTIONS;
}

export function getPaymentOptions() {
	return PAYMENT_FREQUENCY_OPTIONS;
}

export function getTransactionsFilterOptions() {
	return [
		{ id: '', text: 'All' }, { id: 'month-to-date', text: 'Month To Date' }, { id: 'last-month', text: 'Last Month' },
		{ id: '3-months-to-date', text: '3 Months To Date' }, { id: '6-months-to-date', text: '6 Months To Date' }, 
		{ id: 'year-to-date', text: 'Year To Date' }, { id: 'last-year', text: 'Last Year' },];
}

export function getLastMonthFromToDates() {
	return [startOfMonth(subMonths(startOfToday(), 1)), endOfMonth(subMonths(startOfToday(), 1))]
}

export function getLastYearFromToDates() {
	return [startOfYear(subYears(startOfToday(), 1)), endOfYear(subYears(startOfToday(), 1))]
}

export function getYearToDateFromToDates() {
	return [startOfYear(startOfToday()), startOfToday()]
}

export function getCurrentMonthFromToDates() {
	return [startOfMonth(startOfToday()), endOfMonth(startOfToday())]
}

export function getLastThreeMonthsFromToDates() {
	return [startOfMonth(subMonths(startOfToday(), 2)), endOfMonth(startOfToday())]
}

export function getLastSixMonthsFromToDates() {
	return [startOfMonth(subMonths(startOfToday(), 5)), endOfMonth(startOfToday())]
}

export function getMonthsInYear() {
	return monthsInYear
}

// Create our number formatter.
export const currencyFormatter = new Intl.NumberFormat(undefined, {
	style: 'decimal',
	currency: 'KES',
});

export function getStartEndDatesForPeriod(periodFilter) {
	let startOfPeriod;
	let endOfPeriod;
	let dateRange;
	switch (periodFilter) {
		case 'last-month':
			dateRange = getLastMonthFromToDates()
			startOfPeriod = dateRange[0]
			endOfPeriod = dateRange[1]
			break;
		case 'year-to-date':
			dateRange = getYearToDateFromToDates()
			startOfPeriod = dateRange[0]
			endOfPeriod = dateRange[1]
			break;
		case 'last-year':
			dateRange = getLastYearFromToDates()
			startOfPeriod = dateRange[0]
			endOfPeriod = dateRange[1]
			break;
		case 'month-to-date':
			dateRange = getCurrentMonthFromToDates()
			startOfPeriod = dateRange[0]
			endOfPeriod = dateRange[1]
			break;
		case '3-months-to-date':
			dateRange = getLastThreeMonthsFromToDates()
			startOfPeriod = dateRange[0]
			endOfPeriod = dateRange[1]
			break;
		case '6-months-to-date':
			dateRange = getLastSixMonthsFromToDates()
			startOfPeriod = dateRange[0]
			endOfPeriod = dateRange[1]
			break;
		default:
			//it is my hope that by this time we shall moved on to better things
			startOfPeriod = startOfYear(2010)
			endOfPeriod = endOfYear(new Date())
	}
	return { startDate: startOfPeriod, endDate: endOfPeriod }
}

export function getMonthlyDatesFromPeriod(period) {
	let eachPastMonthDate;
	switch (period) {
		case 'last-month':
			eachPastMonthDate = [getLastMonthFromToDates()[0]]
			break;
		case 'year-to-date':
			eachPastMonthDate = [...Array((getMonth(startOfToday()) + 1)).keys()].map((value) => addMonths(getYearToDateFromToDates()[0], value))
			break;
		case 'last-year':
			eachPastMonthDate = [...Array(12).keys()].map((value) => addMonths(getLastYearFromToDates()[0], value))
			break;
		case 'month-to-date':
			eachPastMonthDate = [...Array(1).keys()].reverse().map((value) => subMonths(startOfToday(), value))
			break;
		case '3-months-to-date':
			eachPastMonthDate = [...Array(3).keys()].reverse().map((value) => subMonths(startOfToday(), value))
			break;
		case '6-months-to-date':
			eachPastMonthDate = [...Array(6).keys()].reverse().map((value) => subMonths(startOfToday(), value))
			break;
		default:
			eachPastMonthDate = [getLastMonthFromToDates()[0]]
	}
	return eachPastMonthDate;
}