import ImageEntity from 'common/TemplateEditor/Entities/ImageEntity';

const getMediaBlockRenderer = (editorState, setEditorState) => {
  return (block) => {
    if (block.getType() === 'atomic') {
      return {
        component: ImageEntity,
        editable: false,
        props: {
          editorState: editorState,
          setEditorState: setEditorState
        }
      };
    }
  };
};

export default getMediaBlockRenderer;
