class Tags {
  static MASK_SMALL_INT = 0xc0;
  static SMALL_INT_TAG = 0x00;
  static MASK_INT = 0x80;
  static INT_TAG = 0x80;

  static EOF = -1;
  static NULL = 0x40;
  static TRUE = 0x41;
  static FALSE = 0x42;
  static FLOAT_TAG = 0x43;
  static DOUBLE_TAG = 0x44;
  static LIST_TAG = 0x45;
  static STR_TAG = 0x46;
  static BYTES_TAG = 0x47;
  static MAP_TAG = 0x48;

  static MAX_LENGTH_SMALL_LIST = 16;
  static MASK_SMALL_LIST_TAG = 0xf0;
  static SMALL_LIST_TAG = 0x50;
  static MASK_LENGTH_SMALL_LIST = 0xf;

  static MAX_BYTES_SMALL_STR = 32;
  static MASK_SMALL_STR_TAG = 0xe0;
  static SMALL_STR_TAG = 0x60;
  static MASK_SIZE_SMALL_STR = 0x1f;

  static isInt(tag) {
    return (
      (tag & Tags.MASK_SMALL_INT) == Tags.SMALL_INT_TAG ||
      (tag & Tags.MASK_INT) == Tags.INT_TAG
    );
  }

  static isFloat(tag) {
    return tag == Tags.FLOAT_TAG;
  }

  static isDouble(tag) {
    return tag == Tags.DOUBLE_TAG;
  }

  static isNull(tag) {
    return tag == Tags.NULL;
  }

  static isBoolean(tag) {
    return tag == Tags.TRUE || tag == Tags.FALSE;
  }

  static isBigString(tag) {
    return tag == Tags.STR_TAG;
  }

  static isSmallString(tag) {
    return (tag & Tags.MASK_SMALL_STR_TAG) == Tags.SMALL_STR_TAG;
  }

  static isString(tag) {
    return Tags.isSmallString(tag) || Tags.isBigString(tag);
  }

  static isSmallList(tag) {
    return (tag & Tags.MASK_SMALL_LIST_TAG) == Tags.SMALL_LIST_TAG;
  }

  static isBigList(tag) {
    return tag == Tags.LIST_TAG;
  }

  static isList(tag) {
    return Tags.isSmallList(tag) || Tags.isBigList(tag);
  }

  static isMap(tag) {
    return tag == Tags.MAP_TAG;
  }
}

module.exports = { Tags };
