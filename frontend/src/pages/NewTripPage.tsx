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

const WEEKDAYS = [
    { label: "Mon", value: "monday" },
    { label: "Tue", value: "tuesday" },
    { label: "Wed", value: "wednesday" },
    { label: "Thu", value: "thursday" },
    { label: "Fri", value: "friday" },
    { label: "Sat", value: "saturday" },
    { label: "Sun", value: "sunday" },
];

function NewTripPage() {
    const [tripType, setTripType] = useState<"recurring" | "single" | null>(null);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [duration, setDuration] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [lastTrip, setLastTrip] = useState<object | null>(null);

    const isValid = () => {
        if (!tripType || !from || !to || !time) return false;
        if (tripType === "recurring" && (selectedDays.length === 0 || !duration)) return false;
        return !(tripType === "single" && !date);

    };

    const handleSubmit = () => {
        if (isValid()) {
            setLastTrip({tripType, from, to, time, date, selectedDays, duration});
            setSubmitted(true);
        }
    };

    if (submitted) {
        return (
            <Box sx={{ maxWidth: 600, mx: "auto", mt: 8, px: 2, textAlign: "center" }}>
                <Alert severity="success" sx={{ fontSize: 16 }}>
                    Your trip is now published! Other users can now see your trip and request for a seat.
                </Alert>
                <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 3 }}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                            setSubmitted(false);
                            setLastTrip(null);
                            // TODO: When implemented with backend use API to remove the newly created trip
                        }}
                    >
                        Undo
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setSubmitted(false);
                            setLastTrip(null);
                            setTripType(null);
                            setFrom(""); setTo(""); setTime(""); setDate("");
                            setSelectedDays([]); setDuration("");
                        }}
                    >
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
                Choose whether you wan to offer a recurring or just a single ride
            </Typography>

            {/* Turtype-valg */}
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

            {/* Skjema — vises når type er valgt */}
            {tripType && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Divider />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocationOnIcon color="primary" />
                        <Typography fontWeight={600}>To - From</Typography>
                    </Box>
                    <TextField
                        label="From"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        fullWidth
                        placeholder="E.g. Konstad, HVL"
                    />
                    <TextField
                        label="To"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        fullWidth
                        placeholder="E.g Askøy"
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
                        label="Time of department"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
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
                    <Button
                        variant="contained"
                        size="large"
                        disabled={!isValid()}
                        onClick={handleSubmit}
                        sx={{ mt: 2, borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                    >
                        Publish ride
                    </Button>
                </Box>
            )}
        </Box>
    );
}

export default NewTripPage;