"use client";

import { CloudSun, Droplets, Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WeatherWidget() {
    // Mock weather data for Marrakech
    return (
        <Card className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20 border-sky-100 dark:border-sky-900 mb-6">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-sky-700 dark:text-sky-300">
                    <CloudSun className="w-4 h-4" /> Marrakech Weather (Today)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-sky-900 dark:text-sky-100">28°C</span>
                        <span className="text-sm text-sky-700 dark:text-sky-300 mb-1">Sunny</span>
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Wind className="w-3 h-3" /> 12 km/h
                        </div>
                        <div className="flex items-center gap-1">
                            <Droplets className="w-3 h-3" /> 24%
                        </div>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                    Perfect conditions for outdoor activities. Don&apos;t forget sunscreen!
                </p>
            </CardContent>
        </Card>
    );
}
