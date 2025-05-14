import { useParams } from "react-router"
import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { FaStar } from "react-icons/fa"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface FighterType {
    id: number,
    nickname: string,
    agility: number,
    strength: number,
    toughness: number,
    stamina: number,
    health: number,
    star: number,
    win?: number,
    loss?: number,
}

interface FightType {
    id: number,
    fighter1: string,
    fighter2: string,
    winner?: string,
    date?: string,
}

export default function Fighter() {
    let params = useParams()
    const [fighter, setFighter] = useState<FighterType>({
        id: 0,
        nickname: "",
        agility: 0,
        strength: 0,
        toughness: 0,
        stamina: 0,
        health: 0,
        star: 0,
        win: 0,
        loss: 0,
    })
    const [fights, setFights] = useState<FightType[]>([])

    const getFighter = async () => {
        try {
            const response = await fetch("/api/fighter/"+params.nickname, {
                method: "GET"
            })
            if (!response.ok) {
                throw new Error("Failed to fetch fighters")
            }
            const json = await response.json()
            return json
        } catch (error) {
            console.error("Error:", error)
        }
    }

    // Fetch last fights for this fighter
    const getFights = async () => {
        try {
            const response = await fetch(`/api/fights/${params.nickname}`, {
                method: "GET"
            })
            if (!response.ok) {
                throw new Error("Failed to fetch fights")
            }
            const json = await response.json()
            return json.fights || []
        } catch (error) {
            console.error("Error:", error)
            return []
        }
    }

    useEffect(() => {
        const fetchFighter = async () => {
            const fighters = await getFighter()
            setFighter(fighters)
        }
        fetchFighter();

        const fetchFights = async () => {
            const fights = await getFights()
            setFights(fights)
        }
        fetchFights();
    }, [])

    return (
        <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col justify-center px-4 py-8 bg-secondary w-xl rounded-4xl relative min-h-[600px]">
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
                    <BreadcrumbPage>{fighter.nickname}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <img src="/fighter.png" alt="Fighter" className="object-scale-down h-[256px]"/>
            <Badge className="absolute right-1 top-1">{fighter.id}</Badge>
            <h1 className="text-4xl font-bold">{fighter.nickname}</h1>
            <div className="flex flex-row justify-center items-center">
                <p className="text-amber-500 flex justify-center items-center mx-4">{fighter.star}<FaStar /></p><p>{fighter.win}-{fighter.loss}</p>
            </div>
            <div className="flex flex-row justify-center items-center">
                <div className="flex w-1/6 justify-start">
                    <p>Agility:</p>
                </div>
                <div className="flex w-5/6 justify-end">
                    <Progress value={fighter.agility*10} className="bg-red-800"/>
                </div>
            </div>
            <div className="flex flex-row justify-center items-center">
                <div className="flex w-1/6 justify-start">
                    <p>Strength:</p>
                </div>
                <div className="flex w-5/6 justify-end">
                    <Progress value={fighter.strength*10} className="bg-red-800"/>
                </div>
            </div>
            <div className="flex flex-row justify-center items-center">
                <div className="flex w-1/6 justify-start" >
                    <p>Toughness:</p>
                </div>
                <div className="flex w-5/6 justify-end">
                    <Progress value={fighter.toughness*10} className="bg-red-800"/>
                </div>
            </div>
            <div className="flex flex-row justify-center items-center">
                <div className="flex w-1/6 justify-start">
                    <p>Stamina:</p>
                </div>
                <div className="flex w-5/6 justify-end">
                    <Progress value={fighter.stamina*10 } className="bg-red-800"/>
                </div>
            </div>
            <div className="flex flex-row justify-center items-center">
                <div className="flex w-1/6 justify-start">
                    <p>Health:</p>
                </div>
                <div className="flex w-5/6 justify-end">
                    <Progress value={fighter.health*10} className="bg-red-800"/>
                </div>
            </div>
            {/* Last Fights Table */}
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-2">Last Fights</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Opponent</TableHead>
                            <TableHead>Result</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fights.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">No fights found.</TableCell>
                            </TableRow>
                        )}
                        {fights.map((fight) => {
                            const opponent = fight.fighter1 === fighter.nickname ? fight.fighter2 : fight.fighter1;
                            let result = "";
                            let resultColor = "";
                            if (fight.winner) {
                                if (fight.winner === fighter.nickname) {
                                    result = "Win";
                                    resultColor = "text-green-600 font-bold";
                                } else {
                                    result = "Loss";
                                    resultColor = "text-red-600 font-bold";
                                }
                            }
                            return (
                                <TableRow key={fight.id}>
                                    <TableCell>
                                        <span
                                            className="hover:underline cursor-pointer"
                                            onClick={() => window.location.href=`/fight/${fight.id}`}
                                        >
                                            {fight.id}
                                        </span>
                                        </TableCell>
                                    <TableCell>
                                        <span
                                            className="hover:underline cursor-pointer"
                                            onClick={() => window.location.href=`/fighter/${opponent}`}
                                        >
                                            {opponent}
                                        </span>
                                    </TableCell>
                                    <TableCell className={resultColor}>{result}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
        </div>
    )
}