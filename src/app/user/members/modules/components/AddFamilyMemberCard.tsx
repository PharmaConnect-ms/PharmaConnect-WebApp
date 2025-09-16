"use client";

import React from "react";
import {
    Card,
    CardContent,
    Typography,
} from "@mui/material";
import {
    PersonAdd as PersonAddIcon,
} from "@mui/icons-material";

interface AddFamilyMemberCardProps {
    onAddMember: () => void;
}

const AddFamilyMemberCard: React.FC<AddFamilyMemberCardProps> = ({
    onAddMember,
}) => {
    return (
        <Card
            onClick={onAddMember}
            sx={{
                borderRadius: "16px",
                border: "2px dashed #42C5E7",
                backgroundColor: "transparent",         
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                    backgroundColor: "rgba(66, 197, 231, 0.05)",
                    transform: "translateY(-4px)",
                    borderColor: "#32B5D7",
                },
            }}
        >
            <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: 3,
                }}
            >
                <PersonAddIcon
                    sx={{
                        fontSize: 64,
                        color: "#42C5E7",
                        marginBottom: 2,
                    }}
                />
                <Typography
                    variant="h6"
                    color="#42C5E7"
                    gutterBottom
                    fontWeight="600"
                >
                    Add New Member
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ maxWidth: 200 }}
                >
                    Click to add a new family member to your care network
                </Typography>
            </CardContent>
        </Card>
    );
};

export default AddFamilyMemberCard;
