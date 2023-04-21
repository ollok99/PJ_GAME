class GameScene extends Phaser.GameScene {
  // 이미지 불러오는 함수
  preload() {
    this.load.setPath("./images");
    this.load.image("bg", "1.png");
    this.load.image("bg2", "2.png");
    this.load.image("block", "3.png");
    this.load.image("player", "player.png");
  }

  create() {
    this.bg = this.add
      .tileSprite(0, 0, WIDTH, HEIGHT, "bg0") //tileSprite로 타일 배경 읽어들이기
      .setScale(8) //작은 이미지라서 크기 키워줌
      .setOrigin(0, 0);
    this.bg2 = this.add
      .tileSprite(0, HEIGHT - 100, WIDTH, 10, "bg2")
      .setScale(8)
      .setOrigin(0, 0);

    this.player = this.physics.add
      .sprite(200, HEIGHT / 2, "player")
      .setScale(5);
    this.player.setGravityY(200);
    this.player.setCollideWorldBounds(true);

    this.delay = 3000;
    this.timer = this.time.addEvent({
      delay: this.delay,
      callback: this.onTimerEvent,
      callbackScope: this,
      loop: true,
    });

    this.input.on(
      "pointerdown",
      function (pointer) {
        if (this.player_tweens) this.player_tweens.stop();
        this.player.setVelocity(0, -150);
        this.player_tweens = this.tweens.timeline({
          tweens: [
            {
              targets: this.player,
              angle: -30,
              duration: 300,
              onComplete: function (tween, targets) {
                this.player.setVelocity(0, 0);
              }.bind(this),
            },
            {
              targets: this.player,
              angle: 30,
              duration: 500,
            },
          ],
        });
      }.bind(this)
    );
  }

  // 계속 업데이트 되어야 하는 로직
  update() {
    this.bg.tilePositionX -= 0.5;
    this.bg2.tilePositionX += 1;
  }

  onTimerEvent() {
    this.addBlock();
  }

  addBlock() {
    this.blockGroup = this.physics.add.group();

    var randomY = Phaser.Math.Between(700, 1000);
    var randomHeight = Phaser.Math.Between(300, 400);

    var block1 = this.physics.add
      .sprite(WIDTH, randomY - HEIGHT - randomHeight, "block")
      .setScale(5)
      .setFlipY(true);
    var block2 = this.physics.add.sprite(WIDTH, randomY, "block").setScale(5);

    this.blockGroup.add(block1);
    this.blockGroup.add(block2);

    this.tweens.add({
      targets: block1,
      x: 0,
      duration: 8000,
      onComplete: function (tween, targets) {
        block1.destroy();
      }.bind(this),
    });

    this.tweens.add({
      targets: block2,
      x: 0,
      duration: 8000,
      onComplete: function (tween, targets) {
        block2.destroy();
      }.bind(this),
    });

    this.physics.add.overlap(
      this.blockGroup,
      this.player,
      this.hitBlockPlayer,
      null,
      this
    );
  }

  hitBlockPlayer() {
    alert("Game Over!!!");
    this.scene.restart();
  }
}
