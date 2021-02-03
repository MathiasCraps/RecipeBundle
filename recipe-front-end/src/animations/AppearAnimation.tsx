import React from "react";
import { motion } from 'framer-motion';

interface OwnProps {
    children: React.ReactNode;
}

export function AppearAnimation(props: OwnProps) {
    return <motion.div initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}>
        {props.children}
    </motion.div>
}