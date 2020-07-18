import React, { useState } from "react";
import {
    CircularProgress,
    Container,
    Paper,
    Typography,
} from "@material-ui/core";
import {
    AppointmentForm,
    Appointments,
    Scheduler,
    WeekView,
} from "@devexpress/dx-react-scheduler-material-ui";
import { EditingState } from "@devexpress/dx-react-scheduler";
import { connectProps } from "@devexpress/dx-react-core";
import ManageSchedule from "../components/ScheduleTime";
import useApiRequest from "../hooks/useApiRequest";
import { StyledAppointmentsContainer } from "./styles";

const mapAppointmentData = (appointment) => ({
    ...appointment,
    title: `${appointment.name} - ${appointment.apartment}`,
});

const AppointmentContainer = (props) => {
    return <StyledAppointmentsContainer {...props} />;
};

export default function Home() {
    const { data, setData, loading, error } = useApiRequest(true, "/calendar");

    const [editingFormVisibility, setEditingFormVisibility] = useState(false);

    const [editingAppointment, setEditingAppointment] = useState(undefined);
    const [addedAppointment, setAddedApointment] = useState({});
    const [isNewAppointment, setIsNewAppointment] = useState(false);
    const [previousAppointment, setPreviousAppointment] = useState(undefined);

    const toggleEditingFormVisibility = () => {
        setEditingFormVisibility(!editingFormVisibility);
    };

    const onEditingAppointmentChange = (editingAppointment) => {
        setEditingAppointment(editingAppointment);
    };

    const onAddedAppointmentChange = (addedAppointment) => {
        setAddedApointment(addedAppointment);
        if (editingAppointment !== undefined) {
            setPreviousAppointment(editingAppointment);
        }
        setEditingAppointment(undefined);
        setIsNewAppointment(true);
    };

    const dialogFormWrapper = connectProps(ManageSchedule, () => {
        if (data) {
            const currentAppointment =
                data.filter(
                    (appointment) =>
                        editingAppointment &&
                        appointment._id === editingAppointment._id
                )[0] || addedAppointment;

            const cancelAppointment = () => {
                if (isNewAppointment) {
                    setEditingAppointment(previousAppointment);
                    setIsNewAppointment(false);
                }
            };

            return {
                visible: editingFormVisibility,
                appointmentData: currentAppointment,
                visibleChange: toggleEditingFormVisibility,
                onEditingAppointmentChange,
                cancelAppointment,
                data,
                setData,
            };
        }
    });

    const formattedData = data ? data.map(mapAppointmentData) : [];

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{
                    display: "flex",
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography align="middle">
                    Erro ao contactar o servidor
                </Typography>
            </div>
        );
    }

    return (
        <Container maxWidth="lg" style={{ marginBottom: 32 }}>
            <div style={{ padding: 20 }}>
                <Typography align="center" variant="h5" gutterBottom>
                    Reserva de horários para academia do Nine
                </Typography>
                <Typography align="center" gutterBottom>
                    Para agendar um horário, de um duplo clique em algum horário
                    livre.
                </Typography>
                <Typography align="center" gutterBottom>
                    Para cancelar um horário, de um duplo clique em seu horário.
                </Typography>
            </div>
            <Paper>
                <Scheduler data={formattedData}>
                    <EditingState
                        onEditingAppointmentChange={onEditingAppointmentChange}
                        onAddedAppointmentChange={onAddedAppointmentChange}
                    />
                    <WeekView
                        startDayHour={6}
                        endDayHour={22}
                        cellDuration={60}
                    />
                    <Appointments containerComponent={AppointmentContainer} />
                    <AppointmentForm
                        overlayComponent={dialogFormWrapper}
                        visible={editingFormVisibility}
                        onVisibilityChange={toggleEditingFormVisibility}
                    />
                </Scheduler>
            </Paper>
        </Container>
    );
}
