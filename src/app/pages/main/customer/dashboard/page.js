"use client"
import Banner from "@/app/components/Banner";
import BestSeller from "@/app/components/BestSeller";
import HotProducts from "@/app/components/HotProducts";
import Interesting from "@/app/components/Interesting";

export default function homepage(){
    return (
        <div className="">
            <Banner/>
            <Interesting/>
            <HotProducts/>
            <BestSeller/>
        </div>
    )
}