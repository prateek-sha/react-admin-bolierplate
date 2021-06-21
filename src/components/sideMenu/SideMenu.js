import React, { useState, useEffect } from "react";
import { Layout, Menu, Drawer } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { setActiveDashboard } from "../../redux/actions/dashBoard";
import { useDispatch } from "react-redux";
import { menuLayout } from "../../elements/layout/AppControllerLayout";

import "./sideMenu.css";
const { Sider } = Layout;

export const SideMenu = props => {
  let { collapsed, setcollapsed } = props;
  const dispatch = useDispatch();
  const [activeDashboard, setactiveDashboard] = useState("");

  useEffect(() => {
    dispatch(setActiveDashboard(activeDashboard));
  }, [activeDashboard]);

  return (
    <Drawer 
      title="Menu"
      placement="left"
      closable={false}
      onClose={() => setcollapsed(!collapsed)}
      visible={collapsed}
    >
      <Sider theme="light" trigger={null}>
        <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
          {menuLayout.map(menuItem => (
            <Menu.Item
              key={menuItem.key}
              icon={<UserOutlined />}
              onClick={() => {
                setactiveDashboard(menuItem.view);
                setcollapsed(!collapsed);
              }}
            >
              {menuItem.title}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
    </Drawer>
  );
};
