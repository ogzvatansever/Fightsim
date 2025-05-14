import { useParams } from "react-router"
import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { FaStar } from "react-icons/fa"
import { Badge } from "@/components/ui/badge"

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
    const getFighter = async () => {
        try {
            const response = await fetch("/api/fighter/"+params.nickname, {
                method: "GET"
            })
            if (!response.ok) {
                    throw new Error("Failed to fetch fighters")
                }
                const json = await response.json()
                console.log(json)
                return json
            } catch (error) {
                console.error("Error:", error)
            }
        }
    
        useEffect(() => {
            const fetchFighter = async () => {
                const fighters = await getFighter()
                setFighter(fighters)
            }
            fetchFighter();
        }, [])

    return (
        <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col justify-center px-4 py-8 bg-secondary w-xl rounded-4xl relative min-h-[600px]">
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
        </div>
        </div>
    )
}