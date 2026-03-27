import { Box, Paper, Stack, Typography } from "@mui/material";
import mapImage from "../../assets/map.png";

type Props = {
    from: string;
    to: string;
};

function RoutePreview({ from, to }: Props) {
    return (
        <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h6" component="h2">
                    Your route
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    From: {from}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    To: {to}
                </Typography>

                <Box
                    component="img"
                    src={mapImage}
                    alt="Map placeholder"
                    sx={{
                        width: "100%",
                        borderRadius: 2,
                        objectFit: "cover",
                    }}
                />
            </Stack>
        </Paper>
    );
}

export default RoutePreview;