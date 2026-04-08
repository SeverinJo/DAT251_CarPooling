import { useState } from "react";
import {
    Box,
    Container,
    Avatar,
    Typography,
    Stack,
    IconButton,
    Divider,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import avatarImg from "../assets/beard_bae.jpg";
import mapImg from "../assets/map.png";

interface GroupPost {
    id: string;
    author: { name: string; avatar: string };
    group: string;
    timestamp: string;
    image?: string;
    caption: string;
    likes: number;
    comments: number;
    liked: boolean;
}

const mockPosts: GroupPost[] = [
    {
        id: "p1",
        author: { name: "Carlos", avatar: avatarImg },
        group: "HVL Pendlere",
        timestamp: "3 min ago",
        image: mapImg,
        caption: "Bilen streiket i dag, trenger skyss fra Kronstad kl. 16:00. Noen som kan hjelpe?",
        likes: 21,
        comments: 4,
        liked: false,
    },
    {
        id: "p2",
        author: { name: "Daniel", avatar: avatarImg },
        group: "Bergen–Voss Pendlere",
        timestamp: "2 hrs ago",
        caption: "Reiser kl. 05 i morgen mot Voss. Noen som trenger skyss? Har 2 seter ledig.",
        likes: 6,
        comments: 18,
        liked: true,
    },
    {
        id: "p3",
        author: { name: "Marte L.", avatar: avatarImg },
        group: "HVL Pendlere",
        timestamp: "5 hrs ago",
        image: mapImg,
        caption: "Fast plass ledig fra Askøy til HVL mandag til fredag, 07:30. Ta kontakt!",
        likes: 33,
        comments: 7,
        liked: false,
    },
];

function timeAgo(ts: string) {
    return ts;
}

function PostCard({ post, onLike }: { post: GroupPost; onLike: (id: string) => void }) {
    return (
        <Box sx={{ bgcolor: "background.paper" }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 2, py: 1.5 }}>
                <Avatar src={post.author.avatar} sx={{ width: 38, height: 38 }} />
                <Box flex={1} minWidth={0}>
                    <Typography variant="body2" component="span" fontWeight={700} color="text.primary">
                        {post.author.name}
                    </Typography>
                    <Typography variant="body2" component="span" color="text.secondary">
                        {" in "}
                    </Typography>
                    <Typography variant="body2" component="span" fontWeight={600} color="primary.main">
                        {post.group}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary" lineHeight={1.2}>
                        {timeAgo(post.timestamp)}
                    </Typography>
                </Box>
                <IconButton size="small" sx={{ color: "text.secondary" }}>
                    <MoreHorizIcon />
                </IconButton>
            </Stack>

            {/* Image */}
            {post.image && (
                <Box
                    component="img"
                    src={post.image}
                    alt="post"
                    sx={{ width: "100%", display: "block", maxHeight: 300, objectFit: "cover" }}
                />
            )}

            {/* Actions */}
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ px: 1.5, pt: 1 }}>
                <IconButton
                    size="small"
                    onClick={() => onLike(post.id)}
                    sx={{ color: post.liked ? "error.main" : "text.primary" }}
                >
                    {post.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <Typography variant="body2" color="text.primary" sx={{ mr: 1.5 }}>
                    {post.likes}
                </Typography>
                <IconButton size="small" sx={{ color: "text.primary" }}>
                    <ChatBubbleOutlineIcon />
                </IconButton>
                <Typography variant="body2" color="text.primary">
                    {post.comments}
                </Typography>
            </Stack>

            {/* Caption */}
            <Box sx={{ px: 2, pb: 2, pt: 0.5 }}>
                <Typography variant="body2" color="text.primary">
                    <Box component="span" fontWeight={700}>{post.author.name} </Box>
                    {post.caption}
                </Typography>
                {post.comments > 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block", cursor: "pointer" }}>
                        View all {post.comments} comments
                    </Typography>
                )}
            </Box>

            <Divider />
        </Box>
    );
}

function FeedPage() {
    const [posts, setPosts] = useState<GroupPost[]>(mockPosts);

    const handleLike = (id: string) => {
        setPosts(prev =>
            prev.map(p =>
                p.id === id
                    ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
                    : p
            )
        );
    };

    return (
        <Container maxWidth="sm" disableGutters>
            <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2, py: 1.5 }}>
                <Typography variant="h6" fontWeight={700} color="primary">
                    My Groups
                </Typography>
            </Box>

            <Box>
                {posts.map(post => (
                    <PostCard key={post.id} post={post} onLike={handleLike} />
                ))}
            </Box>
        </Container>
    );
    return <div>FeedPage</div>;
}

export default FeedPage;
