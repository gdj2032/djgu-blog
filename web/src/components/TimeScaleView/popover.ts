class TimePopover {
  _dom: HTMLElement;

  x: number;

  y: number;

  content: string;

  visible = false;

  generateTemplate = (content, x, y) => {
    this.content = content;
    return `
      <div class="u-popover-content">
        <div class="u-popover-arrow">
          <span class="u-popover-arrow-content"></span>
        </div>
        <div class="u-popover-inner">
          <div class="u-popover-inner-content">
            ${content}
          </div>
        </div>
      </div>
    `
  }

  show = ({ content, x, y }) => {
    this.visible = true;

    if (!this._dom) {
      const temp = this.generateTemplate(content, x, y);
      this._dom = document.createElement('div');
      this._dom.classList.add('m-time-popover');
      this._dom.innerHTML = temp;
      document.body.appendChild(this._dom);
    }

    if (this.content !== content) {
      const temp = this.generateTemplate(content, x, y);
      this._dom.innerHTML = temp;
    }

    this.move(x, y);
  }

  move = (x, y) => {
    if (x === this.x && y === this.y) {
      return;
    }

    this._dom.style.left = `${x}px`;
    this._dom.style.top = `${y}px`;
    this.x = x;
    this.y = y;
  }

  hide = () => {
    if (!this.visible) {
      return;
    }

    document.body.removeChild(this._dom);
    this._dom = null;
    this.content = '';
    this.x = 0;
    this.y = 0;
    this.visible = false;
  }
}

const timePopover = new TimePopover();

export default timePopover;
