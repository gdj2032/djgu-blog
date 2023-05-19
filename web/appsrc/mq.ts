import { IpcMainEvent, ipcMain } from 'electron';

declare type MessageListener = {
  id: number;
  onMessage: (data: any) => any;
};
declare type MessageNode = {
  listeners: MessageListener[];
  channel: string;
}

/**
 * 负责按照主进程窗口ID来分类，并转发来自Render进程的消息
 */
class MessageQueue {
  private messageQueues: MessageNode[];
  constructor() {
    this.messageQueues = []
  }

  public registerMessage(channel: string, id: number, onMessage: (data: any) => any) {
    //1. 如果消息没有注册过，注册
    let node = this.getMessageNode(channel);
    if (!node) {
      node = { channel, listeners: [] };
      this.messageQueues.push(node);
    }
    const listener = this.getMessageListener(node, id);
    if (!listener) {
      node.listeners.push({ id: id, onMessage: onMessage });
    }
    ipcMain.removeAllListeners(channel);
    ipcMain.on(channel, (event, args) => {
      const { winId, data } = args;
      this.onMessage(channel, winId, event, data)
    })
  }

  unregisterAllMessages(id: number) {
    for (const node of this.messageQueues) {
      for (let i = node.listeners.length - 1; i >= 0; i--) {
        if (node.listeners[i].id === id) {
          node.listeners.splice(i, 1);
        }
      }
    }
  }
  public unregisterMessage(channel: string, id: number) {
    const node = this.getMessageNode(channel);
    if (node) {
      for (let i = 0; i < node.listeners.length; i++) {
        if (node.listeners[i].id === id) {
          node.listeners.splice(i, 1);
          break;
        }
      }
    }
  }

  onMessage(channel: string, id: number, event: IpcMainEvent, data: any) {
    const node = this.getMessageNode(channel);
    if (node) {
      const listener = this.getMessageListener(node, id);
      if (listener && listener.onMessage) {
        try {
          const ret = listener.onMessage(data);
          if (ret instanceof Promise) {
            ret.then((v: any) => {
              event.returnValue = v;
            }).catch((e) => {
              throw e;
            })
          } else {
            event.returnValue = ret;
          }
          return;
        } catch (e) {
          console.error('message listener err:', e);
          event.returnValue = e;
        }
      }
    }
    event.returnValue = null;
  }

  getMessageNode(channel: string) {
    for (const n of this.messageQueues) {
      if (n.channel === channel) {
        return n;
      }
    }
    return null;
  }

  getMessageListener(node: MessageNode, id: number) {
    return node.listeners.find((value) => {
      return value.id === id;
    });
  }
}
const instance = new MessageQueue();
export default instance;
