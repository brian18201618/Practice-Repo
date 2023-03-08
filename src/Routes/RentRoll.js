import Grid from "@material-ui/core/Grid";
import React, { useEffect, useState } from "react";
import TabPanel from "../components/TabPanel";
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import PrintArrayToPdf from "../components/PrintArrayToPdfBtn";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import CommonTable from "../components/table/commonTable";
import { connect } from "react-redux";
import { commonStyles } from "../components/commonStyles";
import Layout from "../components/PrivateLayout";
import PageHeading from "../components/PageHeading";
import RentBalancesPage from "./RentBalancesPage";
import { handleItemFormSubmit, handleDelete } from '../actions/actions'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getTransactionsFilterOptions, currencyFormatter, getCurrentMonthFromToDates, getLastMonthFromToDates, getLastThreeMonthsFromToDates, getLastYearFromToDates, getYearToDateFromToDates } from "../assets/commonAssets";
import { parse, isWithinInterval } from "date-fns";
const TRANSACTIONS_FILTER_OPTIONS = getTransactionsFilterOptions()



const headCells = [
    { id: "unit_details", numeric: false, disablePadding: true, label: "Unit Details", },
    { id: "tenant_name", numeric: false, disablePadding: true, label: "Tenant Name", },
    { id: "tenant_id_number", numeric: false, disablePadding: true, label: "Tenant ID", },
    { id: "due_date", numeric: false, disablePadding: true, label: "Rent Due Date", },
    { id: "charge_amount", numeric: false, disablePadding: true, label: "Rent Charge Amount", },
    { id: "payed_status", numeric: false, disablePadding: true, label: "Payments Made" },
    { id: "payed_amount", numeric: false, disablePadding: true, label: "Total Amounts Paid" },
    { id: "balance", numeric: false, disablePadding: true, label: "Rent Balance" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },
];

let RentRollPage = ({
    transactionsCharges,
    properties,
    contacts,
    leases,
    transactions,
    handleItemSubmit,
    handleItemDelete
}) => {
    let [rentCharges, setChargeItems] = useState([]);
    let [filteredChargeItems, setFilteredChargeItems] = useState([]);
    let [propertyFilter, setPropertyFilter] = useState("all");
    let [contactFilter, setContactFilter] = useState(null);
    let [periodFilter, setPeriodFilter] = useState("month-to-date");
    let [fromDateFilter, setFromDateFilter] = useState('');
    let [toDateFilter, setToDateFilter] = useState("");
    const [selected, setSelected] = useState([]);
    const classes = commonStyles();

    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const rentChargesWithBalances = rentCharges.filter(rentCharge => rentCharge.balance > 0)

    const totalRentCharges = filteredChargeItems
        .reduce((total, currentValue) => {
            return total + parseFloat(currentValue.charge_amount) || 0
        }, 0)

    const totalRentPayments = filteredChargeItems
        .reduce((total, currentValue) => {
            return total + parseFloat(currentValue.payed_amount) || 0
        }, 0)

    useEffect(() => {
        const dateRange = getCurrentMonthFromToDates()
        const startOfPeriod = dateRange[0]
        const endOfPeriod = dateRange[1]
        const chargesForCurrentMonth = transactionsCharges.filter((chargeItem) => {
            const chargeItemDate = parse(chargeItem.charge_date, 'yyyy-MM-dd', new Date())
            return isWithinInterval(chargeItemDate, { start: startOfPeriod, end: endOfPeriod })
        })
        setChargeItems(chargesForCurrentMonth);
        setFilteredChargeItems(chargesForCurrentMonth);
    }, [transactionsCharges]);

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the charges according to the search criteria here
        let filteredRentCharges = transactionsCharges
        let dateRange = []
        let startOfPeriod;
        let endOfPeriod;
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
            default:
                dateRange = getLastMonthFromToDates()
                startOfPeriod = dateRange[0]
                endOfPeriod = dateRange[1]
        }
        filteredRentCharges = filteredRentCharges.filter((chargeItem) => {
            const chargeItemDate = parse(chargeItem.charge_date, 'yyyy-MM-dd', new Date())
            return isWithinInterval(chargeItemDate, { start: startOfPeriod, end: endOfPeriod })
        })
        filteredRentCharges = filteredRentCharges
            .filter(({ charge_date }) => !fromDateFilter ? true : charge_date >= fromDateFilter)
            .filter(({ charge_date }) => !toDateFilter ? true : charge_date <= toDateFilter)
            .filter(({ property_id }) => propertyFilter === "all" ? true : property_id === propertyFilter)
            .filter(({ tenant_id }) => !contactFilter ? true : tenant_id === contactFilter.id)
        setFilteredChargeItems(filteredRentCharges);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFilteredChargeItems(rentCharges);
        setPropertyFilter("all");
        setContactFilter(null);
        setPeriodFilter("month-to-date");
        setFromDateFilter("");
        setToDateFilter("");
    };

    const setChargesPaidInFull = () => {
        const chargesToAddPayments = transactionsCharges.filter(({ id }) => selected.includes(id))
            .filter(({ payed_status }) => payed_status === false)
        //post the charges here to show that they are payed
        chargesToAddPayments.forEach(async (charge) => {
            const chargePayment = {
                charge_id: charge.id,
                payment_amount: charge.charge_amount,
                payment_date: charge.due_date,
                tenant_id: charge.tenant_id,
                unit_id: charge.unit_id,
                property_id: charge.property_id,
                payment_label: charge.charge_label,
                memo: "Rent Payment",
                payment_type: charge.charge_type,
            };
            await handleItemSubmit(chargePayment, 'charge-payments')
            await handleItemSubmit({ id: charge.id, payed: true }, 'transactions-charges')
        })
    }

    const handleRentChargeDelete = async (chargeId, url) => {
        transactions.filter((payment) => payment.charge_id === chargeId).forEach(async payment => {
            await handleItemDelete(payment.id, "charge-payments")
            if (payment.security_deposit_charge_id) {
                const leaseWithChargeOnDeposit = leases.find(({ id }) => id === payment.security_deposit_charge_id)
                if (leaseWithChargeOnDeposit) {
                    const securityDepositBeforePayment = parseFloat(leaseWithChargeOnDeposit.security_deposit) + parseFloat(payment.payment_amount)
                    const leaseToEdit = {
                        id: payment.security_deposit_charge_id,
                        security_deposit: securityDepositBeforePayment
                    }
                    await handleItemSubmit(leaseToEdit, 'leases')
                }
            }
        });
        await handleItemDelete(chargeId, url)
    }

    return (
        <Layout pageTitle="Rent Charges Roll">
            <AppBar position="static">
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
                    <Tab label="Rent Charges Roll" />
                    <Tab label="Rent Outstanding Balances" />
                </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={1}>
                <RentBalancesPage transactionsCharges={rentChargesWithBalances} properties={properties}
                    contacts={contacts} classes={classes} />
            </TabPanel>
            <TabPanel value={tabValue} index={0}>
                <Grid
                    container
                    spacing={3}
                    justify="center" direction="column"
                >
                    <Grid item key={2}>
                        <PageHeading text={"Rent Charges Roll"} />
                    </Grid>
                    <Grid
                        container
                        spacing={2}
                        item
                        alignItems="center"
                        direction="row"
                        key={1}
                    >
                        <Grid item>
                            <Button
                                type="button"
                                color="primary"
                                variant="contained"
                                size="medium"
                                startIcon={<AddIcon />}
                                disabled={!selected.length}
                                onClick={() => setChargesPaidInFull()}
                            >
                                Receive Full Payments
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                type="button"
                                color="primary"
                                variant="contained"
                                size="medium"
                                disabled={!selected.length}
                                startIcon={<AddIcon />}
                                component={Link}
                                to={`/app/payments/${selected[0]}/new`}
                            >
                                Receive Payment
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                type="button"
                                color="primary"
                                variant="contained"
                                size="medium"
                                disabled={!selected.length}
                                startIcon={<AddIcon />}
                                to={`/app/payments/${selected[0]}/new?charge_deposit=1`}
                                component={Link}
                            >
                                Charge on Deposit
                            </Button>
                        </Grid>
                        <Grid item>
                            <PrintArrayToPdf
                                disabled={!selected.length}
                                reportName={'Rent Charges Roll Records'}
                                reportTitle={'Rent Charges Roll Data'}
                                headCells={headCells}
                                dataToPrint={rentCharges.filter(({ id }) => selected.includes(id))}
                            />
                        </Grid>
                        <Grid item>
                            <ExportToExcelBtn
                                disabled={!selected.length}
                                reportName={'Rent Charges Roll Records'}
                                reportTitle={'Rent Charges Roll Data'}
                                headCells={headCells}
                                dataToPrint={rentCharges.filter(({ id }) => selected.includes(id))}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Box
                            border={1}
                            borderRadius="borderRadius"
                            borderColor="grey.400"
                        >
                            <form
                                className={classes.form}
                                id="rentRollSearchForm"
                                onSubmit={handleSearchFormSubmit}
                            >
                                <Grid
                                    container
                                    spacing={2}
                                    justify="center"
                                >
                                    <Grid item container spacing={2}>
                                        <Grid item container direction="row" spacing={2}>
                                            <Grid item container xs={12} md={6} direction="row" spacing={2}>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        fullWidth
                                                        variant="outlined"
                                                        type="date"
                                                        id="from_date_filter"
                                                        name="from_date_filter"
                                                        label="From Date"
                                                        value={fromDateFilter}
                                                        onChange={(event) => {
                                                            setFromDateFilter(
                                                                event.target.value
                                                            );
                                                        }}
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        fullWidth
                                                        variant="outlined"
                                                        type="date"
                                                        name="to_date_filter"
                                                        label="To Date"
                                                        id="to_date_filter"
                                                        onChange={(event) => {
                                                            setToDateFilter(event.target.value);
                                                        }}
                                                        value={toDateFilter}
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    select
                                                    id="period_filter"
                                                    name="period_filter"
                                                    label="Period"
                                                    value={periodFilter}
                                                    onChange={(event) => {
                                                        setPeriodFilter(
                                                            event.target.value
                                                        );
                                                    }}
                                                    InputLabelProps={{ shrink: true }}
                                                >
                                                    {TRANSACTIONS_FILTER_OPTIONS.map((filterOption, index) => (
                                                        <MenuItem
                                                            key={index}
                                                            value={filterOption.id}
                                                        >
                                                            {filterOption.text}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                        </Grid>
                                        <Grid item container direction="row" spacing={2}>
                                            <Grid item md={6} xs={12}>
                                                <TextField
                                                    fullWidth
                                                    select
                                                    variant="outlined"
                                                    name="property_filter"
                                                    label="Property"
                                                    id="property_filter"
                                                    onChange={(event) => {
                                                        setPropertyFilter(
                                                            event.target.value
                                                        );
                                                    }}
                                                    value={propertyFilter}
                                                >
                                                    <MenuItem key={"all"} value={"all"}>All Properties</MenuItem>
                                                    {properties.map(
                                                        (property, index) => (
                                                            <MenuItem
                                                                key={index}
                                                                value={property.id}
                                                            >
                                                                {property.ref}
                                                            </MenuItem>
                                                        )
                                                    )}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Autocomplete
                                                    id="contact_filter"
                                                    options={contacts}
                                                    getOptionSelected={(option, value) => option.id === value.id}
                                                    name="contact_filter"
                                                    onChange={(event, newValue) => {
                                                        setContactFilter(newValue);
                                                    }}
                                                    value={contactFilter}
                                                    getOptionLabel={(tenant) => tenant ? `${tenant.first_name} ${tenant.last_name}` : ''}
                                                    style={{ width: "100%" }}
                                                    renderInput={(params) => <TextField {...params} label="Tenant" variant="outlined" />}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        container
                                        spacing={2}
                                        item
                                        justify="flex-end"
                                        alignItems="center"
                                        direction="row"
                                        key={1}
                                    >
                                        <Grid item>
                                            <Button
                                                onClick={(event) => handleSearchFormSubmit(event)}
                                                type="submit"
                                                form="rentRollSearchForm"
                                                color="primary"
                                                variant="contained"
                                                size="medium"
                                                startIcon={<SearchIcon />}
                                            >
                                                SEARCH
                                    </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                onClick={(event) => resetSearchForm(event)}
                                                type="reset"
                                                form="rentRollSearchForm"
                                                color="primary"
                                                variant="contained"
                                                size="medium"
                                                startIcon={<UndoIcon />}
                                            >
                                                RESET
                                    </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </form>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Box border={1} borderRadius="borderRadius" borderColor="grey.400" className={classes.form}>
                            <Grid container direction="row" spacing={1}>
                                <Grid item container md={4}>
                                    <Grid item sm={12}>
                                        <Typography variant="subtitle1" align="center">
                                            Total Rent Charges: {currencyFormatter.format(totalRentCharges)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container md={4}>
                                    <Grid item sm={12}>
                                        <Typography variant="subtitle1" align="center">
                                            Total Rent Payments: {currencyFormatter.format(totalRentPayments)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container md={4}>
                                    <Grid item sm={12}>
                                        <Typography variant="subtitle1" align="center">
                                            Outstanding Rent Balances: {currencyFormatter.format((totalRentCharges - totalRentPayments))}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <CommonTable
                            selected={selected}
                            setSelected={setSelected}
                            rows={filteredChargeItems}
                            headCells={headCells}
                            noEditCol={true}
                            noDetailsCol={true}
                            deleteUrl={'transactions-charges'}
                            handleDelete={handleRentChargeDelete}
                        />
                    </Grid>
                </Grid>
            </TabPanel>
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return {
        properties: state.properties,
        transactions: state.transactions.filter((payment) => payment.payment_type === 'rent'),
        transactionsCharges: state.transactionsCharges
            .filter((charge) => charge.charge_type === 'rent')
            .map((charge) => {
                const tenant = state.contacts.find((contact) => contact.id === charge.tenant_id) || {};
                const unitWithCharge = state.propertyUnits.find(({ id }) => id === charge.unit_id) || {};
                const chargeDetails = {}
                chargeDetails.tenant_name = `${tenant.first_name} ${tenant.last_name}`
                chargeDetails.tenant_id_number = tenant.id_number
                const chargePayments = state.transactions.filter((payment) => payment.charge_id === charge.id)
                chargeDetails.payed_status = chargePayments.length ? true : false;
                const payed_amount = chargePayments.reduce((total, currentValue) => {
                    return total + parseFloat(currentValue.payment_amount) || 0
                }, 0)
                chargeDetails.payed_amount = payed_amount
                chargeDetails.balance = parseFloat(charge.charge_amount) - payed_amount
                const property = state.properties.find(property => property.id === charge.property_id) || {}
                chargeDetails.unit_details = `${property.ref} - ${unitWithCharge.ref}`;
                return Object.assign({}, charge, chargeDetails);
            }).sort((charge1, charge2) => parse(charge2.charge_date, 'yyyy-MM-dd', new Date()) -
                parse(charge1.charge_date, 'yyyy-MM-dd', new Date())),
        contacts: state.contacts,
        leases: state.leases,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
        handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(RentRollPage);
