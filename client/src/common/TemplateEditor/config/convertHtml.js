import React from "react";
import {
  convertToHTML as toHtml,
  convertFromHTML as fromHtml,
} from "draft-convert";
import { fontStyles, fontSizes, fontFamily } from "./constants";

export const convertToHtml = (contentState) => {
  const getHtml = toHtml({
    styleToHTML: (style, currentText) => {
      let cssStyle = {};

      if (style === fontStyles.bold) {
        cssStyle.fontWeight = fontStyles.bold;
      } else if (style === fontStyles.italic) {
        cssStyle.fontStyle = fontStyles.italic;
      } else if (style === fontStyles.underline) {
        cssStyle.textDecoration = fontStyles.underline;
      } else if (style === fontSizes.font12px.value) {
        cssStyle.fontSize = "12px";
      } else if (style === fontSizes.font20px.value) {
        cssStyle.fontSize = "20px";
      } else if (style === fontSizes.font40px.value) {
        cssStyle.fontSize = "40px";
      } else if (style === fontFamily.arial.value) {
        cssStyle.fontFamily = "Arial";
      } else if (style === fontFamily.courier.value) {
        cssStyle.fontFamily = "Courier";
      } else if (style === fontFamily.comicsans.value) {
        cssStyle.fontFamily = "Comic Sans MS";
      }

      return <span style={cssStyle}>{currentText}</span>;
    },
    blockToHTML: (block) => {
      const contentBlock = contentState.getBlockForKey(block.key);
      if (contentBlock.getType() === "atomic") {
        const entityKey = contentBlock.getEntityAt(0);
        const entity = contentState.getEntity(entityKey);
        const { alignment, src, width } = entity.getData();
        return (
          <figure style={{ textAlign: alignment }}>
            <img
              data-textAlign={alignment}
              data-width={width}
              src={src}
              style={{ width: `${width}%` }}
            />
          </figure>
        );
      }
    },
    entityToHTML: (entity, originalText) => {
      if (entity.type === "LINK") {
        return <a href={entity.data.href}>{originalText}</a>;
      }
      return originalText;
    },
  });

  return getHtml(contentState);
};

export const convertFromHtml = (html) => {
  const getContentState = fromHtml({
    htmlToStyle: (nodeName, node, currentStyle) => {
      console.log(node.style.fontFamily);
      if (node.style.fontFamily === "Arial") {
        return currentStyle.add(fontFamily.arial.value);
      } else if (node.style.fontFamily === "Courier") {
        return currentStyle.add(fontFamily.courier.value);
      } else if (node.style.fontFamily === '"Comic Sans MS"') {
        return currentStyle.add(fontFamily.comicsans.value);
      } else if (node.style.fontSize === "12px") {
        return currentStyle.add(fontSizes.font12px.value);
      } else if (node.style.fontSize === "20px") {
        return currentStyle.add(fontSizes.font20px.value);
      } else if (node.style.fontSize === "40px") {
        return currentStyle.add(fontSizes.font40px.value);
      } else {
        return currentStyle;
      }
    },
  });

  return getContentState(html);
};
