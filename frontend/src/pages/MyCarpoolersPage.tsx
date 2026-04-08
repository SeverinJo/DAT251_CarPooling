import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Avatar,
    Stack,
    Chip,
    Button,
    Divider,
    Rating,
    IconButton,
    Skeleton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import mapImg from "../assets/map.png";
import avatarImg from "../assets/beard_bae.jpg";

interface FeedTrip {
    id: string;
    driver: { name: string; avatar: string; rating: number };
    from: string;
    to: string;
    departure: string;
    seatsAvailable: number;
    price: number;
    likes: number;
    comments: number;
    liked: boolean;
}

const mockFeedTrips: FeedTrip[] = [
    {
        id: "f1",
        driver: { name: "Luka M.", avatar: avatarImg, rating: 4.5 },
        from: "Bergen Sentrum",
        to: "Askøy",
        departure: "2026-04-10T07:30",
        seatsAvailable: 2,
        price: 60,
        likes: 4,
        comments: 2,
        liked: false,
    },
    {
        id: "f2",
        driver: { name: "Camilla N.", avatar: avatarImg, rating: 5 },
        from: "Kronstad, HVL",
        to: "Voss",
        departure: "2026-04-10T08:00",
        seatsAvailable: 3,
        price: 120,
        likes: 7,
        comments: 1,
        liked: true,
    },
    {
        id: "f3",
        driver: { name: "Anders K.", avatar: avatarImg, rating: 3.5 },
        from: "Sandviken",
        to: "Dale",
        departure: "2026-04-11T06:45",
        seatsAvailable: 1,
        price: 95,
        likes: 1,
        comments: 0,
        liked: false,
    },
];

function formatDeparture(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })
        + " · " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function TripCard({ trip, onLike, onRequest }: {
    trip: FeedTrip;
    onLike: (id: string) => void;
    onRequest: (id: string) => void;
}) {
    return (
        <Card elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <CardMedia
                component="img"
                image={mapImg}
                alt="Route map"
                sx={{ height: 160, objectFit: "cover" }}
            />
            <CardContent sx={{ pb: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
                    <Avatar src={trip.driver.avatar} sx={{ width: 40, height: 40 }} />
                    <Box>
                        <Typography variant="subtitle2" fontWeight={700} color="text.primary" lineHeight={1.2}>
                            {trip.driver.name}
                        </Typography>
                        <Rating value={trip.driver.rating} readOnly size="small" precision={0.5} />
                    </Box>
                </Stack>

                <Divider sx={{ mb: 1.5 }} />

                <Stack spacing={0.75}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <LocationOnIcon sx={{ fontSize: 16, color: "primary.main" }} />
                        <Typography variant="body2" color="text.primary" fontWeight={600}>
                            {trip.from}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">→</Typography>
                        <Typography variant="body2" color="text.primary" fontWeight={600}>
                            {trip.to}
                        </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary">
                            {formatDeparture(trip.departure)}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} mt={0.5}>
                        <Chip
                            icon={<AirlineSeatReclineNormalIcon />}
                            label={`${trip.seatsAvailable} seat${trip.seatsAvailable !== 1 ? "s" : ""} left`}
                            size="small"
                            color={trip.seatsAvailable === 1 ? "warning" : "default"}
                            variant="outlined"
                        />
                        <Chip
                            label={`kr ${trip.price}`}
                            size="small"
                            color="primary"
                            variant="filled"
                        />
                    </Stack>
                </Stack>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: "space-between" }}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <IconButton size="small" onClick={() => onLike(trip.id)} sx={{ color: trip.liked ? "error.main" : "text.secondary" }}>
                        {trip.liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                    </IconButton>
                    <Typography variant="caption" color="text.secondary">{trip.likes}</Typography>
                    <IconButton size="small" sx={{ color: "text.secondary", ml: 0.5 }}>
                        <ChatBubbleOutlineIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="caption" color="text.secondary">{trip.comments}</Typography>
                </Stack>
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => onRequest(trip.id)}
                    sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, px: 2 }}
                >
                    Request seat
                </Button>
            </CardActions>
        </Card>
    );
}

function FeedPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [trips, setTrips] = useState<FeedTrip[]>([]);
    const [loading, setLoading] = useState(true);

    const isDiscover = location.pathname === "/feed/discover";

    useEffect(() => {
        const timer = setTimeout(() => {
            setTrips(mockFeedTrips);
            setLoading(false);
        }, 400);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    const handleLike = (id: string) => {
        setTrips(prev =>
            prev.map(t =>
                t.id === id
                    ? { ...t, liked: !t.liked, likes: t.liked ? t.likes - 1 : t.likes + 1 }
                    : t
            )
        );
    };

    const handleRequest = (id: string) => {
        navigate(`/trip/${id}`);
    };

    return (
        <Container maxWidth="sm" sx={{ py: 3 }}>
            <Box mb={3}>
                <Typography variant="h5" fontWeight={700} color="primary">
                    {isDiscover ? "Discover Groups" : "My Carpoolers"}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                    {isDiscover
                        ? "Browse available rides shared by the community"
                        : "Upcoming rides from your regular carpoolers"}
                </Typography>
            </Box>

            <Stack spacing={2.5}>
                {loading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
                            <Skeleton variant="rectangular" height={160} />
                            <CardContent>
                                <Stack direction="row" spacing={1.5} mb={1.5}>
                                    <Skeleton variant="circular" width={40} height={40} />
                                    <Box flex={1}>
                                        <Skeleton width="40%" height={20} />
                                        <Skeleton width="60%" height={16} />
                                    </Box>
                                </Stack>
                                <Skeleton height={16} />
                                <Skeleton width="70%" height={16} />
                            </CardContent>
                        </Card>
                    ))
                    : trips.length === 0
                        ? (
                            <Box textAlign="center" py={8}>
                                <Typography color="text.secondary">No rides found.</Typography>
                            </Box>
                        )
                        : trips.map(trip => (
                            <TripCard
                                key={trip.id}
                                trip={trip}
                                onLike={handleLike}
                                onRequest={handleRequest}
                            />
                        ))
                }
            </Stack>
        </Container>
    );
}

export default FeedPage;
