import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { Formik, Form, Field } from "formik";
import { TextField } from "@material-ui/core";
import moment from "moment";
import api from "../services/api";
import * as yup from "yup";

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

function CancelDialog({ visibleChange, appointment, setData, ...other }) {
    const validationSchema = yup.object().shape({
        password: yup.string().required("A senha é obrigatória"),
    });

    async function deleteSchedule({ values }) {
        try {
            const schedule = await api({
                method: "delete",
                url: "/schedule",
                data: {
                    password: values.password,
                    _id: values._id,
                },
            });
            setData(schedule.data);
            visibleChange();
        } catch (e) {
            console.log(e.response);
            if (e.response.data.error === "Incorrect password")
                alert("Senha incorreta");
            else alert("Erro ao efetuar o cancelamento");
        }
    }

    return (
        <Formik
            initialValues={{ password: "", ...appointment[0] }}
            onSubmit={(values) => deleteSchedule({ values })}
            validationSchema={validationSchema}
        >
            {({ isSubmitting, errors, touched }) => (
                <Form>
                    <DialogTitle id="cancel-scheudle" onClose={visibleChange}>
                        Cancelar horário
                    </DialogTitle>
                    <DialogContent dividers>
                        <Typography gutterBottom>
                            Verifique os dados do horário que deseja realizar o
                            cancelamento
                        </Typography>

                        <TextField
                            label="Nome"
                            value={appointment[0].name}
                            disabled
                            fullWidth
                            variant="outlined"
                            margin="normal"
                        />
                        <TextField
                            label="Apartamento"
                            value={appointment[0].apartment}
                            disabled
                            fullWidth
                            variant="outlined"
                            margin="normal"
                        />
                        <TextField
                            label="Início"
                            value={moment(appointment[0].startDate).format(
                                "HH:mm DD/MM"
                            )}
                            disabled
                            fullWidth
                            variant="outlined"
                            margin="normal"
                        />
                        <TextField
                            label="Fim"
                            value={moment(appointment[0].endDate).format(
                                "HH:mm DD/MM"
                            )}
                            disabled
                            fullWidth
                            variant="outlined"
                            margin="normal"
                        />
                        <Field
                            label="Senha do agendamento"
                            name="password"
                            type="password"
                            as={TextField}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            error={!!(touched.password && errors.password)}
                            helperText={touched.password && errors.password}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            type="submit"
                            color="secondary"
                            disabled={isSubmitting}
                        >
                            Cancelar horário
                        </Button>
                    </DialogActions>
                </Form>
            )}
        </Formik>
    );
}

function AddDialog({ visibleChange, data, setData, ...other }) {
    const validationSchema = yup.object().shape({
        name: yup.string().required("É necessário definir um nome"),
        apartment: yup
            .string()
            .required("O número do apartamento é necessário"),
        password: yup.string().required("É necessário definir uma senha"),
    });

    async function makeSchedule({ values }) {
        try {
            const schedule = await api.post("/newschedule", { ...values });
            setData(schedule.data);
            visibleChange();
        } catch (e) {
            alert("Erro ao agendar horário");
        }
    }

    return (
        <Formik
            initialValues={{
                name: "",
                apartment: "",
                password: "",
                startDate: other.appointmentData.startDate,
                endDate: other.appointmentData.endDate,
            }}
            onSubmit={(values) => makeSchedule({ values })}
            validationSchema={validationSchema}
        >
            {({ values, isSubmitting, errors, touched }) => (
                <Form>
                    <DialogTitle id="add-schedule" onClose={visibleChange}>
                        Reserva de horário
                    </DialogTitle>
                    <DialogContent dividers>
                        <Typography gutterBottom>
                            Cada morador tem direito a reservar a academia por
                            1h por dia, no máximo 3 vezes por semana. Este site
                            não faz o controle do número de dias que cada
                            morador está reservando, portanto use o bom senso.
                        </Typography>
                        <Field
                            label="Nome"
                            name="name"
                            type="text"
                            as={TextField}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            error={!!(touched.name && errors.name)}
                            helperText={touched.name && errors.name}
                        />
                        <Field
                            label="Apartamento"
                            name="apartment"
                            type="number"
                            as={TextField}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            error={!!(touched.apartment && errors.apartment)}
                            helperText={touched.apartment && errors.apartment}
                        />
                        <TextField
                            value={moment(values.startDate).format(
                                "HH:mm DD/MM"
                            )}
                            label="Início"
                            name="startDate"
                            variant="outlined"
                            fullWidth
                            disabled
                            margin="normal"
                        />
                        <TextField
                            value={moment(values.endDate).format("HH:mm DD/MM")}
                            label="Fim"
                            name="endDate"
                            variant="outlined"
                            fullWidth
                            disabled
                            margin="normal"
                        />
                        <Field
                            label="Defina uma senha"
                            name="password"
                            type="password"
                            as={TextField}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            error={!!(touched.password && errors.password)}
                            helperText={touched.password && errors.password}
                        />
                        <Typography>
                            A senha será necessária caso você deseje cancelar o
                            seu horário
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            type="submit"
                            color="primary"
                            disabled={isSubmitting}
                        >
                            Salvar horário
                        </Button>
                    </DialogActions>
                </Form>
            )}
        </Formik>
    );
}

export default function ManageSchedule({
    visible,
    visibleChange,
    data,
    setData,
    ...other
}) {
    const [inUse, setInUse] = useState(false);
    const [appointment] = useState(
        data.filter((schedule) =>
            moment(schedule.startDate).isSame(other.appointmentData.startDate)
        )
    );

    useEffect(() => {
        if (appointment.length > 0) {
            setInUse(true);
        }
        //eslint-disable-next-line
    }, []);

    if (!inUse) {
        return (
            <Dialog
                onClose={visibleChange}
                aria-labelledby="customized-dialog-title"
                open={visible}
                maxWidth="sm"
            >
                <AddDialog
                    visibleChange={visibleChange}
                    data={data}
                    setData={setData}
                    {...other}
                />
            </Dialog>
        );
    } else {
        return (
            <Dialog
                onClose={visibleChange}
                aria-labelledby="customized-dialog-title"
                open={visible}
                maxWidth="sm"
            >
                <CancelDialog
                    data={data}
                    visibleChange={visibleChange}
                    appointment={appointment}
                    setData={setData}
                    {...other}
                />
            </Dialog>
        );
    }
}
