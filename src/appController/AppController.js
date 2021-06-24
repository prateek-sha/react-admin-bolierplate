import React, { useEffect, useState } from "react";
import { Layout, Image } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

import "./appController.css";
import { SideMenu } from "../components/sideMenu/SideMenu";
import { MenuContent } from "../components/menuContent/MenuContent";
import { useDispatch } from "react-redux";
import { setMasteAction, setParentAction, setProducAction, setSubMasteAction } from "../redux/actions/product";


// import logo from "../assets/logo.jpg";

const { Header, Content } = Layout;

export const AppController = () => {
	const [collapsed, setcollapsed] = useState(false);
	const dispatch = useDispatch()

	const toggle = () => {
		setcollapsed(!collapsed);
	};

	const initProductPanel = () => {
		dispatch(setParentAction())
		dispatch(setProducAction())
		dispatch(setMasteAction())
		dispatch(setSubMasteAction())
	}

	useEffect(()=>initProductPanel(),[])

	return (
		<Layout>
			<SideMenu collapsed={collapsed} setcollapsed={setcollapsed} />
			<Layout className="site-layout">
				<Header className="site-layout-background" style={{ paddingLeft: 20 }}>
					{React.createElement(
						collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
						{
							id: "trigger",
							onClick: toggle
						}
					)}
					<div id="logo-wrapper">
						<Image preview={false} id="menu-logo" width={80} src={"logo"} />
					</div>
				</Header>
				<Content
					className="site-layout-background"
					style={{
						margin: "24px 16px",
						padding: 24,
						height: "100%",
						minHeight: 280
					}}
				>
					<MenuContent />
				</Content>
			</Layout>
		</Layout>
	);
};
