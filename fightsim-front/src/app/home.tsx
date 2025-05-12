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
import { Link } from "react-router"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react";


export default function Home() {
    const [fighters, setFighters] = useState([])
    const user = JSON.parse(localStorage.getItem("user") || JSON.stringify({email: "User"})).email
    console.log(user)

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
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            fighters.map((fighter: {nickname: string, star: number, win: number, loss: number}, index) => (
                                <TableRow key={index} onClick={() => {window.location.href = "/fighter/"+fighter.nickname}} className="cursor-pointer hover:bg-background">
                                <TableCell className="font-medium">{fighter.nickname}</TableCell>
                                <TableCell>{fighter.win}-{fighter.loss}</TableCell>
                                <TableCell>{fighter.star}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
        </>
    )
}