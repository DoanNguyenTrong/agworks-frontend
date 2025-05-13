import { StatusType } from "./utils/constant";

export const RenderStatusWO = (value: string) => {
    switch (value) {
        case StatusType.PRUNING:
            return "Pruning"
        case StatusType.SHOOT_THINNING:
            return "Shoot Thinning"
        case StatusType.OTHER:
            return "Other"
    
        default:
            return "---";
    }
}