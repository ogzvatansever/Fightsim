import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


export default function Fight() {
    const params = useParams()
    const [fight, setFight] = useState<any>({})
    const [visibleLogs, setVisibleLogs] = useState(0)
    const logsEndRef = useRef<HTMLDivElement | null>(null)

    // Store fighter names in state
    const [fighters, setFighters] = useState<string[]>(["Fighter1", "Fighter2"])

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
                // Set fighter names from response
                setFighters([json.fighter1, json.fighter2])
                return json
            }
        } catch (error) {
            console.error("Error:", error)
        }
    }

    useEffect(() => {
        const fetchFight = async () => {
            const fight = await getFight()
            setFight(fight)
        }
        fetchFight();
    }, [])

    // Reveal logs one by one every second
    useEffect(() => {
        if (fight.fight && Array.isArray(fight.fight.Logs) && visibleLogs < fight.fight.Logs.length) {
            const timeout = setTimeout(() => {
                setVisibleLogs(visibleLogs + 1)
            }, 500) // 1 second
            return () => clearTimeout(timeout)
        }
    }, [fight, visibleLogs])

    // Scroll to bottom after each log is revealed
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [visibleLogs])

    return (
        <div className="flex flex-col justify-center items-center h-screen mx-2">
            <Breadcrumb>
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

            <div className="flex flex-row justify-center items-center my-4 w-xl">
                <div className="flex flex-col items-center flex-1">
                    <img src="/fighter.png" alt="Fighter" className="object-scale-down h-[256px]" />
                    <div className="text-2xl font-bold mt-2 max-w-xs truncate text-center">
                        {fighters[0]}
                    </div>
                </div>
                <div className="flex flex-col items-center flex-1">
                    <h1 className="text-3xl font-bold mb-2 mx-6">vs</h1>
                </div>
                <div className="flex flex-col items-center flex-1">
                    <img src="/fighter.png" alt="Fighter" className="object-scale-down h-[256px]" />
                    <div className="text-2xl font-bold mt-2 max-w-xs truncate text-center">
                        {fighters[1]}
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
    )
}