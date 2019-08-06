export default interface _Token {
    x_coord: number,
    y_coord: number,
    width: number,
    height: number,
    color: string,
    rotation?: number,
    scale?:number,
    icon?: string,
    htmlImage?: HTMLImageElement
}