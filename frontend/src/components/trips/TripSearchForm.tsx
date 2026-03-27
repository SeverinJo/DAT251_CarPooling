import { Button, Paper, Stack, TextField, Typography } from "@mui/material";

type Props = {
    from: string;
    to: string;
    onFromChange: (value: string) => void;
    onToChange: (value: string) => void;
    onSearch: () => void;
};

function TripSearchForm({from, to, onFromChange, onToChange, onSearch}: Props) {
    return (
        <Paper sx={{p: 3}}>
            <Stack spacing={2}>
                <Typography variant="h6" component="h2">
                    Search for rides
                </Typography>

                <TextField
                    label="From"
                    value={from}
                    onChange={(e) => onFromChange(e.target.value)}
                    fullWidth
                />

                <TextField
                    label="To"
                    value={to}
                    onChange={(e) => onToChange(e.target.value)}
                    fullWidth
                />

                <Button variant="contained" onClick={onSearch}>
                    Search
                </Button>
            </Stack>
        </Paper>
    );
}

export default TripSearchForm;