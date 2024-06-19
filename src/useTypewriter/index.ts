export class Typewriter {
  private queue: string[] = [];
  private consuming = false;
  private timer: undefined | NodeJS.Timeout = void 0; // 更改变量名为timer
  onFinish: () => void = () => {};
  onConsume: (message: string) => void = () => {};
  constructor(onConsume: (str: string) => void, { initStr, onFinish } = {}) {
    this.onConsume = onConsume;
    this.onFinish = onFinish;

    if (initStr) {
      this.queue = initStr?.split('');
    }
  }
  dynamicSpeed() {
    if (this.queue.length === 0) return 0;
    const speed = 1500 / this.queue.length;
    if (speed > 200) {
      return 200;
    } else if (speed < 20) {
      return 20;
    } else {
      return speed;
    }
  }
  add(str: string) {
    if (!str) return;
    this.queue.push(...str.split(''));
  }
  consume = () => {
    if (this.queue.length > 0) {
      const str = this.queue.shift();
      if (str) {
        try {
          this.onConsume(str);
        } catch (error) {
          console.error('Error occurred in onConsume callback:', error);
          // 可以选择是否要在这里终止处理
        }
      }
    } else {
      this.done();
    }
  };
  next() {
    this.consume();
    const speed = this.dynamicSpeed(); // 优化：只在需要时计算速度
    this.timer = setTimeout(() => {
      this.consume();
      if (this.consuming) {
        this.next();
      }
    }, speed);
  }
  start() {
    this.consuming = true;
    this.next();
  }
  done() {
    this.consuming = false;
    clearTimeout(this.timer);
    try {
      // 保证queue非空时才调用onConsume，避免传递空字符串
      if (this.queue.length > 0) {
        this.onConsume(this.queue.join(''));
      }
    } catch (error) {
      console.error('Error occurred in onConsume callback inside done:', error);
    }
    try {
      this.onFinish();
    } catch (error) {
      console.error('Error occurred in onFinish callback:', error);
    }
    this.queue = [];
  }
}
