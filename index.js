const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

canvas.width = 1350
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/background.png'
})

const shop = new Sprite({
    position: {
        x: 880,
        y: 114
    },
    imageSrc: './assets/shop.png',
    scale: 3,
    frameMax: 6
})

const player = new Fighter({
    position: {
        x: 400,
        y: 200
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/Hero/Idle.png',
    frameMax: 11,
    scale: 2.5,
    offset: {
        x: 190,
        y: 135
    },
    sprites: {
        idle: {
            imageSrc: './assets/Hero/Idle1.png',
            frameMax: 11
        },
        run: {
            imageSrc: './assets/Hero/Run.png',
            frameMax: 8
        },
        jump: {
            imageSrc: './assets/Hero/Jump.png',
            frameMax: 3
        },
        fall: {
            imageSrc: './assets/Hero/Fall.png',
            frameMax: 3
        },
        attack1: {
            imageSrc: './assets/Hero/Attack1.png',
            frameMax: 7
        },
        takeHit: {
            imageSrc: './assets/Hero/Take Hit.png',
            frameMax: 4
        },
        death: {
            imageSrc: './assets/Hero/Death.png',
            frameMax: 11
        }
    },
    attackBox: {
        offset: {
            x: 35,
            y: 50
        },
        width: 100,
        height: 50
    }

})


const enemy = new Fighter({
    position: {
        x: 900,
        y: 200
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './assets/Warrior/Idle.png',
    frameMax: 8,
    scale: 3,
    offset: {
        x: 190,
        y: 137
    },
    sprites: {
        idle: {
            imageSrc: './assets/Warrior/Idle.png',
            frameMax: 8
        },
        run: {
            imageSrc: './assets/Warrior/Run.png',
            frameMax: 8
        },
        jump: {
            imageSrc: './assets/Warrior/Jump.png',
            frameMax: 2
        },
        fall: {
            imageSrc: './assets/Warrior/Fall.png',
            frameMax: 2
        },
        attack1: {
            imageSrc: './assets/Warrior/Attack3.png',
            frameMax: 4
        },
        takeHit: {
            imageSrc: './assets/Warrior/Take Hit.png',
            frameMax: 4
        },
        death: {
            imageSrc: './assets/Warrior/Death.png',
            frameMax: 6
        }
    },
    attackBox: {
        offset: {
            x: -100,
            y: 50
        },
        width: 100,
        height: 50
    }
})


console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player move
    if (keys.a.pressed && player.lastkey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastkey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    //player jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    //enemy move
    if (keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    //enemy jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }


    //detect for collision & enemy get Hit
    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) && player.isAttacking && player.framesCurrent === 4) {
        enemy.takeHit()
        player.isAttacking = false
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    //if player Misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    //detect for collision & player get Hit
    if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) && enemy.isAttacking && enemy.framesCurrent === 2) {
        player.takeHit()
        enemy.isAttacking = false
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    //if player Misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                player.lastkey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastkey = 'a'
                break
            case 'w':
                player.velocity.y = -15
                break
            case 's':
                player.attack()
                break
        }
    }
    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastkey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastkey = 'ArrowLeft'
                break
            case 'ArrowUp':
                enemy.velocity.y = -15
                break
            case 'ArrowDown':
                enemy.attack()
                break

        }
    }
})
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})