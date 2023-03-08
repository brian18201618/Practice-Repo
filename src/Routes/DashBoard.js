import React, { useEffect, useState } from "react";
import Layout from "../components/myLayout";
import { connect } from "react-redux";
import PageHeading from "../components/PageHeading";
import InfoDisplayPaper from "../components/InfoDisplayPaper";
import CustomSnackBar from "../components/CustomSnackbar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {commonStyles} from '../components/commonStyles'
import * as Yup from "yup";
import { Formik } from "formik";
import moment from "moment";

const FilterYearSchema = Yup.object().shape({
  filter_year: Yup.number()
    .typeError("Year must be a number!")
    .required("Year is required")
    .positive()
    .min(2000, "Must be greater than 2000")
    .max(2100, "We won't be here during those times dear")
    .integer(),
});

let DashBoardPage = (props) => {
  const classes = commonStyles()
  const [transactionItems, setTransactionItems] = useState([]);
  const { propertyUnits, contacts, transactions, notices, error } = props;

  useEffect(() => {
    setTransactionItems(transactions);
  }, [transactions]);

  const setFilteredTransactionItemsByYear = (filterYear) => {
    setTransactionItems(
      transactions.filter(
        ({ transaction_date }) =>
          moment(transaction_date).year() === filterYear
      )
    );
  };

  const totalProperties = propertyUnits.length;
  //get the number of the different units by category
  const bedSitterUnits = propertyUnits.filter((property) => property.unit_type === 'Bedsitter').length;
  const oneBedUnits = propertyUnits.filter((property) => property.unit_type === 'One Bedroom').length;
  const twoBedUnits = propertyUnits.filter((property) => property.unit_type === 'Two Bedroom').length;
  const singleRoomUnits = propertyUnits.filter((property) => property.unit_type === 'Single Room').length;
  const doubleRoomUnits = propertyUnits.filter((property) => property.unit_type === 'Double Room').length;
  const shopUnits = propertyUnits.filter((property) => property.unit_type === 'Shop').length;
  //get the current number of occupied houses
  const occupiedHouses = transactionItems.filter(({ transaction_date }) => moment(transaction_date).month() === moment().month())
    .length;
  //get months in an year in short format
  const monthsOfTheYear = moment.monthsShort();
  //
  const transactionsGraphData = Array.from(monthsOfTheYear, (monthOfYear) => ({
    month: monthOfYear,
    amount: 0,
    numberOfTransactions: 0,
  }));

  transactionItems.forEach(({ transaction_date, transaction_price }) => {
    const currentMonth = moment(transaction_date).get("month");
    transactionsGraphData[currentMonth].amount =
      transactionsGraphData[currentMonth].amount +
      parseFloat(transaction_price);
    transactionsGraphData[currentMonth].numberOfTransactions =
      transactionsGraphData[currentMonth].numberOfTransactions + 1;
  });

  const occupancyRateData = transactionsGraphData.map((transaction) => ({
    month: transaction.month,
    rate: (transaction.numberOfTransactions / totalProperties) * 100,
  }));

  return (
    <Layout pageTitle="Dashboard">
      <Grid container justify="center" direction="column" spacing={4}>
        <Grid item key={0}>
          <PageHeading paddingLeft={2} text={"Dashboard"} />
        </Grid>
        <Grid
          item
          container
          spacing={2}
          direction="row"
          alignItems="stretch"
          justify="space-around"
          key={3}
        >
          <InfoDisplayPaper xs={6} title={"Bed Sitters"} value={bedSitterUnits} />
          <InfoDisplayPaper xs={6} title={"1 Bed"} value={oneBedUnits} />
          <InfoDisplayPaper xs={6} title={"2 Beds"} value={twoBedUnits} />
          <InfoDisplayPaper xs={6} title={"Single Room"} value={singleRoomUnits} />
          <InfoDisplayPaper xs={6} title={"Double Room"} value={doubleRoomUnits} />
          <InfoDisplayPaper xs={6} title={"Shop"} value={shopUnits} />
        </Grid>
        <Grid
          item
          container
          spacing={2}
          direction="row"
          alignItems="stretch"
          justify="space-around"
          key={2}
        >
          <InfoDisplayPaper xs={12} title={"Total Rentals"} value={totalProperties} />
          <InfoDisplayPaper xs={12} title={"Currently Occupied Rentals"} value={occupiedHouses} />
          <InfoDisplayPaper xs={12} title={"Currently Unoccupied Rentals"} value={totalProperties - occupiedHouses} />
          <InfoDisplayPaper xs={12} title={"Current Month Occupancy Rate"} value={((occupiedHouses / totalProperties) * 100) | 0} />
        </Grid>
        <Grid item>
          <Box
            border={1}
            p={4}
            borderRadius="borderRadius"
            borderColor="grey.400"
          >
            <Grid container direction="column" spacing={4}>
              <Grid item>
                <Box
                  border={1}
                  borderRadius="borderRadius"
                  borderColor="grey.400"
                >
                  <Formik
                    initialValues={{ filter_year: moment().get("year") }}
                    validationSchema={FilterYearSchema}
                    onSubmit={(values) => {
                      setFilteredTransactionItemsByYear(parseInt(values.filter_year));
                    }}
                  >
                    {({
                      values,
                      handleSubmit,
                      touched,
                      errors,
                      handleChange,
                      handleBlur,
                    }) => (
                        <form
                          className={classes.form}
                          id="yearFilterForm"
                          onSubmit={handleSubmit}
                        >
                          <Grid
                            container
                            spacing={2}
                            alignItems="center"
                            justify="center"
                            direction="row"
                          >
                            <Grid item>
                              <TextField
                                variant="outlined"
                                id="filter_year"
                                name="filter_year"
                                label="Year"
                                value={values.filter_year}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.filter_year && touched.filter_year}
                                helperText={
                                  touched.filter_year && errors.filter_year
                                }
                              />
                            </Grid>
                            <Grid item>
                              <Button
                                type="submit"
                                form="yearFilterForm"
                                color="primary"
                                variant="contained"
                                size="medium"
                                startIcon={<SearchIcon />}
                              >
                                SEARCH
                            </Button>
                            </Grid>
                          </Grid>
                        </form>
                      )}
                  </Formik>
                </Box>
              </Grid>
              <Grid item>
                <Box
                  p={2}
                  border={1}
                  borderRadius="borderRadius"
                  borderColor="grey.400"
                >
                  <Typography variant="h6" align="center" gutterBottom>
                    Monthly Rent Collection
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                      data={transactionsGraphData}
                      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                    >
                      <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Legend />
                      <Tooltip />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
              <Grid item>
                <Box
                  p={2}
                  border={1}
                  borderRadius="borderRadius"
                  borderColor="grey.400"
                >
                  <Typography variant="h6" align="center" gutterBottom>
                    Monthly House Occupany Rate
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                      data={occupancyRateData}
                      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                    >
                      <Line type="monotone" dataKey="rate" stroke="#8884d8" />
                      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                      <Legend />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      {
        error ? <CustomSnackBar variant="error" message={error}/> : null
      }
    </Layout>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    notices: state.notices,
    propertyUnits: state.propertyUnits,
    transactions: state.transactions,
    users: state.users,
    currentUser: state.currentUser,
    contacts: state.contacts,
    isLoading: state.isLoading,
    error: state.error,
  };
};

export default connect(mapStateToProps)(DashBoardPage);
