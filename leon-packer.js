const fs = require('fs');

const { Tags } = require('./tags');

class OutputStream {
  output = null;

  constructor() {
    this.output = Buffer.alloc(0);
  }

  writeFloatLE(value) {
    const buffer = Buffer.alloc(5);
    buffer[0] = Tags.FLOAT_TAG;
    buffer.writeFloatLE(value, 1);
    this.output = Buffer.concat([this.output, buffer]);
  }

  writeDoubleLE(value) {
    const buffer = Buffer.alloc(9);
    buffer[0] = Tags.DOUBLE_TAG;
    buffer.writeDoubleLE(value, 1);
    this.output = Buffer.concat([this.output, buffer]);
  }

  write(value) {
    let buffer = Buffer.from([value]);
    if (typeof value === 'string') {
      buffer = Buffer.from(value);
    }
    this.output = Buffer.concat([this.output, buffer]);
  }
}

class LeonPacker {
  output = null;
  offset = 0;

  constructor(filename) {
    this.file = fs.openSync(filename, 'w');
    this.output = new OutputStream();
  }

  packFloat(value) {
    this.output.writeFloatLE(value);
    return this;
  }

  packDouble(value) {
    this.output.writeDoubleLE(value);
    return this;
  }

  packInt(value) {
    while (value < -32 || value >= 32) {
      this.output.write((value & 0x7f) + 0x80);
      value = value >> 7;
    }
    this.output.write(value & 0x3f);
    return this;
  }

  packString(value) {
    const size = value.length;
    if (size <= Tags.MAX_BYTES_SMALL_STR) {
      this.output.write(Tags.SMALL_STR_TAG | size);
    } else {
      this.output.write(Tags.STR_TAG);
      this.packInt(size);
    }
    for (let i = 0; i < size; i++) {
      this.output.write(value[i]);
    }
    return this;
  }

  packBoolean(value) {
    if (value === true) {
      this.output.write(Tags.TRUE);
      return this;
    }
    this.output.write(Tags.FALSE);
    return this;
  }

  packNull() {
    this.output.write(Tags.NULL);
    return this;
  }

  packMap(map) {
    const size = map.size;
    this.output.write(Tags.MAP_TAG);
    this.packInt(size);
    map.forEach((value, key) => {
      this.packObject(value);
      this.packObject(key);
    });
    return this;
  }

  packList(list) {
    const size = list.length;
    if (size <= Tags.MAX_LENGTH_SMALL_LIST) {
      this.output.write(Tags.SMALL_LIST_TAG | size);
    } else {
      this.output.write(Tags.LIST_TAG);
      this.packInt(size);
    }
    for (let i = 0; i < size; i++) {
      this.packObject(list[i]);
    }
    return this;
  }

  packObject(value) {
    if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        this.packInt(value);
      } else {
        this.packDouble(value);
      }
    } else if (typeof value === 'string') {
      this.packString(value);
    } else if (typeof value === 'boolean') {
      this.packBoolean(value);
    } else if (value === null) {
      this.packNull();
    } else if (Array.isArray(value)) {
      this.packList(value);
    } else if (value instanceof Map) {
      this.packMap(value);
    }
    return this;
  }

  close() {
    fs.writeSync(this.file, this.output.output);
  }
}

module.exports = { LeonPacker };
