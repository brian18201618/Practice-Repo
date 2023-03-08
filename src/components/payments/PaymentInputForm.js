import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import CustomSnackbar from '../CustomSnackbar'
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import * as Yup from "yup";
import { withRouter } from "react-router-dom";
import { format, startOfToday } from "date-fns";
import CustomCircularProgress from "../CustomCircularProgress";

const defaultDate = format(startOfToday(), 'yyyy-MM-dd')
const PaymentSchema = Yup.object().shape({
	tenant_id: Yup.string().trim().required('Tenant is required'),
	memo: Yup.string().trim().max(50, "Memo details should be less than 50 characters").default(''),
	charge_balance: Yup.number().typeError('Charge Balance must be a number').required("Charge balance is required"),
	payment_amount: Yup.number().typeError('Amount must be a number')
		.positive("Amount must be a positive number")
		.max(Yup.ref('charge_balance'), 'Payment Amount Cannot be greater than remaining balance')
		.required("Payment amount is required"),
	payment_date: Yup.date().required('Payment Date is Required'),
});


let PaymentInputForm = (props) => {
	const classes = commonStyles();
	const { history, chargeToAddPayment, tenantLease, handleItemSubmit } = props
	const paymentValues = {
		charge_id: chargeToAddPayment.id,
		unit_id: chargeToAddPayment.unit_id,
		charge_amount: chargeToAddPayment.charge_amount || 0,
		charge_balance: chargeToAddPayment.balance || 0,
		charge_label: chargeToAddPayment.charge_label || 0,
		charge_type: chargeToAddPayment.charge_type || 0,
		payment_amount: "",
		memo: "",
		payment_date: defaultDate,
		tenant_id: chargeToAddPayment.tenant_id,
		property_id: chargeToAddPayment.property_id,
		tenantLease: tenantLease,
	};

	return (
		<Formik
			initialValues={paymentValues}
			enableReinitialize validationSchema={PaymentSchema}
			onSubmit={async (values, { resetForm, setStatus }) => {
				try {
					const chargePayment = {
						charge_id: values.charge_id,
						payment_amount: values.payment_amount,
						memo: values.memo,
						payment_date: values.payment_date,
						tenant_id: values.tenant_id,
						unit_id: values.unit_id,
						property_id: values.property_id,
						payment_label: values.charge_label,
						payment_type: values.charge_type,
					};
					if (values.tenantLease) {
						// charge the payment on the security deposit
						const securityDepositAfterCharge = parseFloat(values.tenantLease.security_deposit) - parseFloat(values.payment_amount)
						const leaseToEdit = {
							id: values.tenantLease.id,
							security_deposit: securityDepositAfterCharge
						}
						await handleItemSubmit(leaseToEdit, 'leases')
						chargePayment.security_deposit_charge_id = values.tenantLease.id
					}
					await handleItemSubmit(chargePayment, 'charge-payments')
					await handleItemSubmit({ id: values.charge_id, payed: true }, 'transactions-charges')
					resetForm({});
					history.goBack()
					setStatus({ sent: true, msg: "Details saved successfully!" })
				} catch (error) {
					setStatus({ sent: false, msg: `Error! ${error}.` })
				}
			}}
		>
			{({
				values,
				status,
				handleSubmit,
				touched,
				errors,
				handleChange,
				handleBlur,
				isSubmitting,
			}) => (
				<form
					className={classes.form}
					method="post"
					id="paymentInputForm"
					onSubmit={handleSubmit}
				>
					<Grid container spacing={2} direction="column">
						{
							status && status.msg && (
								<CustomSnackbar
									variant={status.sent ? "success" : "error"}
									message={status.msg}
								/>
							)
						}
						{
							isSubmitting && (<CustomCircularProgress open={true} />)
						}
						<Grid item>
							<Typography variant="subtitle1"> Charge Details : {values.charge_label}</Typography>
						</Grid>
						<Grid item>
							<Typography variant="subtitle1">Total Charge Amount : {values.charge_amount}</Typography>
						</Grid>
						<Grid item>
							<Typography variant="subtitle1">Charge Balance: {values.charge_balance}</Typography>
						</Grid>
						<Grid item>
							<TextField
								fullWidth
								variant="outlined"
								id="payment_date"
								type="date"
								name="payment_date"
								label="Payment Date"
								value={values.payment_date}
								onChange={handleChange}
								onBlur={handleBlur}
								InputLabelProps={{ shrink: true }}
								error={errors.payment_date && touched.payment_date}
								helperText={touched.payment_date && errors.payment_date}
							/>
						</Grid>
						<Grid item>
							<TextField
								fullWidth
								type="text"
								variant="outlined"
								name="payment_amount"
								id="payment_amount"
								label="Payment Amount"
								value={values.payment_amount}
								onChange={handleChange}
								onBlur={handleBlur}
								error={errors.payment_amount && touched.payment_amount}
								helperText={touched.payment_amount && errors.payment_amount}
							/>
						</Grid>
						<Grid item>
							<TextField
								fullWidth
								type="text"
								multiline
								rows={4}
								variant="outlined"
								name="memo"
								id="memo"
								label="Payment Details/Memo"
								value={values.memo}
								onChange={handleChange}
								onBlur={handleBlur}
								error={errors.memo && touched.memo}
								helperText={"Include details for the payments here (max 50)"}
							/>
						</Grid>
						<Grid
							item
							container
							justify="flex-start"
							direction="row"
							className={classes.buttonBox}
						>
							<Grid item>
								<Button
									color="secondary"
									variant="contained"
									size="medium"
									startIcon={<CancelIcon />}
									onClick={() => history.goBack()}
									disableElevation
								>
									Cancel
									</Button>
							</Grid>
							<Grid item>
								<Button
									type="submit"
									color="primary"
									variant="contained"
									size="medium"
									startIcon={<SaveIcon />}
									form="paymentInputForm"
									disabled={isSubmitting}
								>
									Save Payment
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</form>
			)
			}
		</Formik >
	);
};


export default withRouter(PaymentInputForm);