const fs = require('fs');

const { BufferedStream } = require('./buffered-stream');
const { Tags } = require('./tags');

class LeonUnpacker {
  input = null;

  constructor(filename) {
    this.input = new BufferedStream(fs.readFileSync(filename));
  }

  unpackInt() {
    return this.unpackIntWithTag(this.input.read());
  }

  unpackIntWithTag(tag) {
    let n, y, b, x;
    let eof = tag === -1;
    if (Tags.isInt(tag)) {
      n = 0;
      y = 0;
      b = tag;
      while (!eof && b >= 0x40) {
        y += (b - 0x80) << n;
        n += 7;
        b = this.input.read();
        eof = b == -1;
      }
      b = (b & 0x1f) - (b & 0x20);
      x = y + (b << n);
      return x;
    }
  }

  unpackFloat() {
    return this.unpackFloatWithTag(this.input.read());
  }

  unpackFloatWithTag(tag) {
    if (Tags.isFloat(tag)) {
      return this.input.readFloatLE();
    }
  }

  unpackDouble() {
    return this.unpackDoubleWithTag(this.input.read());
  }

  unpackDoubleWithTag(tag) {
    if (Tags.isDouble(tag)) {
      return this.input.readDoubleLE();
    }
  }

  unpackNull() {
    return this.unpackNullWithTag(this.input.read());
  }

  unpackNullWithTag(tag) {
    if (Tags.isNull(tag)) {
      return null;
    }
  }

  unpackBoolean() {
    return this.unpackBooleanWithTag(this.input.read());
  }

  unpackBooleanWithTag(tag) {
    if (Tags.isBoolean(tag)) {
      return Tags.TRUE == tag;
    }
  }
  unpackString() {
    return this.unpackStringWithTag(this.input.read());
  }

  unpackStringWithTag(tag) {
    let size = 0;
    if (Tags.isSmallString(tag)) {
      size = tag & Tags.MASK_SIZE_SMALL_STR;
    } else if (Tags.isBigString(tag)) {
      size = this.unpackInt();
    }
    const str = this.input.read(size);
    return str.toString();
  }

  unpackObject() {
    const tag = this.input.read();
    if (Tags.isInt(tag)) {
      return this.unpackIntWithTag(tag);
    } else if (Tags.isFloat(tag)) {
      return this.unpackFloatWithTag(tag);
    } else if (Tags.isDouble(tag)) {
      return this.unpackDoubleWithTag(tag);
    } else if (Tags.isNull(tag)) {
      return null;
    } else if (tag == Tags.TRUE) {
      return true;
    } else if (tag == Tags.FALSE) {
      return false;
    } else if (Tags.isString(tag)) {
      return this.unpackStringWithTag(tag);
    }
  }

  unpackMap() {
    return this.unpackMapWithTag(this.input.read());
  }

  unpackMapWithTag(tag) {
    const map = new Map();
    if (Tags.isMap(tag)) {
      const size = this.unpackInt();
      for (let i = 0; i < size; i++) {
        const key = this.unpackObject();
        const value = this.unpackObject();
        map.set(key, value);
      }
      return map;
    }
  }

  unpackList() {
    return this.unpackListWithTag(this.input.read());
  }

  unpackListWithTag(tag) {
    const list = [];
    let size = 0;
    if (Tags.isSmallList(tag)) {
      size = tag & Tags.MASK_LENGTH_SMALL_LIST;
    } else if (Tags.isBigList(tag)) {
      size = this.unpackInt();
    }
    for (let i = 0; i < size; i++) {
      list.push(this.unpackObject());
    }
    return list;
  }
}

module.exports = { LeonUnpacker };
