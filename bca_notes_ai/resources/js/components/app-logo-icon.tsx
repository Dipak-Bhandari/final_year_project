import { ImgHTMLAttributes } from "react";

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <div className="h-10 w-10 items-center rounded-full scale-200">
            <img
                src="/bcai.png"
                alt="Bcai Notes"
                {...props}
            />
        </div>

    );
}
