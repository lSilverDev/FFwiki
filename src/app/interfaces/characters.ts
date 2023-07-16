export interface Character {
  id:           string;
  name:         string;
  japaneseName: null | string;
  age:          string;
  gender:       Gender;
  race:         string;
  job:          string;
  height:       null | string;
  weight:       string;
  origin:       Origin;
  description:  null | string;
  pictures:     Picture[];
  stats:        Stat[];
}

export enum Gender {
  Androgynous = "Androgynous",
  Empty = "??",
  Female = "Female",
  Male = "Male",
}

export enum Origin {
  FinalFantasy = "Final Fantasy",
  FinalFantasyBE = "Final Fantasy BE",
  FinalFantasyII = "Final Fantasy II",
  FinalFantasyIII = "Final Fantasy III",
  FinalFantasyIV = "Final Fantasy IV",
  FinalFantasyIX = "Final Fantasy IX",
  FinalFantasyV = "Final Fantasy V",
  FinalFantasyVI = "Final Fantasy VI",
  FinalFantasyVII = "Final Fantasy VII",
  FinalFantasyVIII = "Final Fantasy VIII",
  FinalFantasyX = "Final Fantasy X",
  FinalFantasyX2 = "Final Fantasy X-2",
  FinalFantasyXII = "Final Fantasy XII",
  FinalFantasyXIII = "Final Fantasy XIII",
  FinalFantasyXIII2 = "Final Fantasy XIII-2",
  FinalFantasyXV = "Final Fantasy XV",
}

export interface Picture {
  id:           string;
  url:          string;
  primary:      number;
  collectionId: string;
}

export interface Stat {
  id:           string;
  platform:     string;
  level:        number;
  class:        string;
  hitPoints:    number;
  manaPoints:   number;
  attack:       number;
  defense:      number;
  magic:        number;
  magicDefense: number;
  agility:      number;
  spirit:       number;
  collectionId: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toCharacter(json: string): Character[] {
      return cast(JSON.parse(json), a(r("Character")));
  }

  public static characterToJson(value: Character[]): string {
      return JSON.stringify(uncast(value, a(r("Character"))), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : '';
  const keyText = key ? ` for key "${key}"` : '';
  throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
      if (typ.length === 2 && typ[0] === undefined) {
          return `an optional ${prettyTypeName(typ[1])}`;
      } else {
          return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
      }
  } else if (typeof typ === "object" && typ.literal !== undefined) {
      return typ.literal;
  } else {
      return typeof typ;
  }
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
      const map: any = {};
      typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
      typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
      const map: any = {};
      typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
      typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
      if (typeof typ === typeof val) return val;
      return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs: any[], val: any): any {
      // val must validate against one typ in typs
      const l = typs.length;
      for (let i = 0; i < l; i++) {
          const typ = typs[i];
          try {
              return transform(val, typ, getProps);
          } catch (_) {}
      }
      return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
      if (cases.indexOf(val) !== -1) return val;
      return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
  }

  function transformArray(typ: any, val: any): any {
      // val must be an array with no invalid elements
      if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
      return val.map(el => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
      if (val === null) {
          return null;
      }
      const d = new Date(val);
      if (isNaN(d.valueOf())) {
          return invalidValue(l("Date"), val, key, parent);
      }
      return d;
  }

  function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
      if (val === null || typeof val !== "object" || Array.isArray(val)) {
          return invalidValue(l(ref || "object"), val, key, parent);
      }
      const result: any = {};
      Object.getOwnPropertyNames(props).forEach(key => {
          const prop = props[key];
          const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
          result[prop.key] = transform(v, prop.typ, getProps, key, ref);
      });
      Object.getOwnPropertyNames(val).forEach(key => {
          if (!Object.prototype.hasOwnProperty.call(props, key)) {
              result[key] = transform(val[key], additional, getProps, key, ref);
          }
      });
      return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
      if (val === null) return val;
      return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === "object" && typ.ref !== undefined) {
      ref = typ.ref;
      typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
      return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
          : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
          : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
  return { literal: typ };
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  "Character": o([
      { json: "id", js: "id", typ: "" },
      { json: "name", js: "name", typ: "" },
      { json: "japaneseName", js: "japaneseName", typ: u(null, "") },
      { json: "age", js: "age", typ: "" },
      { json: "gender", js: "gender", typ: r("Gender") },
      { json: "race", js: "race", typ: "" },
      { json: "job", js: "job", typ: "" },
      { json: "height", js: "height", typ: u(null, "") },
      { json: "weight", js: "weight", typ: "" },
      { json: "origin", js: "origin", typ: r("Origin") },
      { json: "description", js: "description", typ: u(null, "") },
      { json: "pictures", js: "pictures", typ: a(r("Picture")) },
      { json: "stats", js: "stats", typ: a(r("Stat")) },
  ], false),
  "Picture": o([
      { json: "id", js: "id", typ: "" },
      { json: "url", js: "url", typ: "" },
      { json: "primary", js: "primary", typ: 0 },
      { json: "collectionId", js: "collectionId", typ: "" },
  ], false),
  "Stat": o([
      { json: "id", js: "id", typ: "" },
      { json: "platform", js: "platform", typ: "" },
      { json: "level", js: "level", typ: 0 },
      { json: "class", js: "class", typ: "" },
      { json: "hitPoints", js: "hitPoints", typ: 0 },
      { json: "manaPoints", js: "manaPoints", typ: 0 },
      { json: "attack", js: "attack", typ: 0 },
      { json: "defense", js: "defense", typ: 0 },
      { json: "magic", js: "magic", typ: 0 },
      { json: "magicDefense", js: "magicDefense", typ: 0 },
      { json: "agility", js: "agility", typ: 0 },
      { json: "spirit", js: "spirit", typ: 0 },
      { json: "collectionId", js: "collectionId", typ: "" },
  ], false),
  "Gender": [
      "Androgynous",
      "??",
      "Female",
      "Male",
  ],
  "Origin": [
      "Final Fantasy",
      "Final Fantasy BE",
      "Final Fantasy II",
      "Final Fantasy III",
      "Final Fantasy IV",
      "Final Fantasy IX",
      "Final Fantasy V",
      "Final Fantasy VI",
      "Final Fantasy VII",
      "Final Fantasy VIII",
      "Final Fantasy X",
      "Final Fantasy X-2",
      "Final Fantasy XII",
      "Final Fantasy XIII",
      "Final Fantasy XIII-2",
      "Final Fantasy XV",
  ],
};
