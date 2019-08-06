'use strict';

class _Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }

  insertBefore(item, key) {
    let currNode = this.head;
    let prevNode = this.head;

    if (this.head === null) {
      this.head = new _Node(item, this.head);
    }
    while (currNode.value !== key) {
      prevNode = currNode;
      currNode = currNode.next;
    }
    prevNode.next = new _Node(item, currNode);
  }

  insertAfter(item, key) {
    let currNode = this.head;

    while (currNode.value !== key) {
      currNode = currNode.next;
    }
    currNode.next = new _Node(item, currNode.next);
  }

  insertAt(item, location) {
    let currNode = this.head;
    let count = 1;
    if (location === 0) {
      this.head = new _Node(item, currNode);
      return;
    }
    while (count < location) {
      currNode = currNode.next;
      count++;
    }
    currNode.next = new _Node(item, currNode.next);
  }

  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(item, null);
    }
  }

  remove(item) {
    if (!this.head) {
      return null;
    }

    if (this.head.value === item) {
      this.head = this.head.next;
    }

    let currNode = this.head;
    let prevNode = this.head;

    while (currNode !== null && currNode.value !== item) {
      prevNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      console.log('Item not found');
      return;
    }
    prevNode.next = currNode.next;
  }

  find(item) {
    let currNode = this.head;
    if (!this.head) {
      return null;
    }
    while (currNode.value !== item) {
      if (currNode.next === null) {
        return null;
      } else {
        currNode = currNode.next;
      }
    }
    return currNode;
  }

}

function display(list) {
  let currNode = list.head;
  if (!list.head) {
    return null;
  }
  while (currNode.next !== null) {
    currNode = currNode.next;
    console.log(currNode.value);
  }
}

function size(list) {
  let count;
  let currNode = list.head;
  if (!list.head) {
    count = 0;
    return count;
  }
  count = 1;
  while (currNode.next !== null) {
    currNode = currNode.next;
    count++;
  }
  return count;
}

function isEmpty(list) {
  return !list.head;
}

function findPrevious(list, item) {
  let currNode = list.head;
  let prevNode = list.head;

  if (list.head === null) {
    console.log('No items in list');
    return;
  }
  if (item === currNode.value) {
    console.log('No items before first item in list');
    return;
  }
  while (currNode.value !== item && currNode.next !== null) {
    prevNode = currNode;
    currNode = currNode.next;
  }
  return prevNode.value;
}

function findLast(list) {
  let currNode = list.head;
  let prevNode = list.head;
  if (!list.head) {
    console.log('No items in list');
    return;
  }
  while (currNode.next !== null) {
    prevNode = currNode;
    currNode = currNode.next;
  }
  return currNode.value;
}

module.exports = LinkedList;