import { CompositeDecorator, Entity } from 'draft-js';
import LinkEntity from 'common/TemplateEditor/Entities/LinkEntity';

const getDecorator = () => {
  function findLinkEntities(contentBlock, callback) {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      return entityKey !== null && Entity.get(entityKey).getType() === 'LINK';
    }, callback);
  }

  return new CompositeDecorator([
    { strategy: findLinkEntities, component: LinkEntity }
  ]);
};

export default getDecorator;
