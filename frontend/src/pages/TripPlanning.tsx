import { useState } from "react";
import { Container, Stack } from "@mui/material";
import DriverList from "../components/trips/DriverList";
import RoutePreview from "../components/trips/RoutePreview";
import TripSearchForm from "../components/trips/TripSearchForm";
import type { TripResponse } from "../api/generated/models/TripResponse";
import { getTrips } from "../api/api";

function TripPlanning() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [trips, setTrips] = useState<TripResponse[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!from.trim() && !to.trim()) return;
        const results = await getTrips(from);
        setTrips(results);
        setHasSearched(true);
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack spacing={3}>
                <TripSearchForm
                    from={from}
                    to={to}
                    onFromChange={setFrom}
                    onToChange={setTo}
                    onSearch={handleSearch}
                />
                {hasSearched && (
                    <>
                        <RoutePreview from={from} to={to} />
                        <DriverList trips={trips} />
                    </>
                )}
            </Stack>
        </Container>
    );
}

export default TripPlanning;