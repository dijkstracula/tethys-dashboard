#!/bin/bash

# Generates Typescript source from tethys-dashboard's proto files.
# Adapted from https://github.com/improbable-eng/ts-protoc-gen/README.md .
#
# author: taylorn5
set -e

normalise() {
    python -c "import os,sys; print(os.path.abspath(sys.argv[1]))" $1
}

DASHBOARD_ROOT="$(normalise $(dirname $BASH_SOURCE)/..)"

PROTOC_GEN_TS_PATH="$DASHBOARD_ROOT/node_modules/.bin/protoc-gen-ts"

# Overridable parameters:
TETHYS_BRIDGE_PATH=${TETHYS_BRIDGE_PATH:-"$DASHBOARD_ROOT/../tethys-plc-bridge"}
TETHYS_BRIDGE_PATH="$(normalise ${TETHYS_BRIDGE_PATH})"
TETHYS_PROTO_NAME=${TETHYS_PROTO_NAME:-drayton-plant.proto}


###########################################################

# Ensure all our special bit are in the right place.
which protoc > /dev/null
if [[ $? -ne 0 ]]
then
    echo "protoc not in your PATH."
    exit 1
fi

which $PROTOC_GEN_TS_PATH > /dev/null
if [[ $? -ne 0 ]]
then
    echo "protoc-gen-ts not in your dashboard's node_modules/ directory."
    exit 1
fi


if [[ ! -d $TETHYS_BRIDGE_PATH ]]
then
    echo "No directory found at $TETHYS_BRIDGE_PATH ; exiting."
    exit 1
fi

PROTO_PATH="$TETHYS_BRIDGE_PATH/res"

if [[ ! -e "$PROTO_PATH/$TETHYS_PROTO_NAME" ]]
then
    echo "No file found at $PROTO_PATH ; exiting."
    exit 1
fi

OUTDIR="$DASHBOARD_ROOT/src/proto/"
if [[ ! -d $OUTDIR ]]
then
    echo "- Creating Proto storage directory at ${OUTDIR}..."
    mkdir -p $OUTDIR
fi

PROTO_FILE="${PROTO_PATH}/${TETHYS_PROTO_NAME}"
echo "- Generating TypeScript Proto definitions from ${PROTOC_GEN_TS_PATH} -> ${PROTO_FILE} ..."

protoc \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --js_out="import_style=commonjs,binary:${OUTDIR}" \
    --ts_out="service=grpc-web:${OUTDIR}" \
    --proto_path="$PROTO_PATH" \
    $TETHYS_PROTO_NAME

OUTDIR="$DASHBOARD_ROOT/src/"
echo "- Generating JSON tag list from ${PROTO_FILE} -> ${OUTDIR}"
./scripts/taggen/bin/run ${PROTO_FILE} ${OUTDIR} 

echo "- All done!"
