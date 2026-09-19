import Lottie from "lottie-react"
import lottie from "../../assets/lotties/404error.json"

const NotFoundPage = () => {
    return (
        // bg-[#68dee0]
        <div className='h-screen flex items-center justify-center bg-[#c9f1f1] text-white w-full '>

            <Lottie animationData={lottie} loop={true} className='w-screen' />
        </div>
    )
}

export default NotFoundPage