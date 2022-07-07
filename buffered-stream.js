class BufferedStream {
  buffer = null;
  offset = 0;

  constructor(buffer) {
    this.buffer = buffer;
  }

  read(length = 1) {
    if (length === 1) {
      return this.buffer[this.offset++];
    }
    const outputBuffer = Buffer.alloc(length);
    for (let i = 0; i < length; i++) {
      outputBuffer[i] = this.buffer[this.offset];
      this.offset += 1;
    }
    return outputBuffer;
  }

  readFloatLE() {
    const value = this.buffer.readFloatLE(this.offset);
    this.offset += 4;
    return value;
  }

  readDoubleLE() {
    const value = this.buffer.readDoubleLE(this.offset);
    this.offset += 8;
    return value;
  }
}

module.exports = { BufferedStream };
