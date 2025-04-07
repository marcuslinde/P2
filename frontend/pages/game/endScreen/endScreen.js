import { getElementById } from "../../../utility/helperFunctions";
import { Game, setGame, User } from "../../../utility/state";
import '../../../utility/redirection'

const winnerElement = getElementById("winner")

const enemyName = Game().players[0].name == User().name ? Game().players[1].name : Game().players[1].name;



if (Game().winner == User()._id) {
    winnerElement.innerHTML = "Congratulations sailor, you won the battle!"
} else {
    winnerElement.innerHTML = `${enemyName} won the battle!`
}


getElementById("goHomeButton").addEventListener("click", ()=> {
    setGame(null);
    window.location.href = "/";
})