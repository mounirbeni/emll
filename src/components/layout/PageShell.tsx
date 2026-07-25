import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared page-composition primitives.
 *
 * Every public page builds from these so hero treatment, container width,
 * vertical rhythm and heading hierarchy are identical everywhere. If a screen
 * needs a one-off layout, extend a primitive rather than hand-rolling padding
 * — that drift is what makes a product feel like separate websites.
 */

/* -------------------------------------------------------------------------- */
/*  Container                                                                  */
/* -------------------------------------------------------------------------- */

type ContainerWidth = "default" | "wide" | "narrow";

const containerClass: Record<ContainerWidth, string> = {
    default: "app-container",
    wide: "app-container-wide",
    narrow: "app-container-narrow",
};

export function Container({
    width = "default",
    className,
    children,
}: {
    width?: ContainerWidth;
    className?: string;
    children: ReactNode;
}) {
    return <div className={cn(containerClass[width], className)}>{children}</div>;
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                    */
/* -------------------------------------------------------------------------- */

type SectionTone = "default" | "surface" | "sunken" | "brand" | "brand-soft";

const toneClass: Record<SectionTone, string> = {
    default: "bg-background",
    surface: "bg-surface",
    sunken: "bg-surface-sunken",
    brand: "bg-brand-gradient text-white",
    "brand-soft": "bg-brand-gradient-soft",
};

export function Section({
    tone = "default",
    size = "default",
    width = "default",
    className,
    containerClassName,
    id,
    children,
}: {
    tone?: SectionTone;
    size?: "default" | "sm" | "none";
    width?: ContainerWidth;
    className?: string;
    containerClassName?: string;
    id?: string;
    children: ReactNode;
}) {
    return (
        <section
            id={id}
            className={cn(
                toneClass[tone],
                size === "default" && "app-section",
                size === "sm" && "app-section-sm",
                className
            )}
        >
            <Container width={width} className={containerClassName}>
                {children}
            </Container>
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/*  Section header                                                             */
/* -------------------------------------------------------------------------- */

export function SectionHeader({
    eyebrow,
    title,
    subtitle,
    align = "left",
    action,
    className,
}: {
    eyebrow?: string;
    title: ReactNode;
    subtitle?: ReactNode;
    align?: "left" | "center";
    action?: ReactNode;
    className?: string;
}) {
    const centered = align === "center";

    return (
        <div
            className={cn(
                "mb-10 flex flex-col gap-4 md:mb-12",
                centered
                    ? "items-center text-center"
                    : action
                        ? "md:flex-row md:items-end md:justify-between"
                        : "items-start",
                className
            )}
        >
            <div className={cn("flex flex-col gap-3", centered && "items-center")}>
                {eyebrow && <span className="eyebrow">{eyebrow}</span>}
                <h2 className="type-h2 text-foreground">{title}</h2>
                {subtitle && (
                    <p
                        className={cn(
                            "type-lead text-muted-foreground",
                            centered ? "max-w-2xl" : "max-w-xl"
                        )}
                    >
                        {subtitle}
                    </p>
                )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Page hero                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * The single interior-page hero. Every page below the homepage uses this, which
 * is what ties the navigation experience together — you always land on the same
 * shape, only the words change.
 */
export function PageHero({
    eyebrow,
    title,
    subtitle,
    align = "center",
    tone = "brand",
    children,
    className,
}: {
    eyebrow?: string;
    title: ReactNode;
    subtitle?: ReactNode;
    align?: "left" | "center";
    tone?: "brand" | "soft";
    children?: ReactNode;
    className?: string;
}) {
    const centered = align === "center";
    const isBrand = tone === "brand";

    return (
        <section
            className={cn(
                "relative isolate overflow-hidden",
                isBrand ? "bg-brand-gradient" : "bg-brand-gradient-soft",
                className
            )}
        >
            {isBrand && <div className="bg-brand-texture absolute inset-0 -z-10 opacity-70" />}

            <Container className="relative py-14 md:py-20">
                <div
                    className={cn(
                        "flex flex-col gap-5",
                        centered ? "items-center text-center" : "items-start"
                    )}
                >
                    {eyebrow && (
                        <span
                            className={cn(
                                "type-eyebrow inline-flex rounded-full px-4 py-1.5 uppercase backdrop-blur-sm",
                                isBrand
                                    ? "bg-white/15 text-white"
                                    : "bg-brand-500/10 text-brand-700"
                            )}
                        >
                            {eyebrow}
                        </span>
                    )}

                    <h1
                        className={cn(
                            "type-h1 max-w-4xl",
                            isBrand ? "text-white" : "text-foreground"
                        )}
                    >
                        {title}
                    </h1>

                    {subtitle && (
                        <p
                            className={cn(
                                "type-lead max-w-2xl",
                                isBrand ? "text-white/90" : "text-muted-foreground"
                            )}
                        >
                            {subtitle}
                        </p>
                    )}

                    {children && <div className="mt-2 w-full">{children}</div>}
                </div>
            </Container>
        </section>
    );
}
