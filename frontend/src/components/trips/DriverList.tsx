import { Paper, Stack, Typography } from "@mui/material";
import DriverCard from "./DriverCard";
import type { User } from "../../types";

type Props = {
    drivers: User[];
};

function DriverList({ drivers }: Props) {
    return (
        <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h6" component="h2">
                    Potential drivers
                </Typography>

                {drivers.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        Currently no ride offerings for this route
                    </Typography>
                ) : (
                    drivers.map((driver) => (
                        <DriverCard key={driver.id} driver={driver} />
                    ))
                )}
            </Stack>
        </Paper>
    );
}

export default DriverList;