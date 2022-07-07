const fs = require('fs');

const { LeonPacker } = require('../leon-packer');
const { LeonUnpacker } = require('../leon-unpacker');

describe('LeonPacker/LeonUnpacker', function () {
  it('Unpacks basic types', function () {
    const packer = new LeonPacker('simple.out');
    packer.packFloat(1.2);
    packer.packDouble(1.255);
    packer.packInt(11);
    packer.packInt(61);
    packer.packString(
      'LEON LEON LEON LEON LEON LEON is simple simple simple simple.'
    );
    packer.packString('LEON is simple');
    packer.packBoolean(true);
    packer.packBoolean(false);
    packer.packNull();
    packer.close();
    const unpacker = new LeonUnpacker('simple.out');
    expect(unpacker.unpackFloat()).toBe(1.2000000476837158);
    expect(unpacker.unpackDouble()).toBe(1.255);
    expect(unpacker.unpackInt()).toBe(11);
    expect(unpacker.unpackInt()).toBe(61);
    expect(unpacker.unpackString()).toBe(
      'LEON LEON LEON LEON LEON LEON is simple simple simple simple.'
    );
    expect(unpacker.unpackString()).toBe('LEON is simple');
    expect(unpacker.unpackBoolean()).toBe(true);
    expect(unpacker.unpackBoolean()).toBe(false);
    expect(unpacker.unpackNull()).toBe(null);
    fs.unlinkSync('simple.out');
  });
  it('Unpacks complex types', function () {
    const expectedMap = new Map([['class file magic number', 12]]);
    const packer = new LeonPacker('complex.out');
    packer.packMap(expectedMap);
    packer.packList([true, 1.2, 945]);
    packer.packList([
      true,
      1.2,
      945,
      true,
      1.2,
      945,
      true,
      1.2,
      945,
      true,
      1.2,
      945,
      true,
      1.2,
      945,
      true,
      1.2,
      945,
    ]);
    packer.close();
    const unpacker = new LeonUnpacker('complex.out');
    const map = unpacker.unpackMap();
    expect(map.has(12)).toBe(true);
    expect(map.get(12)).toBe('class file magic number');
    expect(unpacker.unpackList()).toEqual(
      expect.arrayContaining([true, 1.2, 945])
    );
    expect(unpacker.unpackList()).toEqual(
      expect.arrayContaining([
        true,
        1.2,
        945,
        true,
        1.2,
        945,
        true,
        1.2,
        945,
        true,
        1.2,
        945,
        true,
        1.2,
        945,
        true,
        1.2,
        945,
      ])
    );
    fs.unlinkSync('complex.out');
  });
});
