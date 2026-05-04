import { useEffect, useState } from "react";
import {
    Alert, Avatar, Box, Button, ButtonGroup, Card, CardContent,
    Chip, CircularProgress, Collapse, Divider, Stack, Tab, Tabs, Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { getMyTrips, getMyParticipations, getTripParticipants, setParticipantStatus } from "../api/api";
import type { TripResponse } from "../api/generated/models/TripResponse";
import { TripParticipationResponse } from "../api/generated/models/TripParticipationResponse";
import { TripParticipantResponse } from "../api/generated/models/TripParticipantResponse";

type TimeFilter = "UPCOMING" | "ALL" | "HISTORICAL";

// ── Shared helpers ────────────────────────────────────────────────────────────

function formatRoute(trip: TripResponse) {
    const from = `${trip.origin?.addressName ?? ""} ${trip.origin?.number ?? ""}, ${trip.origin?.city ?? ""}`;
    const to = `${trip.destination?.addressName ?? ""} ${trip.destination?.number ?? ""}, ${trip.destination?.city ?? ""}`;
    return { from, to };
}

function formatTime(iso?: string) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
        + " · " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function statusColor(status?: string): "warning" | "success" | "error" | "default" {
    if (status === "APPROVED") return "success";
    if (status === "REJECTED") return "error";
    if (status === "PENDING") return "warning";
    return "default";
}

// ── Participant row (inside driver's trip card) ───────────────────────────────

function ParticipantRow({ participant, onStatusSet }: {
    participant: TripParticipantResponse;
    onStatusSet: (id: number, status: "APPROVED" | "REJECTED") => void;
}) {
    const [loading, setLoading] = useState<"APPROVED" | "REJECTED" | null>(null);
    const isPending = participant.status === TripParticipantResponse.status.PENDING;

    async function handle(status: "APPROVED" | "REJECTED") {
        if (!participant.id) return;
        setLoading(status);
        try {
            await setParticipantStatus(participant.id, status);
            onStatusSet(participant.id, status);
        } finally {
            setLoading(null);
        }
    }

    return (
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 0.5 }}>
            <Avatar sx={{ width: 30, height: 30, fontSize: 13, bgcolor: "secondary.main" }}>
                {participant.username?.[0]?.toUpperCase() ?? "?"}
            </Avatar>
            <Typography variant="body2" flex={1}>{participant.username}</Typography>
            <Chip
                label={participant.status}
                size="small"
                color={statusColor(participant.status)}
                variant="outlined"
            />
            {isPending && (
                <Stack direction="row" spacing={0.5}>
                    <Button
                        size="small" variant="contained" color="success"
                        disabled={!!loading}
                        onClick={() => handle("APPROVED")}
                        sx={{ textTransform: "none", minWidth: 72 }}
                    >
                        {loading === "APPROVED" ? <CircularProgress size={14} /> : "Approve"}
                    </Button>
                    <Button
                        size="small" variant="outlined" color="error"
                        disabled={!!loading}
                        onClick={() => handle("REJECTED")}
                        sx={{ textTransform: "none", minWidth: 72 }}
                    >
                        {loading === "REJECTED" ? <CircularProgress size={14} /> : "Reject"}
                    </Button>
                </Stack>
            )}
        </Stack>
    );
}

// ── Driver trip card ──────────────────────────────────────────────────────────

function DriverTripCard({ trip }: { trip: TripResponse }) {
    const [open, setOpen] = useState(false);
    const [participants, setParticipants] = useState<TripParticipantResponse[]>([]);
    const [loadingParticipants, setLoadingParticipants] = useState(false);
    const { from, to } = formatRoute(trip);

    async function toggleParticipants() {
        if (!open && participants.length === 0 && trip.id) {
            setLoadingParticipants(true);
            try {
                const result = await getTripParticipants(trip.id);
                setParticipants(result);
            } finally {
                setLoadingParticipants(false);
            }
        }
        setOpen(prev => !prev);
    }

    function handleStatusSet(participantId: number, status: "APPROVED" | "REJECTED") {
        setParticipants(prev =>
            prev.map(p => p.id === participantId ? { ...p, status: status as TripParticipantResponse.status } : p)
        );
    }

    return (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Stack spacing={1.5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <LocationOnIcon fontSize="small" color="primary" />
                        <Box flex={1}>
                            <Typography variant="body2" fontWeight={600}>{from}</Typography>
                            <Typography variant="caption" color="text.secondary">→ {to}</Typography>
                        </Box>
                        <Chip
                            icon={<AirlineSeatReclineNormalIcon />}
                            label={`${trip.seatsAvailable} seats`}
                            size="small" color="primary" variant="outlined"
                        />
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                            {formatTime(trip.departureTime)}
                        </Typography>
                    </Stack>

                    <Divider />

                    <Button
                        size="small"
                        variant="text"
                        onClick={toggleParticipants}
                        endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        sx={{ textTransform: "none", alignSelf: "flex-start" }}
                    >
                        {loadingParticipants ? "Loading..." : "Seat requests"}
                    </Button>

                    <Collapse in={open}>
                        <Stack spacing={0.5} sx={{ pt: 0.5 }}>
                            {participants.length === 0 ? (
                                <Typography variant="caption" color="text.secondary">
                                    No requests yet
                                </Typography>
                            ) : (
                                participants.map(p => (
                                    <ParticipantRow
                                        key={p.id}
                                        participant={p}
                                        onStatusSet={handleStatusSet}
                                    />
                                ))
                            )}
                        </Stack>
                    </Collapse>
                </Stack>
            </CardContent>
        </Card>
    );
}

// ── Passenger participation card ──────────────────────────────────────────────

function ParticipationCard({ participation }: { participation: TripParticipationResponse }) {
    const trip = participation.trip;
    if (!trip) return null;
    const { from, to } = formatRoute(trip);

    return (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Stack spacing={1.5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <LocationOnIcon fontSize="small" color="primary" />
                        <Box flex={1}>
                            <Typography variant="body2" fontWeight={600}>{from}</Typography>
                            <Typography variant="caption" color="text.secondary">→ {to}</Typography>
                        </Box>
                        <Chip
                            label={participation.status}
                            size="small"
                            color={statusColor(participation.status)}
                        />
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: "primary.main" }}>
                            {trip.driverUsername?.[0]?.toUpperCase() ?? "?"}
                        </Avatar>
                        <Typography variant="body2" color="text.secondary">
                            Driver: <b>{trip.driverUsername}</b>
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                            {formatTime(trip.departureTime)}
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function MyTripsPage() {
    const [tab, setTab] = useState(0);
    const [timeFilter, setTimeFilter] = useState<TimeFilter>("UPCOMING");
    const [myTrips, setMyTrips] = useState<TripResponse[]>([]);
    const [myParticipations, setMyParticipations] = useState<TripParticipationResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        const fetch = tab === 0
            ? getMyTrips(timeFilter).then(setMyTrips)
            : getMyParticipations(timeFilter).then(setMyParticipations);

        fetch
            .catch(() => setError("Could not load trips."))
            .finally(() => setLoading(false));
    }, [tab, timeFilter]);

    return (
        <Box sx={{ maxWidth: 680, mx: "auto", mt: 4, px: 2, pb: 6 }}>
            <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>
                My Trips
            </Typography>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab label="As Driver" />
                <Tab label="As Passenger" />
            </Tabs>

            <ButtonGroup size="small" sx={{ mb: 3 }}>
                {(["UPCOMING", "ALL", "HISTORICAL"] as TimeFilter[]).map(f => (
                    <Button
                        key={f}
                        variant={timeFilter === f ? "contained" : "outlined"}
                        onClick={() => setTimeFilter(f)}
                        sx={{ textTransform: "none" }}
                    >
                        {f.charAt(0) + f.slice(1).toLowerCase()}
                    </Button>
                ))}
            </ButtonGroup>

            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && tab === 0 && (
                <Stack spacing={2}>
                    {myTrips.length === 0
                        ? <Typography color="text.secondary">No trips found.</Typography>
                        : myTrips.map(t => <DriverTripCard key={t.id} trip={t} />)
                    }
                </Stack>
            )}

            {!loading && !error && tab === 1 && (
                <Stack spacing={2}>
                    {myParticipations.length === 0
                        ? <Typography color="text.secondary">No participations found.</Typography>
                        : myParticipations.map(p => <ParticipationCard key={p.id} participation={p} />)
                    }
                </Stack>
            )}
        </Box>
    );
}