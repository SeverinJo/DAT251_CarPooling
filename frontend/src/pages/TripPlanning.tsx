import {useState} from "react";
import type {User} from "../types";
import {Container, Stack} from "@mui/material";
import DriverList from "../components/trips/DriverList";
import RoutePreview from "../components/trips/RoutePreview";
import TripSearchForm from "../components/trips/TripSearchForm";

function TripPlanning() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    const drivers: User[] = [
        {id: "1", name: "Ola Nordmann", email: "ola@gmail.com", rating: 6.5,
            vehicle: {id: "1", ownerId:"1",  brand: "Tesla", model: "X", year: 2014, licensePlate: "123", availableSeats: 4} },
        {id: "2", name: "Kari Nordmann", email: "kari@gmail.com", rating: 8.5,
            vehicle: {id: "1", ownerId:"1",  brand: "Tesla", model: "Y", year: 2014, licensePlate: "123", availableSeats: 4} },
    ];

    const handleSearch = () => {
        if (!from.trim() && !to.trim()) {
            return;
        }
        setHasSearched(true);
    }

    return (
        <Container maxWidth="md" sx={{py: 4}} >
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
                            <RoutePreview from={from} to={to}/>
                            <DriverList drivers={drivers} />
                        </>
                    )}
            </Stack>
        </Container>
    );
}

export default TripPlanning;