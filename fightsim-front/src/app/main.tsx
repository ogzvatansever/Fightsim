import { Card } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Link } from "react-router";
{/*
    This page is temporary, work in progress.
    Will use the other page till its ready
*/}
export default function Home() {
    return (
        <div className="w-full h-screen items-center justify-center flex bg-gray-800">
            <div className="w-sm h-screen flex flex-col bg-gray-800">
                {/* Top bar */}
                <div className="w-full bg-gray-800 text-white p-4 h-16">
                    <div className="h-full flex items-center">Top</div>
                </div>
                {/* Middle content */}
                <div className="flex-1 w-full flex items-center justify-center flex-wrap overflow-y-auto gap-3 no-scrollbar" >
                    <Card className="w-44 h-64 flex items-center justify-center bg-green-500 shadow-lg rounded-lg"/>
                    <Card className="w-44 h-64 flex items-center justify-center bg-orange-500 shadow-lg rounded-lg"/>
                    <Card className="w-44 h-64 flex items-center justify-center bg-red-500 shadow-lg rounded-lg"/>
                    <Card className="w-44 h-64 flex items-center justify-center bg-gray-800 shadow-lg rounded-lg"/>
                    <Card className="w-44 h-64 flex items-center justify-center bg-gray-800 shadow-lg rounded-lg"/>
                    <Card className="w-44 h-64 flex items-center justify-center bg-gray-800 shadow-lg rounded-lg"/>
                </div>
                {/* Bottom bar */}
                <div className="w-full bg-gray-800 text-white p-4 h-24 flex items-center">
                    Bottom
                </div>
            </div>
        </div>
    )
}