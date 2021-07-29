import {Command, flags} from '@oclif/command'
import { assert, exception } from 'console';
import * as fs from 'fs';
import * as t from 'proto-parser';


enum SimpleType {
  Numeric = "numeric",
  Bool = "bool",
  String = "string"
}

function toSimpleType(s: string): SimpleType {
  switch (s) {
    case "string":
      return SimpleType.String

    case "bool":
      return SimpleType.Bool

    case "sfixed32":
    case "fsixed64":
    case "fixed32":
    case "fixed64":
    case "int32":
    case "sint32":
    case "int64":
    case "sint64":
    case "float":
      return SimpleType.Numeric

    default:
      throw new Error(`Unknown simple type ${s}`)
  }
}

interface Tag {
  name: string[], /* The fully-qualified tag name, tokenised */
  comment?: string,
  type: Type
}

interface ArrayType {
  base: Type,
  dimensions: number
}

type ReferenceType = string

/* The type of a tag can be one of these "kinds" of things:
 * a primitive type 
 * an array type
 * a reference to a predefined type
 * or a structured type with one or more fields. */
type Kind = SimpleType | ArrayType | ReferenceType | Tag[]
interface Type {
  typeName: string,
  kind: Kind
}

function handleTagType(rawTag: any): Type {
  let kind: Kind;

  /* Compound type: check for the presence of fields, in which case the kind of
   * this type is a sequence of Tag fields. */
  if (rawTag.fields !== undefined) {
    const fieldNames = Object.entries(rawTag.fields)
    kind = fieldNames.map(([k, v], _) => {
      const field = (v as any);
      return {
        "name": field.fullName.split(".").slice(2),
        "comment": (field.comment || field.options?.["(types.comment)"] || "") as string,
        "type": handleTagType(v)
      } as Tag
    })
  } else if (rawTag.type.syntaxType === "BaseType") {
    /* A simple primitive type. */
    kind = toSimpleType(rawTag.type.value)
  } else if (rawTag.type.syntaxType === "Identifier") {
    /* reference type */
    kind = rawTag.type.value as string
  } else {
    throw new Error(`Can't figure out type for ${rawTag}`)
  }
  return {
    "typeName": rawTag.name,
    "kind": kind
  }
}


/* Given a raw tag object, coerse the object to a well-typed, simplified one. */
function handleTag(rawTag: any): Tag {
  let name = rawTag.fullName as string | undefined;
  if (!name) {
    throw new Error(`Misisng full name in ${rawTag}`)
  }

  let typeName = rawTag.name as string | undefined;
  if (!typeName) {
    throw new Error(`Missing name in ${rawTag}`)
  }

  let comment = rawTag.comment as string || rawTag.options?.["(types.comment)"] || ""
  
  /* If there is a "type" field in the object, then it's a primitive
   * type of some sort.  Only one type need be returned. */
    return {
      "name": name.split(".").slice(2),
      "comment": comment,
      "type": handleTagType(rawTag)
  }

}

/* Tags at the root of the tag tree.  Includes things like "ZW", "SYSTEM", and
 * "COM_AQUA_DATA_1". */
function extractTypes(protoDocument: t.ProtoDocument): Map<String, any> {
  let root = protoDocument.root.nested
  if (root === undefined) {
    throw new Error("Error getting the document root")
  }

  /* Drop the type as proto-parser's proto Record type doesn't appear
   * to expose `oneofs` for variants. */
  let types = root.types.nested as Map<string, any> | undefined;
  if (types === undefined) {
    throw new Error("Error getting the document's `types` field")
  }

  return Object.entries(types)
    .filter(([_, value]) => value.syntaxType === "MessageDefinition")
    .reduce((map, [key, value]) => {
      map.set(key, value)
      return map;
    }, new Map<String, any>())
}

function extractRoots(protoDocument: t.ProtoDocument): string[] {
  let root = protoDocument.root.nested
  if (root === undefined) {
    throw new Error("Error getting the document root")
  }

  /* Drop the type as proto-parser's proto Record type doesn't appear
   * to expose `oneofs` for variants. */
  let types = root.types.nested as any;
  if (types === undefined) {
    throw new Error("Error getting the document's `types` field")
  }
  let values = types.Value.oneofs.value.oneof;
  if (values === undefined) {
    throw new Error("Error getting the document's `Value` field")
  }

  return values;
}

class Taggen extends Command {
  static description = 'Generates fully-qualified tags from a proto file.'

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
  }

  static args = [{
    name: 'file',
    required: true,
    description: 'The proto file to parse'
  }]

  async run() {
    const { args } = this.parse(Taggen);
   
    const content = fs.readFileSync(args.file, 'utf-8');
    const protoDocument = t.parse(content) as t.ProtoDocument;

    const types = extractTypes(protoDocument);
    const rootTags = extractRoots(protoDocument);

    let acc: Tag[] = []
    types.forEach((root) => {
      acc = acc.concat(handleTag(root))
    });

    console.log(JSON.stringify(acc, undefined, 2));
  }
}

export = Taggen
