import { Paper, Stack, Typography } from "@mui/material";
import DriverCard from "./DriverCard";
import type { TripResponse } from "../../api/generated/models/TripResponse";

type Props = {
    trips: TripResponse[];
};

function DriverList({ trips }: Props) {
    return (
        <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h6" component="h2">
                    Potential drivers
                </Typography>

                {trips.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        Currently no ride offerings for this route
                    </Typography>
                ) : (
                    trips.map((trip) => (
                        <DriverCard key={trip.id} trip={trip} />
                    ))
                )}
            </Stack>
        </Paper>
    );
}

export default DriverList;