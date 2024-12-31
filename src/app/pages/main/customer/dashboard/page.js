"use client"
import Banner from "@/app/components/Banner";
import BestSeller from "@/app/components/BestSeller";
import HotProducts from "@/app/components/HotProducts";

export default function homepage(){
    return (
        <div className="">
            <Banner/>
            <HotProducts/>
            <BestSeller/>
        </div>
    )
}