'use client';
import { useRouter } from 'next/navigation';
import BackArrow from "/public/assets/icon/back-arrow.svg"
import ButtonIcon from "./ButtonIcon"

export default function Actionbar({title, icon = <BackArrow />, textAlign = 'center'}){
    const router = useRouter()
    const textPosition = textAlign.toLowerCase() === 'left' ? "justify-start pl-[2%]" : textAlign.toLowerCase() === 'right' ? "justify-end  pr-[2%]" : "justify-center";
    return (
        <div className={' bg-white top-0 fixed flex w-full h-[8%] items-center border-b-4 border-gray-300'}>
            <div className='flex text-6xl fill-current text-primary pl-4 h-[80%] absolute z-10'>
                <ButtonIcon
                    icon={icon}
                    onClick={() => router.back()}
                />
            </div>
            <span className={"text-black text-4xl font-semibold w-full absolute flex " + textPosition}>
                {title}
            </span>
        </div>
    )
}