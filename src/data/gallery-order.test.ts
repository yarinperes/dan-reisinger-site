import { describe, test } from "node:test";
import { deepStrictEqual, strictEqual } from "node:assert";
import { galleryOrder } from "./gallery-order";

describe("numbered archive gallery", () => {
  test("follows numeric filename order across numbering gaps", () => {
    deepStrictEqual(galleryOrder.map((print) => print.number), [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
      41, 42, 43, 44, 45, 46, 47,
      51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65,
    ]);
  });

  test("retains original print identities when changing display positions", () => {
    deepStrictEqual(galleryOrder.map((print) => print.id), [
      "p47", "p17", "p37", "p35", "p4", "p46", "p19", "p32", "p33", "p39",
      "p40", "p11", "p15", "p45", "p2", "p3", "p22", "p44", "p18", "p43",
      "p38", "p16", "p21", "p5", "p6", "p34", "p31", "p50", "p48", "p42",
      "p1", "p20", "p23", "p41", "p49", "p36", "p51", "p14", "p12", "p8",
      "p24", "p10", "p29", "p7", "p28", "p27", "p25", "p13", "p52", "p9",
      "p53", "p26",
    ]);
    strictEqual(new Set(galleryOrder.map((print) => print.id)).size, 52);
  });
});