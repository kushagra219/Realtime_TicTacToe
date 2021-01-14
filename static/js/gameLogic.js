var room_code = document.currentScript.getAttribute('room_code');
var username = document.currentScript.getAttribute('username');
var player = username.charAt(0);

// console.log(player);

let socket = new WebSocket('ws://127.0.0.1:8000/ws/game/' + room_code + '/')

let gameState = ["", "", "", "", "", "", "", "", ""];

let elementArray = document.querySelectorAll('.fixed')

// console.log(elementArray.length);

elementArray.forEach(function(elem) {
    elem.addEventListener("click", function(event) {
        setText(event.path[0].getAttribute('id'), player);
    })
})

function redirectToHome() {
    setTimeout(function() {
        window.location = "http://127.0.0.1:8000/home/";
    }, 3000);
}

function checkGameEnd() {
    var count = 0;
    gameState.map((game) => {
        if (game != "") {
            count++;
        }
    })

    if (count >= 9) {
        var data = {
            'type': 'over'
        };
        socket.send(JSON.stringify({
            data
        }));
        swal("Game Over!", "Nobody won!", "warning");
        // redirectToHome();
    }
}

function checkWon(value, player) {
    var won = false;

    if (gameState[0] === value && gameState[1] == value && gameState[2] == value) {
        won = true;
    } else if (gameState[0] === value && gameState[1] == value && gameState[2] == value) {
        won = true;
    } else if (gameState[3] === value && gameState[4] == value && gameState[5] == value) {
        won = true;
    } else if (gameState[6] === value && gameState[7] == value && gameState[8] == value) {
        won = true;
    } else if (gameState[0] === value && gameState[3] == value && gameState[6] == value) {
        won = true;
    } else if (gameState[1] === value && gameState[4] == value && gameState[7] == value) {
        won = true;
    } else if (gameState[2] === value && gameState[5] == value && gameState[8] == value) {
        won = true;
    } else if (gameState[0] === value && gameState[4] == value && gameState[8] == value) {
        won = true;
    } else if (gameState[2] === value && gameState[4] == value && gameState[6] == value) {
        won = true;
    }

    if (won) {
        var data = {
            'type': 'end',
            'player': player
        };
        socket.send(JSON.stringify({
            data
        }));
        swal("Good Job!", "You won!", "success");
        // redirectToHome();
    }

    checkGameEnd();
}

function setText(index, value) {
    var data = {
        'player': player,
        'index': index,
        'type': 'running',
    }

    if (gameState[parseInt(index)] == "") {
        gameState[parseInt(index)] = value;
        elementArray[parseInt(index)].innerHTML = value;

        socket.send(JSON.stringify({
            data
        }));

        checkWon(value, player);

    } else {
        alert("You cannot fill this space!");
    }
}

function setAnotherUserText(index, value) {
    gameState[parseInt(index)] = value;
    elementArray[parseInt(index)].innerHTML = value;
}

socket.onopen = function(e) {
    console.log('Socket connected');
}

socket.onmessage = function(e) {
    var data = JSON.parse(e.data);

    if (data.payload.type == 'end' && data.payload.player !== player) {
        swal("Sorry!", "You lost!", "error");
        // redirectToHome();
    } else if (data.payload.type == 'over' && data.payload.player !== player) {
        swal("Game Over!", "Nobody won!", "warning");
        // redirectToHome();
        return;
    } else if (data.payload.type == 'running' && data.payload.player !== player) {
        setAnotherUserText(data.payload.index, data.payload.player);
    }

}

socket.onclose = function(e) {
    console.log('Socket closed');
}