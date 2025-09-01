"use client";

import React, { useState } from "react";
import {
    Box,
    Button,
    Card as MuiCard,
    CardContent,
    Chip,
    Grid,
    Typography,
    CircularProgress,
    IconButton,
    Dialog,
    DialogContent,
    DialogTitle,
    Tooltip,
    Divider,
    Badge,
    Skeleton,
    CardActionArea,
    Stack,
    useMediaQuery,
    DialogActions,
} from "@mui/material";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Book,
    Add,
    Visibility,
    OpenInNew,
    AccessTime,
    TrendingUp,
    Warning,
    CheckCircle,
    Cancel,
    Close,
} from "@mui/icons-material";
import { format } from "date-fns";
import {
    ConditionBooksResponse,
    BookStatus,
    SeverityLevel,
} from "@/types/condition-book-types";
import { useTheme } from "@mui/material/styles";

interface ConditionBooksProps {
    conditionBooks: ConditionBooksResponse[];
    isLoading: boolean;
    onCreateConditionBook: () => void;
    isCreating?: boolean;
    onOpenBook?: (conditionBookId: string) => void;
}

const ConditionBooks: React.FC<ConditionBooksProps> = ({
    conditionBooks,
    isLoading,
    onCreateConditionBook,
    isCreating = false,
    onOpenBook,
}) => {
    const [selectedBook, setSelectedBook] =
        useState<ConditionBooksResponse | null>(null);

    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));

    const count = conditionBooks?.length || 0;

    const getStatusIcon = (status: BookStatus) => {
        const sx = { fontSize: 20 };
        switch (status) {
            case "active":
                return <TrendingUp sx={{ ...sx, color: theme.palette.warning.main }} />;
            case "remission":
                return (
                    <CheckCircle sx={{ ...sx, color: theme.palette.success.main }} />
                );
            case "closed":
                return <Cancel sx={{ ...sx, color: theme.palette.text.disabled }} />;
            default:
                return <Book sx={{ ...sx, color: theme.palette.info.main }} />;
        }
    };

    const getStatusColor = (
        status: BookStatus
    ):
        | "success"
        | "warning"
        | "error"
        | "default"
        | "primary"
        | "secondary"
        | "info" => {
        switch (status) {
            case "active":
                return "warning";
            case "remission":
                return "success";
            case "closed":
                return "default";
            default:
                return "info";
        }
    };

    const getSeverityColor = (
        severity: SeverityLevel
    ): "success" | "warning" | "error" => {
        switch (severity) {
            case "mild":
                return "success";
            case "normal":
                return "warning";
            case "severe":
                return "error";
            default:
                return "warning";
        }
    };

    const getSeverityIcon = (severity: SeverityLevel) => {
        const sx = { fontSize: 18 };
        switch (severity) {
            case "mild":
                return <CheckCircle sx={{ ...sx, color: theme.palette.success.main }} />;
            case "normal":
                return <Warning sx={{ ...sx, color: theme.palette.warning.main }} />;
            case "severe":
                return <Warning sx={{ ...sx, color: theme.palette.error.main }} />;
            default:
                return <Warning sx={{ ...sx, color: theme.palette.warning.main }} />;
        }
    };

    const handleViewBook = (book: ConditionBooksResponse) => setSelectedBook(book);
    const handleCloseViewer = () => setSelectedBook(null);

    // ————— Loading State: skeleton grid —————
    if (isLoading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Book className="text-purple-600" />
                        Condition Books
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Grid container spacing={2}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <MuiCard sx={{ p: 2 }}>
                                    <Skeleton variant="text" width="60%" height={28} />
                                    <Skeleton variant="text" width="40%" />
                                    <Skeleton
                                        variant="rectangular"
                                        height={80}
                                        sx={{ my: 2, borderRadius: 1 }}
                                    />
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Skeleton variant="circular" width={20} height={20} />
                                        <Skeleton variant="text" width={120} />
                                    </Stack>
                                </MuiCard>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        );
    }

    // ————— Main —————
    return (
        <>
            <Card className="w-full">
                <CardHeader
                    className="pb-3"
                    style={{
                        background:
                            "linear-gradient(180deg, rgba(124,58,237,0.06) 0%, rgba(124,58,237,0.00) 100%)",
                    }}
                >
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Badge
                                color="secondary"
                                badgeContent={count}
                                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                            >
                                <Book className="text-purple-600" />
                            </Badge>
                            <span>Condition Books</span>
                        </CardTitle>

                        <Button
                            variant="contained"
                            startIcon={
                                isCreating ? <CircularProgress size={16} /> : <Add />
                            }
                            onClick={onCreateConditionBook}
                            disabled={isCreating}
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                boxShadow: "none",
                            }}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            {isCreating ? "Creating..." : "New Condition Book"}
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    {!conditionBooks || conditionBooks.length === 0 ? (
                        <Box
                            sx={{
                                textAlign: "center",
                                py: 8,
                                border: `1px dashed ${theme.palette.divider}`,
                                borderRadius: 2,
                                bgcolor:
                                    theme.palette.mode === "light"
                                        ? "rgba(124,58,237,0.03)"
                                        : "rgba(124,58,237,0.08)",
                            }}
                        >
                            <Book
                                sx={{ fontSize: 56, color: theme.palette.text.disabled, mb: 1 }}
                            />
                            <Typography variant="h6" sx={{ mb: 0.5 }}>
                                No condition books yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Create the first condition book for this patient.
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={onCreateConditionBook}
                                sx={{ borderRadius: 2, textTransform: "none" }}
                            >
                                New Condition Book
                            </Button>
                        </Box>
                    ) : (
                        <Grid container spacing={2.5}>
                            {conditionBooks.map((book) => {
                                const title = book.title?.trim() || "Untitled";
                                const showAllergy =
                                    book.allergies &&
                                    book.allergies.toLowerCase() !== "no";
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={book.id}>
                                        <MuiCard
                                            elevation={0}
                                            sx={{
                                                height: "100%",
                                                borderRadius: 2,
                                                border: `1px solid ${theme.palette.divider}`,
                                                transition:
                                                    "box-shadow 200ms ease, transform 120ms ease",
                                                "&:hover": {
                                                    boxShadow: theme.shadows[4],
                                                    transform: "translateY(-2px)",
                                                },
                                            }}
                                        >
                                            <CardActionArea
                                                onClick={() => handleViewBook(book)}
                                                sx={{ height: "100%", alignItems: "stretch" }}
                                            >
                                                <CardContent
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        height: "100%",
                                                    }}
                                                >
                                                    <Stack
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="flex-start"
                                                        sx={{ mb: 1 }}
                                                    >
                                                        <Stack
                                                            direction="row"
                                                            spacing={1}
                                                            alignItems="center"
                                                            sx={{ minWidth: 0 }}
                                                        >
                                                            {getStatusIcon(book.status)}
                                                            <Tooltip title={title} arrow disableInteractive>
                                                                <Typography
                                                                    variant="subtitle1"
                                                                    sx={{
                                                                        fontWeight: 600,
                                                                        color: "text.primary",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        whiteSpace: "nowrap",
                                                                        maxWidth: "16rem",
                                                                    }}
                                                                >
                                                                    {title}
                                                                </Typography>
                                                            </Tooltip>
                                                        </Stack>
                                                        <Chip
                                                            label={book.status.toUpperCase()}
                                                            color={getStatusColor(book.status)}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ fontWeight: 600 }}
                                                        />
                                                    </Stack>

                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        alignItems="center"
                                                        sx={{ mb: 1.5 }}
                                                    >
                                                        {getSeverityIcon(book.severity)}
                                                        <Chip
                                                            label={`${book.severity.toUpperCase()} SEVERITY`}
                                                            color={getSeverityColor(book.severity)}
                                                            size="small"
                                                            variant="filled"
                                                        />
                                                    </Stack>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            mb: 1.5,
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: 3,
                                                            WebkitBoxOrient: "vertical",
                                                            overflow: "hidden",
                                                            minHeight: "3.6em",
                                                        }}
                                                    >
                                                        {book.instructions}
                                                    </Typography>

                                                    <Box sx={{ mt: "auto" }}>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <AccessTime
                                                                sx={{ fontSize: 16, color: "text.disabled" }}
                                                            />
                                                            <Typography variant="caption" color="text.secondary">
                                                                Onset:{" "}
                                                                {format(
                                                                    new Date(book.onsetDate),
                                                                    "MMM dd, yyyy"
                                                                )}
                                                            </Typography>
                                                        </Stack>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Review every <strong>{book.reviewIntervalDays}</strong>{" "}
                                                            days
                                                        </Typography>

                                                        {showAllergy && (
                                                            <Box
                                                                sx={{
                                                                    mt: 1,
                                                                    p: 1,
                                                                    borderRadius: 1,
                                                                    bgcolor:
                                                                        theme.palette.mode === "light"
                                                                            ? "rgba(244, 67, 54, 0.06)"
                                                                            : "rgba(244, 67, 54, 0.12)",
                                                                    borderLeft: `3px solid ${theme.palette.error.main}`,
                                                                }}
                                                            >
                                                                <Stack
                                                                    direction="row"
                                                                    spacing={1}
                                                                    alignItems="center"
                                                                >
                                                                    <Warning
                                                                        sx={{
                                                                            fontSize: 18,
                                                                            color: "error.main",
                                                                        }}
                                                                    />
                                                                    <Typography
                                                                        variant="caption"
                                                                        sx={{ color: "error.main", fontWeight: 600 }}
                                                                    >
                                                                        Allergies: {book.allergies}
                                                                    </Typography>
                                                                </Stack>
                                                            </Box>
                                                        )}
                                                    </Box>

                                                    <Divider sx={{ my: 1.25 }} />
                                                    <Stack direction="row" justifyContent="flex-end">
                                                        <Tooltip title="View details" arrow>
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleViewBook(book);
                                                                }}
                                                                aria-label={`View ${title}`}
                                                            >
                                                                <Visibility fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        {onOpenBook && (
                                                            <Tooltip title="Open book" arrow>
                                                                <IconButton
                                                                    size="small"
                                                                    color="primary"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        console.log('ConditionBooks: Open icon clicked for id=', book.id);
                                                                        onOpenBook(String(book.id));
                                                                    }}
                                                                    aria-label={`Open ${title}`}
                                                                >
                                                                    <OpenInNew fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </Stack>
                                                </CardContent>
                                            </CardActionArea>
                                        </MuiCard>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </CardContent>
            </Card>

            {/* Details Dialog */}
            <Dialog
                open={!!selectedBook}
                onClose={handleCloseViewer}
                maxWidth="md"
                fullWidth
                fullScreen={isXs}
                aria-labelledby="condition-book-dialog-title"
            >
                {selectedBook && (
                    <>
                        <DialogTitle
                            id="condition-book-dialog-title"
                            sx={{
                                position: "sticky",
                                top: 0,
                                zIndex: 1,
                                bgcolor: "background.paper",
                                borderBottom: `1px solid ${theme.palette.divider}`,
                            }}
                        >
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Stack direction="row" spacing={1.25} alignItems="center">
                                    {getStatusIcon(selectedBook.status)}
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {selectedBook.title}
                                    </Typography>
                                    <Chip
                                        label={selectedBook.status.toUpperCase()}
                                        color={getStatusColor(selectedBook.status)}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </Stack>
                                <IconButton onClick={handleCloseViewer} aria-label="Close details">
                                    <Close />
                                </IconButton>
                            </Stack>
                        </DialogTitle>

                        <DialogContent sx={{ pt: 2 }}>
                            <Box className="space-y-4">
                                {/* Severity + Onset */}
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ fontWeight: 700, mb: 0.5 }}
                                        >
                                            Severity Level
                                        </Typography>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            {getSeverityIcon(selectedBook.severity)}
                                            <Chip
                                                label={selectedBook.severity.toUpperCase()}
                                                color={getSeverityColor(selectedBook.severity)}
                                                size="small"
                                                variant="filled"
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ fontWeight: 700, mb: 0.5 }}
                                        >
                                            Onset Date
                                        </Typography>
                                        <Typography variant="body2">
                                            {format(new Date(selectedBook.onsetDate), "PPPP")}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                {/* Instructions */}
                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 700, mb: 0.75 }}
                                    >
                                        Instructions
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            p: 2,
                                            borderRadius: 1.25,
                                            bgcolor:
                                                theme.palette.mode === "light"
                                                    ? "rgba(2,136,209,0.04)"
                                                    : "rgba(2,136,209,0.12)",
                                            border: `1px solid ${theme.palette.divider}`,
                                        }}
                                    >
                                        {selectedBook.instructions}
                                    </Typography>
                                </Box>

                                {/* Goals */}
                                {selectedBook.goals &&
                                    Object.keys(selectedBook.goals).length > 0 && (
                                        <Box>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{ fontWeight: 700, mb: 0.75 }}
                                            >
                                                Treatment Goals
                                            </Typography>
                                            <Stack spacing={1}>
                                                {Object.entries(selectedBook.goals).map(
                                                    ([key, value], index) => (
                                                        <Stack
                                                            key={index}
                                                            direction="row"
                                                            spacing={1.25}
                                                            alignItems="flex-start"
                                                        >
                                                            <CheckCircle
                                                                sx={{
                                                                    fontSize: 18,
                                                                    color: theme.palette.success.main,
                                                                    mt: "2px",
                                                                }}
                                                            />
                                                            <Box>
                                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                    {key}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {value}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    )
                                                )}
                                            </Stack>
                                        </Box>
                                    )}

                                {/* Allergies */}
                                {selectedBook.allergies &&
                                    selectedBook.allergies.toLowerCase() !== "no" && (
                                        <Box
                                            sx={{
                                                p: 2,
                                                borderRadius: 1.25,
                                                bgcolor:
                                                    theme.palette.mode === "light"
                                                        ? "rgba(244, 67, 54, 0.06)"
                                                        : "rgba(244, 67, 54, 0.12)",
                                                borderLeft: `4px solid ${theme.palette.error.main}`,
                                            }}
                                        >
                                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                                <Warning sx={{ fontSize: 20, color: "error.main" }} />
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ color: "error.main", fontWeight: 800 }}
                                                >
                                                    Known Allergies
                                                </Typography>
                                            </Stack>
                                            <Typography variant="body2" sx={{ color: "error.main" }}>
                                                {selectedBook.allergies}
                                            </Typography>
                                        </Box>
                                    )}

                                {/* Review Info */}
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 1.25,
                                        bgcolor:
                                            theme.palette.mode === "light"
                                                ? "rgba(25, 118, 210, 0.06)"
                                                : "rgba(25, 118, 210, 0.16)",
                                        border: `1px solid ${theme.palette.divider}`,
                                    }}
                                >
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 700, mb: 0.5, color: "primary.main" }}
                                    >
                                        Review Schedule
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "primary.main" }}>
                                        Review every {selectedBook.reviewIntervalDays} days
                                    </Typography>
                                </Box>

                                {/* Timestamps */}
                                <Divider />
                                <Grid container spacing={2} sx={{ pt: 1 }}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="caption" color="text.secondary">
                                            Created: {format(new Date(selectedBook.createdAt), "PPP p")}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="caption" color="text.secondary">
                                            Updated: {format(new Date(selectedBook.updatedAt), "PPP p")}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </DialogContent>

                                            <DialogActions sx={{ px: 3, pb: 2 }}>
                                                <Button onClick={handleCloseViewer} variant="text">
                                                    Close
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        if (selectedBook) {
                                                            console.log('ConditionBooks: OPEN BOOK clicked, selectedBook id=', selectedBook.id);
                                                            if (onOpenBook) onOpenBook(String(selectedBook.id));
                                                            handleCloseViewer();
                                                        }
                                                    }}
                                                    variant="contained"
                                                    color="primary"
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    OPEN BOOK
                                                </Button>
                                            </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
};

export default ConditionBooks;
