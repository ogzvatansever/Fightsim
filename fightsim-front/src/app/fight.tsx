import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router"
import { Progress } from "@/components/ui/progress"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"

// Add this CSS in your global CSS or in a <style> tag:
/*
@keyframes shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
  100% { transform: translateX(0); }
}
.shake {
  animation: shake 0.4s;
}
*/

export default function Fight() {
    const params = useParams()
    const [fight, setFight] = useState<any>({})
    const [visibleLogs, setVisibleLogs] = useState(0)
    const logsEndRef = useRef<HTMLDivElement | null>(null)
    const [fighters, setFighters] = useState<string[]>(["Fighter1", "Fighter2"])
    const [initialHealth, setInitialHealth] = useState<[number, number]>([100, 100])
    const [health, setHealth] = useState<[number, number]>([100, 100])
    const [shake, setShake] = useState<[boolean, boolean]>([false, false]);
    const [speed, setSpeed] = useState(400); // Default speed in ms
    const [stopped, setStopped] = useState(false);

    // Fetch fight and set fighters
    const getFight = async () => {
        try {
            const response = await fetch("/api/fight/" + params.id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            })
            if (!response.ok) {
                throw new Error("Failed to fetch fighters")
            } else {
                const json = await response.json()
                setFighters([json.fighter1, json.fighter2])
                return json
            }
        } catch (error) {
            console.error("Error:", error)
        }
    }

    // Fetch starting health for both fighters from their API
    useEffect(() => {
        const fetchInitialHealth = async () => {
            if (!fighters[0] || !fighters[1]) return;
            try {
                const [res1, res2] = await Promise.all([
                    fetch(`/api/fighter/${encodeURIComponent(fighters[0])}`),
                    fetch(`/api/fighter/${encodeURIComponent(fighters[1])}`)
                ]);
                const data1 = res1.ok ? await res1.json() : { health: 100 };
                const data2 = res2.ok ? await res2.json() : { health: 100 };
                setInitialHealth([100 + 10 * data1.health, 100 + 10 * data2.health]);
                setHealth([100 + 10 * data1.health, 100 + 10 * data2.health]);
            } catch {
                setInitialHealth([100, 100]);
                setHealth([100, 100]);
            }
        };
        fetchInitialHealth();
    }, [fighters[0], fighters[1]]);

    // Fetch fight data on mount
    useEffect(() => {
        const fetchFight = async () => {
            const fight = await getFight()
            setFight(fight)
        }
        fetchFight();
    }, [])

    // Update health based on logs and initialHealth
    useEffect(() => {
        if (!fight.fight || !Array.isArray(fight.fight.Logs)) return;

        let h1 = initialHealth[0];
        let h2 = initialHealth[1];
        let damaged: [boolean, boolean] = [false, false];

        for (let i = 0; i < visibleLogs; i++) {
            const log = fight.fight.Logs[i];
            // Regex for: Attacker hit Target for X damage!
            const match = log.match(/^(.*?) hit (.*?) for ([\d.]+) damage/i);
            if (match) {
                const target = match[2].trim();
                const dmg = parseFloat(match[3]);
                if (target === fighters[0]) {
                    h1 = Math.max(0, h1 - dmg);
                    if (i === visibleLogs - 1) damaged[0] = true;
                }
                if (target === fighters[1]) {
                    h2 = Math.max(0, h2 - dmg);
                    if (i === visibleLogs - 1) damaged[1] = true;
                }
            }
        }
        setHealth([h1, h2]);
        setShake(damaged);

        // Remove shake after animation
        if (damaged[0] || damaged[1]) {
            const timeout = setTimeout(() => setShake([false, false]), 400);
            return () => clearTimeout(timeout);
        }
    }, [visibleLogs, fight, fighters, initialHealth]);

    // Reveal logs one by one, speed controlled by slider
    useEffect(() => {
        if (
            stopped ||
            !fight.fight ||
            !Array.isArray(fight.fight.Logs) ||
            visibleLogs >= fight.fight.Logs.length
        ) return;

        const timeout = setTimeout(() => {
            setVisibleLogs(visibleLogs + 1)
        }, 2000 - speed)
        return () => clearTimeout(timeout)
    }, [fight, visibleLogs, speed, stopped])

    // Scroll to bottom after each log is revealed
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [visibleLogs])

    return (
        <div className="flex flex-col justify-center items-center h-screen w-full">
            <div className="flex flex-col items-center justify-center w-sm max-h-[60rem] lg:w-2xl">
                <Breadcrumb className="w-full my-2">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                        <BreadcrumbLink href="/Home">Profile</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                        <BreadcrumbPage>Fight</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Speed slider UI */}
                <div className="w-full flex items-center justify-center mb-2 gap-2">
                    <label htmlFor="speed-slider" className="mr-2 text-sm font-medium">Fight Speed:</label>
                    <input
                        id="speed-slider"
                        type="range"
                        min={0}
                        max={2000}
                        step={50}
                        value={speed}
                        onChange={e => setSpeed(Number(e.target.value))}
                        className="w-48"
                    />
                    <span className="ml-2 text-xs">{((2000 - speed) / 1000).toFixed(2)}s</span>
                    <Button
                        size="sm"
                        variant={stopped ? "secondary" : "outline"}
                        className="ml-4 px-3 py-1"
                        onClick={() => setStopped(s => !s)}
                    >
                        {stopped ? "Resume" : "Stop"}
                    </Button>
                </div>

                <div className="w-full flex justify-center overflow-x-auto">
                    <div className="flex flex-row justify-center items-center my-4 mx-2 w-full max-w-sm lg:max-w-xl">
                        <div className="flex flex-col items-center justify-center min-w-0 flex-1 basis-0">
                            <img
                                src="/fighter.png"
                                alt="Fighter"
                                className={`object-scale-down h-[256px] ${(health[0] <= 0) ? "grayscale" : ""}`}
                                />
                            <div
                                className="text-2xl font-bold mt-2 max-w-xs text-center hover:underline cursor-pointer"
                                onClick={() => {window.location.href = `/fighter/${fighters[0]}`}}
                            >
                                {fighters[0]}
                            </div>
                            {/* Health bar for fighter 1 */}
                            <div className={`w-full mt-2 ${shake[0] ? "shake" : ""}`}>
                                <Progress
                                    value={health[0]}
                                    variant="health"
                                    className={
                                        health[0] / 200 > 0.6
                                        ? "bg-green-500"
                                        : health[0] / 200 > 0.3
                                        ? "bg-yellow-400"
                                        : "bg-red-600"
                                    }
                                    />
                                <div className="text-center text-xs mt-1">{health[0]} / {initialHealth[0]}</div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <h1 className="text-3xl font-bold mb-2 mx-6">vs</h1>
                        </div>
                        <div className="flex flex-col items-center min-w-0 flex-1 basis-0">
                            <img
                                src="/fighter.png"
                                alt="Fighter"
                                className={`object-scale-down h-[256px] ${(health[1] <= 0) ? "grayscale" : ""}`}
                                />
                            <div
                                className="text-2xl font-bold mt-2 max-w-xs lg:text-nowrap text-center hover:underline cursor-pointer"
                                onClick={() => {window.location.href = `/fighter/${fighters[1]}`}}
                                >
                                {fighters[1]}
                            </div>
                            {/* Health bar for fighter 2 */}
                            <div className={`w-full mt-2 ${shake[1] ? "shake" : ""}`}>
                                <Progress
                                    value={health[1]}
                                    variant="health"
                                    className={
                                        health[1] / 200 > 0.6
                                        ? "bg-green-500"
                                        : health[1] / 200 > 0.3
                                        ? "bg-yellow-400"
                                        : "bg-red-600"
                                    }
                                    />
                                <div className="text-center text-xs mt-1">{health[1]} / {initialHealth[1]}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex w-full flex-col" style={{ height: "50vh", overflowY: "auto" }}>
                {   
                    fight.fight && Array.isArray(fight.fight.Logs) ? (
                        fight.fight.Logs.slice(0, visibleLogs).map((log: any, index: number) => {
                            const logs = fight.fight.Logs;
                            const isSecondLast = index === logs.length - 2;
                            const isLast = index === logs.length - 1;
                            
                            // Special style for the last two logs
                            if (isLast) {
                                return (
                                    <div className="flex w-full justify-center" key={index}>
                                        <p className="bg-green-700 text-lg font-bold rounded-2xl my-0.5 mx-2 px-6 py-3 text-white w-full shadow-lg border-2 border-green-300">
                                            ⏱️ {log}
                                        </p>
                                    </div>
                                );
                            }
                            if (isSecondLast) {
                                return (
                                    <div className="flex w-full justify-center" key={index}>
                                        <p className="bg-yellow-600 text-xl font-semibold rounded-2xl my-0.5 mx-2 px-6 py-3 text-white w-full shadow border-2 border-yellow-300">
                                            🏆 {log}
                                        </p>
                                    </div>
                                );
                            }
                            // Normal logs
                            return log.startsWith(fighters[0]) ? (
                                <div className="flex w-full justify-start" key={index}>
                                    <p className="bg-red-800 rounded-2xl my-0.5 mx-2 px-4 text-white max-w-md">
                                        {log}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex w-full justify-end" key={index}>
                                    <p className="bg-blue-800 rounded-2xl my-0.5 mx-2 px-4 text-white max-w-md">
                                        {log}
                                    </p>
                                </div>
                            );
                        })
                    ) : (
                        <p>Loading fight logs...</p>
                    )
                }
                <div ref={logsEndRef} />
                </div>
            </div>
        </div>
    )
}