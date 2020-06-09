import React from "react";
import Content from "./Content";
import Drawer from "common/Drawer";
import SideBarContent from "./SideBarContent";

const Campaign = () => {
  return (
    <Drawer
      LeftDrawerComponent={<SideBarContent />}
      RightDrawerComponent={<Content />}
    />
  );
};

export default Campaign;
