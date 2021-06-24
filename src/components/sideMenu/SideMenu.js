import React, { useState, useEffect } from "react";
import { Layout, Menu, Drawer } from "antd";
import { setActiveDashboard } from "../../redux/actions/dashBoard";
import { useDispatch } from "react-redux";
import { menuLayout } from "../../elements/layout/AppControllerLayout";

import "./sideMenu.css";
const { Sider } = Layout;
const { SubMenu } = Menu;

export const SideMenu = props => {
	let { collapsed, setcollapsed } = props;
	const dispatch = useDispatch();
	const [activeDashboard, setactiveDashboard] = useState("");

	useEffect(() => {
		dispatch(setActiveDashboard(activeDashboard));
	}, [activeDashboard]);

	const getMenuItem = (menuItem) => {
		return (
			<Menu.Item
				className="sidebar-menu-bg"
				theme="dark"
				key={menuItem.key}
				icon={menuItem.icon}
				onClick={() => {
					setactiveDashboard(menuItem.view)
					setcollapsed(!collapsed);
				}}
			>
				{menuItem.title}
			</Menu.Item>
		)
	}

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
					{menuLayout.map(menuItem =>
						menuItem.type !== "parent" ? getMenuItem(menuItem) :
						<SubMenu key={menuItem.key} icon={menuItem.icon} title={menuItem.title} >
							{menuItem.children.map(menuItem => getMenuItem(menuItem))}
						</SubMenu>
					)}
				</Menu>
			</Sider>
		</Drawer>
	);
};
