import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef
} from 'react';
import { makeStyles } from '@material-ui/core';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  Modifier,
  AtomicBlockUtils,
  SelectionState
} from 'draft-js';
import EditorToolbar from './EditorToolbar';
import { fontStyles, fontSizes, fontFamily } from './config/constants';
import getDecorator from './config/getDecorator';
import getMediaBlockRenderer from './config/getMediaBlockRenderer';
import customInlineStyle from './config/customInlineStyles';
import 'draft-js/dist/Draft.css';

const useStyles = makeStyles({
  editorContainer: {
    height: '350px',
    maxWidth: '770px',
    overflow: 'auto',
    '&:hover': {
      cursor: 'text'
    }
  }
});

const TemplateEditor = ({ rawContent }, ref) => {
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty(getDecorator())
  );

  const { editorContainer } = useStyles();
  const editorContainerRef = useRef();

  useEffect(() => {
    if (rawContent) {
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(rawContent),
          getDecorator()
        )
      );
    }
  }, [rawContent]);

  useImperativeHandle(ref, () => ({
    getRawContent
  }));

  const getRawContent = () => {
    return convertToRaw(editorState.getCurrentContent());
  };

  //Set focus to the last text
  const setFocus = () => {
    const blockMap = editorState.getCurrentContent().getBlockMap();

    const key = blockMap.last().getKey();
    const length = blockMap.last().getLength();

    const newSelectionState = new SelectionState({
      anchorKey: key,
      anchorOffset: length,
      focusKey: key,
      focusOffset: length
    });

    updateEditor(EditorState.forceSelection(editorState, newSelectionState));
  };

  const toggleFontStyle = (fontStyle, e) => {
    e.preventDefault();
    updateEditor(RichUtils.toggleInlineStyle(editorState, fontStyle));
  };

  const toggleFontSize = (newFontSize) => {
    let newEditorState = editorState;

    //Toggling off other font sizes
    Object.keys(fontSizes).forEach((fontSize) => {
      if (newEditorState.getCurrentInlineStyle().has(fontSize)) {
        newEditorState = RichUtils.toggleInlineStyle(newEditorState, fontSize);
      }
    });

    updateEditor(RichUtils.toggleInlineStyle(newEditorState, newFontSize));
  };

  const toggleFontFamily = (newFontFamily) => {
    let newEditorState = editorState;

    //Toggling off other font family
    Object.keys(fontFamily).forEach((fontSize) => {
      if (newEditorState.getCurrentInlineStyle().has(fontSize)) {
        newEditorState = RichUtils.toggleInlineStyle(newEditorState, fontSize);
      }
    });

    updateEditor(RichUtils.toggleInlineStyle(newEditorState, newFontFamily));
  };

  const toggleBlockStyle = (newBlockStyle, e) => {
    e.preventDefault();
    updateEditor(RichUtils.toggleBlockType(editorState, newBlockStyle));
  };

  const addImage = (url) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'IMAGE',
      'IMUTABLE',
      {
        src: url,
        width: 30,
        alignment: 'left'
      }
    );

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    let newEditorState = EditorState.set(
      editorState,
      { currentContent: contentStateWithEntity },
      'create-entity'
    );

    updateEditor(
      AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
    );
  };

  const addLink = (label, url) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'IMUTABLE',
      {
        href: url
      }
    );

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const contentStateWithImage = Modifier.insertText(
      contentStateWithEntity,
      editorState.getSelection(),
      label,
      editorState.getCurrentInlineStyle(),
      entityKey
    );

    updateEditor(
      EditorState.push(editorState, contentStateWithImage, 'insert-characters')
    );
  };

  const updateEditor = (editorState) => {
    let newEditorState = editorState;
    let inlineStyles = newEditorState.getCurrentInlineStyle();

    //Select default font family
    const selectedFontFamilyProperty = Object.keys(
      fontFamily
    ).find((property) => inlineStyles.has(fontFamily[property].value));

    if (!selectedFontFamilyProperty) {
      newEditorState = RichUtils.toggleInlineStyle(newEditorState, 'ARIAL');
    }

    const selectedFontSizeProperty = Object.keys(fontSizes).find((property) =>
      inlineStyles.has(fontSizes[property].value)
    );

    //Select default font size
    if (!selectedFontSizeProperty) {
      newEditorState = RichUtils.toggleInlineStyle(newEditorState, 'FONT12PX');
    }

    setEditorState(newEditorState);
  };

  return (
    <>
      <div
        className={editorContainer}
        ref={editorContainerRef}
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            setFocus();
          }
        }}
      >
        <Editor
          customStyleMap={customInlineStyle}
          blockRendererFn={getMediaBlockRenderer(editorState, setEditorState)}
          editorState={editorState}
          onChange={updateEditor}
        />
      </div>
      <EditorToolbar
        toggleFontStyle={toggleFontStyle}
        toggleFontFamily={toggleFontFamily}
        toggleFontSize={toggleFontSize}
        toggleBlockStyle={toggleBlockStyle}
        addImage={addImage}
        addLink={addLink}
        editorState={editorState}
      />
    </>
  );
};

export default forwardRef(TemplateEditor);
