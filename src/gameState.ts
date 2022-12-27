export class GameState{
    tramStarted:Boolean = false;
    rockPickedUp: Boolean = false;
    reachedElevator: Boolean = false;
    akhilDialogueComplete: Boolean = false;
    soumyaWaveAction: Boolean = false;
    umbrellaPickedUp: Boolean = false;
}


export const GAME_STATE = new GameState();