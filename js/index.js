const createGame = async () => {
    const stage = new Konva.Stage({
        container: 'konva-container',   // id of container <div>
        width: 800,
        height: 600,
    });

    // Creating layer to add on stage
    const layer = new Konva.Layer();

    // Adding layer to stage
    stage.add(layer);

    const backgroundImage = new Konva.Image({
        image: await loadImage('bg.svg'),
        width: 800,
        height: 600,
    });

    layer.add(backgroundImage);

    const konvaSpaceShipImage = new Konva.Image({
        image: await loadImage('main-jet-2.svg'),
        height: 100,
        width: 130,
        x: 10,
        y: 250,
    });

    layer.add(konvaSpaceShipImage);

    const moveJet = (event) => {
        const step = 10;
        let newX = konvaSpaceShipImage.x();
        let newY = konvaSpaceShipImage.y();

        switch (event.key) {
            case 'ArrowUp':
                newY -= step;
                break;
            case 'ArrowDown':
                newY += step;
                break;
            case 'ArrowLeft':
                newX -= step;
                break;
            case 'ArrowRight':
                newX += step;
                break;
        }

        konvaSpaceShipImage.position({
            x: newX,
            y: newY,
        });

        layer.draw();
    };

    const fireBullet = async () => {
        const bulletImage = new Konva.Image({
            image: await loadImage('bullet.svg'),
            width: 20,
            height: 20,
            x: konvaSpaceShipImage.x() + konvaSpaceShipImage.width(),
            y: konvaSpaceShipImage.y() + konvaSpaceShipImage.height() / 2 - 10,
        });

        layer.add(bulletImage);

        const bulletTween = new Konva.Tween({
            node: bulletImage,
            duration: 1,
            x: stage.width(),
            onFinish: () => {
                bulletImage.destroy();
                layer.draw();
            },
        });

        bulletTween.play();

        // Check for collision with the meteor at regular intervals
        const checkCollisionInterval = setInterval(() => {
            if (detectCollision(bulletImage, bigMeteor)) {
                destroyObjAnimation(bigMeteor);
                bulletImage.destroy();
                layer.draw();
                clearInterval(checkCollisionInterval);
            }
        }, 50); // Check every 50 milliseconds
    };

    window.addEventListener('keydown', (event) => {
        moveJet(event);
        if (event.key === ' ') {
            fireBullet();
        }
    });

    const bigMeteor = new Konva.Image({
        image: await loadImage('Big Meteor.svg'),
        height: 100,
        width: 130,
        x: stage.width(),
        y: 250,
    });

    layer.add(bigMeteor);

    const meteorTween = new Konva.Tween({
        node: bigMeteor,
        x: 10,
        duration: 5,
        onFinish: () => {
            destroyObjAnimation(bigMeteor);
        },
    });

    meteorTween.play();
};

createGame();
