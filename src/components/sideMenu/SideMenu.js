import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
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
				theme="light"
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

		<Sider  width={200} className="site-layout-background" theme="light" trigger={null}>
			<Menu openKeys={['sub1']} theme="light" mode="inline">
				{menuLayout.map(menuItem =>
					menuItem.type !== "parent" ? getMenuItem(menuItem) :
						<SubMenu key={menuItem.key} icon={menuItem.icon} title={menuItem.title} >
							{menuItem.children.map(menuItem => getMenuItem(menuItem))}
						</SubMenu>
				)}
			</Menu>
		</Sider>
	);
};
