'use client';

import { motion, useAnimation, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { ReactNode } from "react";
import { Check, Trash2 } from "lucide-react";

interface SwipeableNotificationItemProps {
    children: ReactNode;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    threshold?: number;
}

export function SwipeableNotificationItem({
    children,
    onSwipeLeft,
    onSwipeRight,
    threshold = 100
}: SwipeableNotificationItemProps) {
    const x = useMotionValue(0);
    const controls = useAnimation();

    // Background color opacity based on drag
    const backgroundOpacityLeft = useTransform(x, [-threshold, 0], [1, 0]);
    const backgroundOpacityRight = useTransform(x, [0, threshold], [0, 1]);

    // Swipe end handler
    const handleDragEnd = async (_: any, info: PanInfo) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        if (offset < -threshold || velocity < -500) {
            // Swiped Left
            if (onSwipeLeft) {
                await controls.start({ x: -500, opacity: 0, transition: { duration: 0.2 } });
                onSwipeLeft();
            } else {
                controls.start({ x: 0 });
            }
        } else if (offset > threshold || velocity > 500) {
            // Swiped Right
            if (onSwipeRight) {
                await controls.start({ x: 500, opacity: 0, transition: { duration: 0.2 } });
                onSwipeRight();
            } else {
                controls.start({ x: 0 });
            }
        } else {
            // Reset
            controls.start({ x: 0 });
        }
    };

    return (
        <div className="relative overflow-hidden rounded-lg">
            {/* Background Layer for Swipe Left (e.g. Delete/Mark Read) */}
            <motion.div
                className="absolute inset-y-0 right-0 w-1/2 bg-primary flex items-center justify-end px-6 z-0"
                style={{ opacity: backgroundOpacityLeft }}
            >
                <Check className="text-white h-6 w-6" />
            </motion.div>

            {/* Background Layer for Swipe Right (e.g. Delete) */}
            <motion.div
                className="absolute inset-y-0 left-0 w-1/2 bg-red-500 flex items-center justify-start px-6 z-0"
                style={{ opacity: backgroundOpacityRight }}
            >
                <Trash2 className="text-white h-6 w-6" />
            </motion.div>

            {/* Foreground Content */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={handleDragEnd}
                style={{ x, touchAction: "none" }}
                animate={controls}
                className="relative z-10 bg-background"
            >
                {children}
            </motion.div>
        </div>
    );
}
