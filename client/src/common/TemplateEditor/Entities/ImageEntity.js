import React, { useState, useRef } from 'react';
import {
  Button,
  Popper,
  Paper,
  ClickAwayListener,
  makeStyles,
  Slider
} from '@material-ui/core';
import {
  FormatAlignCenter,
  FormatAlignLeft,
  FormatAlignRight,
  Delete
} from '@material-ui/icons';
import { SelectionState, Modifier, EditorState } from 'draft-js';

const useStyles = makeStyles((theme) => ({
  image: {
    '&:hover': {
      cursor: 'pointer'
    }
  },
  popper: {
    zIndex: theme.zIndex.modal
  }
}));

const ImageEntity = (props) => {
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const [forceRender, setForceRender] = useState(true); //Need to have force render since updating entity data does not cause to render

  const { image, popper } = useStyles();

  const entityKey = props.block.getEntityAt(0); //Get entity key
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
  const { src, width, alignment } = entity.getData();
  const type = entity.getType();

  const imageContainerAnchorRef = useRef();
  const imageRef = useRef();

  const PopperImage = (
    <Popper
      className={popper}
      open={isPopperOpen}
      anchorEl={imageContainerAnchorRef.current}
      role={undefined}
      placement="top-center"
    >
      <ClickAwayListener
        mouseEvent="onMouseDown"
        onClickAway={(e) => {
          if (e.currentTarget !== imageRef.current) {
            setIsPopperOpen(false);
          }
        }}
      >
        <Paper style={{ padding: '10px' }}>
          <Button
            onMouseDown={(e) => {
              e.preventDefault();
              props.contentState.mergeEntityData(entityKey, {
                ...entity.getData(),
                alignment: 'left'
              });
              setForceRender(!forceRender);
            }}
          >
            <FormatAlignLeft />
          </Button>
          <Button
            onMouseDown={(e) => {
              e.preventDefault();
              props.contentState.mergeEntityData(entityKey, {
                ...entity.getData(),
                alignment: 'center'
              });
              setForceRender(!forceRender);
            }}
          >
            <FormatAlignCenter />
          </Button>
          <Button
            onMouseDown={(e) => {
              e.preventDefault();
              props.contentState.mergeEntityData(entityKey, {
                ...entity.getData(),
                alignment: 'right'
              });
              setForceRender(!forceRender);
            }}
          >
            <FormatAlignRight />
          </Button>
          <Button
            onMouseDown={(e) => {
              const selectionState = new SelectionState({
                anchorKey: props.block.getKey(),
                anchorOffset: 0,
                focusKey: props.block.getKey(),
                focusOffset: props.block.getText().length
              });

              let newContentState = Modifier.removeRange(
                props.contentState,
                selectionState,
                'backward'
              );

              newContentState = Modifier.setBlockType(
                newContentState,
                newContentState.getSelectionAfter(),
                'unstyled'
              );

              props.blockProps.setEditorState(
                EditorState.push(
                  props.blockProps.editorState,
                  newContentState,
                  'remove-range'
                )
              );
            }}
          >
            <Delete />
          </Button>
          <Slider
            value={width}
            aria-labelledby="continuous-slider"
            max={100}
            min={30}
            onChange={(event, newValue) => {
              event.preventDefault();
              props.contentState.mergeEntityData(entityKey, {
                ...entity.getData(),
                width: newValue
              });
              setForceRender(!forceRender);
            }}
          />
        </Paper>
      </ClickAwayListener>
    </Popper>
  );

  let media = null;

  if (type === 'IMAGE') {
    media = (
      <div style={{ textAlign: alignment }} ref={imageContainerAnchorRef}>
        <img
          ref={imageRef}
          onClick={(e) => {
            setIsPopperOpen(true);
          }}
          className={image}
          src={src}
          width={`${width}%`}
        />
        {PopperImage}
      </div>
    );
  }

  return media;
};

export default ImageEntity;
