import _Token from "../models/Token";

export default class BoardState {
    width_squares: number;
    height_squares: number;
    tokens: {
        map: _Token[];
        action: _Token[];
        gm: _Token[]; 
    }; 
}