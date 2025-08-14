'use client';
import React from "react";
import { Modal } from "@mui/material";

interface PharmaModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    doesCloseOnBgClickAutomatically?: boolean; 
}

const PharmaModal: React.FC<PharmaModalProps> = ({
    open,
    onClose,
    children,
    doesCloseOnBgClickAutomatically = true,
}) => {
    const handleClose = (
        event: {},
        reason: "backdropClick" | "escapeKeyDown"
    ) => {
        if (reason === "backdropClick" && !doesCloseOnBgClickAutomatically) {
            return;
        }
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
        >
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <p id="modal-modal-description">{children}</p>
            </div>
        </Modal>
    );
};

export default PharmaModal;
