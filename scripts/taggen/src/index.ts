import {Command, flags} from '@oclif/command'
import { assert, exception } from 'console';
import * as fs from 'fs';
import * as t from 'proto-parser';
import { __classPrivateFieldSet } from 'tslib';


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

/* XXX: This is needed by the visualiser too, so it's exposed.  Is this
 * the best place to define it? */
interface Tag {
  name: string, /* The fully-qualified tag name. */
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
type Type = SimpleType | ArrayType | ReferenceType | Tag[]

function handleTagType(rawTag: any): Type {
  /* Compound type: check for the presence of fields, in which case the kind of
   * this type is a sequence of Tag fields. */
  if (rawTag.fields !== undefined) {
    const fieldNames = Object.entries(rawTag.fields)
    return fieldNames.map(([name, v], _) => {
      const field = (v as any);
      return {
        "name": name,
        "comment": (field.comment || field.options?.["(types.comment)"] || undefined) as string | undefined,
        "type": handleTagType(v)
      } as Tag
    })
  } else if (rawTag.type.syntaxType === "BaseType") {
    /* A simple primitive type. */
    return toSimpleType(rawTag.type.value)
  } else if (rawTag.type.syntaxType === "Identifier") {
    /* reference type */
    return rawTag.type.value as string
  }
  throw new Error(`Can't figure out type for ${rawTag}`)
}


/* Given a raw tag object, coerse the object to a well-typed, simplified one. */
function handleTag(rawTag: any): Tag {
  let name = rawTag.name as string | undefined;
  if (!name) {
    throw new Error(`Missing full name in ${rawTag}`)
  }

  let comment = rawTag.comment as string || rawTag.options?.["(types.comment)"] || undefined
  
  /* If there is a "type" field in the object, then it's a primitive
   * type of some sort.  Only one type need be returned. */
    return {
      "name": name,
      "comment": comment,
      "type": handleTagType(rawTag)
  }

}

/* Given a tag structure, emit in an array all the subtags of that tag.  Recurse
 * on any fields, terminating when we hit a primitive type of any sort.
 * Additonally, only refer to the name of the type, essentially turning
 * non-reference types into reference types.*/
function flattenTags(tag: Tag, tagTypes: Map<string, Tag>): Tag[] {
  if (Array.isArray(tag.type)) {
    /* Compound types: recurse on all the subtypes.  My kingdom for flatMap(). */
    let subtags: Tag[] = [];

    tag.type.forEach((type => {
      flattenTags(type, tagTypes).forEach((subtag) => {
        subtags.push({
          name: tag.name + "." + subtag.name,
          comment: type.comment,
          type: type.type
        });
      });
    }));

    return subtags;

  } else if (["string", "bool", "numeric"].includes(tag.type as SimpleType)) {
    /* Simple type */
    return [tag]
  } else {
    /* reference type */
    const type = tag.type as string;
    const refTag = tagTypes.get(type);
    if (refTag === undefined) {
      console.warn(`What even is a ${type}???`)
    } else {
      /* XXX: an annoying hack: when we walk the proto file, the Messages that
       * correspond to structure definitions have the _type_ as their "name".
       * Makes sense since it's a message definition, until we try to resolve an
       * _instance_ of that _type_.  In that case, the "name" field should refer
       * to the name of the tag that contains it. */
      refTag.name = tag.name;
      return flattenTags(refTag, tagTypes);
    }
  }
  /* TODO: ArrayType needs some thinking through since it's just an interface type. 
   * We don't have a visualization system for entire arrays anyways, though.  But,
   * maybe we just emit SomeTag[0], SomeTag[1], ... SomeTag[255]??? */
  return []
}


/* Tag definitions at the root of the tag tree.  Includes things like "ZW",
 * "SYSTEM", and "COM_AQUA_DATA_1". */
function extractMessageTypes(protoDocument: t.ProtoDocument): Map<string, any> {
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
    .reduce((map, [name, tag]) => {
      map.set(name, handleTag(tag))
     // console.log(JSON.stringify(tag, undefined, 2))
      //console.log(JSON.stringify(handleTag(tag), undefined, 2))
      return map;
    }, new Map<string, any>())
}


/* XXX: This might be redundant, as we can extract the fields from Value directly. */
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

  static args = [
  {
    name: 'file',
    required: true,
    description: 'The proto file to parse'
  },
  {
    name: 'outpath',
    required: true,
    description: 'The location to place the output JSON blobs'
  }]

  async run() {
    const { args } = this.parse(Taggen);
   
    const content = fs.readFileSync(args.file, 'utf-8');
    const protoDocument = t.parse(content) as t.ProtoDocument;

    /* The protobuf definition file describes all message types that can be sent
     * over the wire.  In terms of the values of interest, the "Value"
     * message is the only one of interest; however, there are Message
     * definitions for compound types like TIMER, which we need to expand the fields
     * of a TIMER value. */
    const msgTypes: Map<string, Tag> = extractMessageTypes(protoDocument);

    /* The tag roots are defined by the fields in the "Value" message structure.
     * These are all the fields that, as far as users of the PLC are concerned, 
     * can be sent over the wire. */
    //const tagRoot = extractRoots(protoDocument);
    const tagRoot = msgTypes.get("Value")?.["type"] as Tag[]


    /* Write out all the possible subtags.  This is used for typeahead. */
    const allSubtags = tagRoot.map((root) => {
      return flattenTags(root, msgTypes)
    }).reduce((acc, val) => acc.concat(val), []);
    fs.writeFileSync(args.outpath + "/tags.json", JSON.stringify(allSubtags, undefined, 2) + "\n")

  }
}

export = Taggen
