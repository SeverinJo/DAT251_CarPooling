import { Card, CardContent, Typography } from "@mui/material";
import type { User } from "../../types";

type Props = {
    driver: User;
};

function DriverCard({ driver }: Props) {
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="subtitle1">
                    {driver.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Car: {driver.vehicle?.model}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Available: {driver.vehicle?.availableSeats}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default DriverCard;