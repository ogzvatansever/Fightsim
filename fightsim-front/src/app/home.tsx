import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { Link, useNavigate } from "react-router"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import React, { useEffect, useState } from "react";

export default function Home() {
    const [fighters, setFighters] = useState([])
    const [selected, setSelected] = useState<string[]>([])
    const user = JSON.parse(localStorage.getItem("user") || JSON.stringify({email: "User"})).email
    console.log(user)
    const navigate = useNavigate();

    const getFighters = async () => {
        try {
            const response = await fetch(`/api/${user}/fighter`, {
            method: "GET"
            })
            if (!response.ok) {
                throw new Error("Failed to fetch fighters")
            }
            const json = await response.json()
            console.log(json.fighter)
            return json.fighter
        } catch (error) {
            console.error("Error:", error)
        }
    }

    const handleSelect = (nickname: string) => {
        setSelected(prev => {
            if (prev.includes(nickname)) {
                return prev.filter(n => n !== nickname)
            } else if (prev.length < 2) {
                return [...prev, nickname]
            }
            return prev
        })
    }

    const handleFight = async () => {
        if (selected.length !== 2) return
        try {
            const response = await fetch(`/api/fight`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fighter1: selected[0], fighter2: selected[1] })
            })
            if (!response.ok) throw new Error("Fight failed")
            const result = await response.json()
            console.log(result)
            setSelected([])
            const fighters = await getFighters()
            setFighters(fighters)
            navigate(`/fight/${result.id}`) // <-- Go to /id
        } catch (error) {
            alert("Error: " + error)
        }
    }

    useEffect(() => {
        const fetchFighters = async () => {
            const fighters = await getFighters()
            setFighters(fighters)
        }
        fetchFighters();
    }, [])
    return (
        <>
        <NavigationMenu className="fixed">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>FightSim</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <Link to="/">
                            <div className="text outline p-2 rounded hover:bg-secondary my-1">
                                Index
                            </div>
                        </Link>
                        <Link to="/home">
                            <div className="text outline p-2 rounded hover:bg-secondary my-1">
                                Home
                            </div>
                        </Link>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
        <div className="flex flex-col items-center h-screen">
            <div className="flex items-center justify-center rounded-md">
                <img
                  src="/icon256.png"
                  alt="Logo"
                  className="h-24 w-24 rounded-full m-5"
                />
              </div>
            <div className="w-lg bg-secondary p-4 text-left">
                
                <h1 className="text-2xl font-bold">
                    Profile
                </h1>
                <h2 className="text-md mt-2">
                    Your Fighters
                </h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[400px]">Nickname</TableHead>
                        <TableHead>Record</TableHead>
                        <TableHead>Star</TableHead>
                        <TableHead>Select</TableHead> {/* New column */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            fighters.map((fighter: {nickname: string, star: number, win: number, loss: number}, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">
                                        <Link to={`/fighter/${fighter.nickname}`} className="text-blue-600 hover:underline">
                                            {fighter.nickname}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{fighter.win}-{fighter.loss}</TableCell>
                                    <TableCell>{fighter.star}</TableCell>
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(fighter.nickname)}
                                            disabled={
                                                !selected.includes(fighter.nickname) && selected.length >= 2
                                            }
                                            onChange={() => handleSelect(fighter.nickname)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                <button
                    className="mt-4 px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
                    disabled={selected.length !== 2}
                    onClick={handleFight}
                >
                    Fight!
                </button>
            </div>
        </div>
        </>
    )
}