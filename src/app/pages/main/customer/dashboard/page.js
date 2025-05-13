"use client"
import Banner from "@/app/components/Banner";
import BestSeller from "@/app/components/BestSeller";
import BookOfTheDay from "@/app/components/BookOfTheDay";
import HotProducts from "@/app/components/HotProducts";
import Interesting from "@/app/components/Interesting";
import NewArrival from "@/app/components/NewArrival";

export default function homepage(){
    return (
        <div className="">
            <Banner/>
        <div className="grid grid-cols-2 mt-2">
        <BookOfTheDay/>
        <NewArrival/>
        </div>
            <Interesting/>
            <HotProducts/>
            <BestSeller/>
        </div>
    )
}