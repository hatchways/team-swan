import React, { useState, useEffect } from 'react';
import { Button, Grid } from '@material-ui/core';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Code
} from '@material-ui/icons';
import {
  fontStyles,
  blockStyles,
  fontSizes,
  fontFamily
} from './config/constants';
import DropDownControl from './DropDownControl';
import AddImageControl from './AddImageControl';
import AddLinkControl from './AddLinkControl';

const EditorToolbar = ({
  toggleFontStyle,
  toggleFontSize,
  toggleFontFamily,
  toggleBlockStyle,
  addImage,
  addLink,
  editorState
}) => {
  const [fontStylesSelected, setFontStylesSelected] = useState(new Map());
  const [blockStylesSelected, setBlockStylesSelected] = useState('');
  const [fontSizeSelected, setFontSizeSelected] = useState('');
  const [fontFamilySelected, setFontFamilySelected] = useState('');

  useEffect(() => {
    const selection = editorState.getSelection();
    const inlineStyle = editorState.getCurrentInlineStyle();

    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    setFontStylesSelected(inlineStyle);

    setBlockStylesSelected(blockType);

    const selectedFontSizeProperty = Object.keys(fontSizes).find((property) =>
      inlineStyle.has(fontSizes[property].value)
    );
    setFontSizeSelected(
      selectedFontSizeProperty
        ? fontSizes[selectedFontSizeProperty].label
        : '12px'
    );

    const selectedFontFamilyProperty = Object.keys(
      fontFamily
    ).find((property) => inlineStyle.has(fontFamily[property].value));

    setFontFamilySelected(
      selectedFontFamilyProperty
        ? fontFamily[selectedFontFamilyProperty].label
        : 'Arial'
    );
  }, [editorState]);

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item>
        <DropDownControl
          value={fontSizeSelected}
          menuItems={Object.keys(fontSizes).map((property) => ({
            label: fontSizes[property].label,
            onMouseDownHandler: toggleFontSize.bind(
              this,
              fontSizes[property].value
            )
          }))}
        />
      </Grid>

      <Grid item>
        <DropDownControl
          value={fontFamilySelected}
          menuItems={Object.keys(fontFamily).map((property) => ({
            label: fontFamily[property].label,
            onMouseDownHandler: toggleFontFamily.bind(
              this,
              fontFamily[property].value
            )
          }))}
        />
      </Grid>

      <Grid item>
        <Button
          onMouseDown={toggleFontStyle.bind(this, fontStyles.bold)}
          variant="contained"
          color={
            fontStylesSelected.has(fontStyles.bold) ? 'primary' : 'secondary'
          }
        >
          <FormatBold />
        </Button>
      </Grid>

      <Grid item>
        <Button
          onMouseDown={toggleFontStyle.bind(this, fontStyles.italic)}
          variant="contained"
          color={
            fontStylesSelected.has(fontStyles.italic) ? 'primary' : 'secondary'
          }
        >
          <FormatItalic />
        </Button>
      </Grid>

      <Grid item>
        <Button
          onMouseDown={toggleFontStyle.bind(this, fontStyles.underline)}
          variant="contained"
          color={
            fontStylesSelected.has(fontStyles.underline)
              ? 'primary'
              : 'secondary'
          }
        >
          <FormatUnderlined />
        </Button>
      </Grid>

      <Grid item>
        <Button
          onMouseDown={toggleBlockStyle.bind(this, blockStyles.unorderedList)}
          variant="contained"
          color={
            blockStylesSelected === blockStyles.unorderedList
              ? 'primary'
              : 'secondary'
          }
        >
          <FormatListBulleted />
        </Button>
      </Grid>

      <Grid item>
        <Button
          onMouseDown={toggleBlockStyle.bind(this, blockStyles.orderedList)}
          variant="contained"
          color={
            blockStylesSelected === blockStyles.orderedList
              ? 'primary'
              : 'secondary'
          }
        >
          <FormatListNumbered />
        </Button>
      </Grid>

      <Grid item>
        <AddImageControl addImage={addImage} />
      </Grid>

      <Grid item>
        <AddLinkControl addLink={addLink} />
      </Grid>
    </Grid>
  );
};

export default EditorToolbar;
