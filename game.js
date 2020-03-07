// << SANKET PATEL >>
// U. of Illinois, Chicago
// IT 202: Spring 2020
// Project #03


//Variables declaration
let context, controller, rectangle, loop;
let _bonusFall = {x:50, y:50, radius:7};
let _harmFall = {x:50, y:50, radius:7};

//Set default values for variables
let life = 3;
let score = 0;
let level = 1;
let objfallRate = 1;

c = document.querySelector("canvas");
context = c.getContext("2d");
c.height = 400;
c.width = 700;

//Represents starting screen of the game
context.font = "20px Arial";
context.fillStyle = "red";
context.fillText("INSTRUCTIONS: ", c.width/2.3, c.height/1.5);
context.fillText("orange-color object: HARM object (Reduces life BY 1)", c.width/3.9, c.height/1.2);
context.fillText("blue-color object: BONUS object (Increases score by 1)", c.width/3.9, c.height/1.3);
context.fillText("INSTRUCTIONS: ", c.width/2.3, c.height/1.5);
context.fillStyle = "blue";
context.fillText("Press SPACE to begin the FUN", c.width/3, c.height/2);

//shows the canvas background image
let backgroundImage = new Image();
backgroundImage.src = "img/1.jpeg";

//user moveable object
rectangle = {
    height:10,
    width:20,
    x:350,           //assigning x-coordinate for the start point (centre of canvas)
    x_velocity:0,
    y:0,
    y_velocity:0
};


//basically controls the movement of object
controller = {
    left:false,
    right:false,
    keyListener:function(event) 
    {
        //Represents key activation
        let key_state = (event.type == "keydown")?true:false;
        switch(event.keyCode) 
        {
            case 37:                          // left key
            controller.left = key_state;
            break;
            case 39:                         // right key
            controller.right = key_state;
            break;
        }
    }
};


//collision detection function
collision = (obj1, obj2) => 
{
    let result = false;

    let dx = obj1.x - obj2.x;
    let dy = obj1.y - obj2.y;
    let distance = Math.sqrt((dx * dx) + (dy * dy));

    if(distance <= ((obj1.height/2) + (obj2.radius)))
    {
        result = true;
    }
    return result;
}

//loop to play the game till break point 
loop = () => 
{
    //clear screen
    context.clearRect(0,0, c.width, c.height);		

    //update values of bonus and harm objets
    _bonusFall["y"] += objfallRate;
    _harmFall["y"] += objfallRate;


    if (controller.left) {
        rectangle.x_velocity -= 0.5;
    }

    if (controller.right) {
        rectangle.x_velocity += 0.5;
    }

    rectangle.y_velocity += 1.5;          //gravity
    rectangle.x += rectangle.x_velocity;
    rectangle.y += rectangle.y_velocity;
    rectangle.x_velocity *= 0.9;          //friction


    //Condition that handles the edge conditions for falling object
    if (_bonusFall["y"] > c.height + _bonusFall["radius"]) {
        _bonusFall["x"] = Math.floor(Math.random() * c.width);
        _bonusFall["y"] = -_bonusFall["radius"];
    }	

    if (_harmFall["y"] > c.height + _harmFall["radius"]) {
        _harmFall["x"] = Math.floor(Math.random() * c.width);
        _harmFall["y"] = -_harmFall["radius"];
    }	

    //Y-coordinate of the user movable obj (constant as it moves horizontally)
    if (rectangle.y > 387) 
    {
        rectangle.y = 387;
    }

    //if user movable obj is going off the left of the screen
    if (rectangle.x < -32) 
    {
        rectangle.x = 700;
    } 
    
    //if user movable objgoes past right boundary
    else if (rectangle.x > 700) 
    {
        rectangle.x = -32;
    }

    //make the background and objects appear
    if(life > 0)
    {
        context.drawImage(backgroundImage, 0, 0, backgroundImage.naturalWidth * 0.5, backgroundImage.naturalHeight * 0.5);
    }
    else
    {
        context.fillRect(0, 0, c.width, c.height);
        context.fillStyle = "red";
        context.textAlign = "center";
        context.font = "15px Helvetica";
        context.fillText("GAME OVER! RELOAD PAGE TO PLAY AGAIN", c.width/2, c.height/2);
    }

    //bonus/benifit object 
    context.beginPath();
    context.arc(_bonusFall["x"],_bonusFall["y"],_bonusFall["radius"],0, Math.PI*2);
    context.closePath();
    context.fillStyle = "#00bfff";
    context.fill();

    //harmFall object
    context.beginPath();
    context.arc(_harmFall["x"],_harmFall["y"],_harmFall["radius"],0, Math.PI*2);
    context.closePath();
    context.fillStyle = "orange";
    context.fill();
   
    //User movable object
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    context.fill();

    //Collision detection and updating variables
    if(collision(rectangle, _bonusFall))
    {
        score++; 
        if(score > 5)
        {
            objfallRate = 3;
            level++;
        }
        if(score > 10)
        {
            objfallRate = 4;
        }
        if(score > 15)
        {
            objfallRate = 5;
        }
        _bonusFall["x"] = Math.floor(Math.random() * c.width);
        _bonusFall["y"] = -_bonusFall["radius"];
    } 
    
    else if(collision(rectangle, _harmFall))
    {
    life--;
    _harmFall["x"] = Math.floor(Math.random() * c.width);
    _harmFall["y"] = -_harmFall["radius"];
    }

    //Text on display the values of variables assigned
    context.font = 'bold 15px Open Sans';
    context.fillText('Lives: ' + life, 620, 20);
    context.fillText('Score: ' + score, 620, 40);
    context.fillText('Level: ' + level, 620, 60);

    //update call to draw border again when ready
    window.requestAnimationFrame(loop);	
};

window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);


//play the game after space-bar is pressed. 
document.addEventListener('keyup', event => {
if (event.code === 'Space') 
{
window.requestAnimationFrame(loop);
}
})