import { Button, Paper, Stack, Typography } from "@mui/material";
import AddressAutocomplete from "../AddressAutocomplete";

type Props = {
    from: string;
    to: string;
    onFromChange: (value: string) => void;
    onToChange: (value: string) => void;
    onSearch: () => void;
};

function TripSearchForm({ from, to, onFromChange, onToChange, onSearch }: Props) {
    return (
        <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h6" component="h2">
                    Search for rides
                </Typography>

                <AddressAutocomplete
                    label="From"
                    value={from}
                    onChange={onFromChange}
                    placeholder="E.g. Inndalsveien 28, Bergen"
                />

                <AddressAutocomplete
                    label="To"
                    value={to}
                    onChange={onToChange}
                    placeholder="E.g. Nygjerdet 1, Alta"
                />

                <Button variant="contained" onClick={onSearch}>
                    Search
                </Button>
            </Stack>
        </Paper>
    );
}

export default TripSearchForm;