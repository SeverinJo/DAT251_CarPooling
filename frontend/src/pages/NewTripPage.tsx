import { useState } from "react";
import {
    Box, Typography, Button, Card, CardContent,
    TextField, ToggleButton, ToggleButtonGroup, Chip,
    Alert, Divider,
} from "@mui/material";
import RepeatIcon from "@mui/icons-material/Repeat";
import TodayIcon from "@mui/icons-material/Today";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import { createTrip } from "../api/api";
import AddressAutocomplete from "../components/AddressAutocomplete";

const WEEKDAYS = [
    { label: "Mon", value: "monday" },
    { label: "Tue", value: "tuesday" },
    { label: "Wed", value: "wednesday" },
    { label: "Thu", value: "thursday" },
    { label: "Fri", value: "friday" },
    { label: "Sat", value: "saturday" },
    { label: "Sun", value: "sunday" },
];

const DAY_INDEX: Record<string, number> = {
    sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
    thursday: 4, friday: 5, saturday: 6,
};

function nextOccurrenceISO(dayName: string, time: string): string {
    const target = DAY_INDEX[dayName];
    const now = new Date();
    let daysUntil = target - now.getDay();
    if (daysUntil <= 0) daysUntil += 7;
    const date = new Date(now);
    date.setDate(date.getDate() + daysUntil);
    const [hours, minutes] = time.split(":");
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date.toISOString();
}

function NewTripPage() {
    const [tripType, setTripType] = useState<"recurring" | "single" | null>(null);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [duration, setDuration] = useState("");
    const [seats, setSeats] = useState<number>(1);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isValid = () => {
        if (!tripType || !from || !to || !time || seats < 1) return false;
        if (tripType === "recurring" && (selectedDays.length === 0 || !duration)) return false;
        return !(tripType === "single" && !date);
    };

    const handleSubmit = async () => {
        if (!isValid()) return;
        setLoading(true);
        setError(null);
        try {
            if (tripType === "single") {
                await createTrip({
                    startAddress: from,
                    destinationAddress: to,
                    departureTimeInIsoFormat: new Date(`${date}T${time}`).toISOString(),
                    seatsAvailable: seats,
                });
            } else {
                // Create one trip per selected day (next upcoming occurrence)
                await Promise.all(
                    selectedDays.map((day) =>
                        createTrip({
                            startAddress: from,
                            destinationAddress: to,
                            departureTimeInIsoFormat: nextOccurrenceISO(day, time),
                            seatsAvailable: seats,
                        })
                    )
                );
            }
            setSubmitted(true);
        } catch {
            setError("Could not publish trip. Check that the addresses are valid Norwegian addresses.");
        } finally {
            setLoading(false);
        }
    };

    const handleUndo = () => {
        setSubmitted(false);
    };

    const handleReset = () => {
        setSubmitted(false);
        setTripType(null);
        setFrom(""); setTo(""); setTime(""); setDate("");
        setSelectedDays([]); setDuration(""); setSeats(1);
    };

    if (submitted) {
        return (
            <Box sx={{ maxWidth: 600, mx: "auto", mt: 8, px: 2, textAlign: "center" }}>
                <Alert severity="success" sx={{ fontSize: 16 }}>
                    Your trip is now published! Other users can now see your trip and request for a seat.
                </Alert>
                <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 3 }}>
                    <Button variant="outlined" color="error" onClick={handleUndo}>
                        Undo
                    </Button>
                    <Button variant="outlined" onClick={handleReset}>
                        Create a new trip
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2, pb: 6 }}>
            <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>
                Offer a new ride
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
                Choose whether you want to offer a recurring or just a single ride
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                <Card
                    onClick={() => setTripType("recurring")}
                    sx={{
                        flex: 1, cursor: "pointer", border: 2,
                        borderColor: tripType === "recurring" ? "primary.main" : "transparent",
                        transition: "border-color 0.2s",
                        "&:hover": { borderColor: "primary.light" },
                    }}
                >
                    <CardContent sx={{ textAlign: "center" }}>
                        <RepeatIcon color="primary" sx={{ fontSize: 36, mb: 1 }} />
                        <Typography fontWeight={600}>Regular</Typography>
                        <Typography variant="caption" color="text.secondary">
                            Recurring weekly or daily
                        </Typography>
                    </CardContent>
                </Card>

                <Card
                    onClick={() => setTripType("single")}
                    sx={{
                        flex: 1, cursor: "pointer", border: 2,
                        borderColor: tripType === "single" ? "primary.main" : "transparent",
                        transition: "border-color 0.2s",
                        "&:hover": { borderColor: "primary.light" },
                    }}
                >
                    <CardContent sx={{ textAlign: "center" }}>
                        <TodayIcon color="primary" sx={{ fontSize: 36, mb: 1 }} />
                        <Typography fontWeight={600}>Single</Typography>
                        <Typography variant="caption" color="text.secondary">
                            Will be listed only once for your specified date/time
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            {tripType && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Divider />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocationOnIcon color="primary" />
                        <Typography fontWeight={600}>To - From</Typography>
                    </Box>
                    <AddressAutocomplete
                        label="From"
                        value={from}
                        onChange={setFrom}
                        placeholder="E.g. Inndalsveien 28, Bergen"
                    />
                    <AddressAutocomplete
                        label="To"
                        value={to}
                        onChange={setTo}
                        placeholder="E.g. Nygjerdet 1, Alta"
                    />

                    <Divider />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AccessTimeIcon color="primary" />
                        <Typography fontWeight={600}>Time</Typography>
                    </Box>

                    {tripType === "recurring" && (
                        <Box>
                            <Typography variant="body2" color="text.secondary" mb={1}>
                                Pick which days of the week you want to offer this ride
                            </Typography>
                            <ToggleButtonGroup
                                value={selectedDays}
                                onChange={(_, newDays) => setSelectedDays(newDays)}
                                sx={{ flexWrap: "wrap", gap: 1 }}
                            >
                                {WEEKDAYS.map((day) => (
                                    <ToggleButton
                                        key={day.value}
                                        value={day.value}
                                        sx={{
                                            borderRadius: "50px !important",
                                            px: 2, border: "1px solid !important",
                                            "&.Mui-selected": {
                                                bgcolor: "primary.main",
                                                color: "white",
                                                "&:hover": { bgcolor: "primary.dark" },
                                            },
                                        }}
                                    >
                                        {day.label}
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>
                        </Box>
                    )}

                    {tripType === "single" && (
                        <TextField
                            label="Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            fullWidth
                            slotProps={{
                                inputLabel: { shrink: true },
                                htmlInput: { min: new Date().toISOString().split("T")[0] }
                            }}
                        />
                    )}

                    <TextField
                        label="Time of departure"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                    />

                    <Divider />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AirlineSeatReclineNormalIcon color="primary" />
                        <Typography fontWeight={600}>Seats available</Typography>
                    </Box>
                    <TextField
                        label="Number of seats"
                        type="number"
                        value={seats}
                        onChange={(e) => setSeats(Math.max(1, parseInt(e.target.value) || 1))}
                        fullWidth
                        slotProps={{ htmlInput: { min: 1, max: 8 } }}
                    />

                    {tripType === "recurring" && (
                        <>
                            <Divider />

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <EventAvailableIcon color="primary" />
                                <Typography fontWeight={600}>Duration of listing</Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" mb={1}>
                                How long do you want this listing to stay active?
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                {["1 week", "2 weeks", "1 month", "3 months", "Until I cancel this listing"].map((opt) => (
                                    <Chip
                                        key={opt}
                                        label={opt}
                                        onClick={() => setDuration(opt)}
                                        color={duration === opt ? "primary" : "default"}
                                        variant={duration === opt ? "filled" : "outlined"}
                                        sx={{ cursor: "pointer" }}
                                    />
                                ))}
                            </Box>
                        </>
                    )}

                    {error && <Alert severity="error">{error}</Alert>}

                    <Button
                        variant="contained"
                        size="large"
                        disabled={!isValid() || loading}
                        onClick={handleSubmit}
                        sx={{ mt: 2, borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                    >
                        {loading ? "Publishing..." : "Publish ride"}
                    </Button>
                </Box>
            )}
        </Box>
    );
}

export default NewTripPage;