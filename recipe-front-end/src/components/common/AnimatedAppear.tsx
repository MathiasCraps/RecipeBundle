import React from "react";
import { motion } from 'framer-motion';

interface OwnProps {
    children: React.ReactNode;
}

export function AnimatedAppear(props: OwnProps) {
    return <motion.div initial={{ scale: 0.8, originY: 30 }}
        animate={{ scale: 1, originY: 0 }}
        transition={{ duration: 0.5 }}>
        {props.children}
    </motion.div>
}