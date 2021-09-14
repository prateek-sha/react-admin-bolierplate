import React, { useEffect, useState } from "react";
import { Layout, Menu, Breadcrumb, Modal, Input, Button } from "antd";
import { SettingFilled, LogoutOutlined, UserOutlined } from "@ant-design/icons";

import { SideMenu } from "../components/sideMenu/SideMenu";
import { MenuContent } from "../components/menuContent/MenuContent";
import { useDispatch, useSelector } from "react-redux";
import { setFavouriteAction, setMasterAction, setOrderAction, setParentAction, setProducAction, setQuoteAction, setSubMasteAction, setUserAction } from "../redux/actions/allData";


import "./appController.css";
import { changePassAdmin } from "../elements/api/other";
import { responseHelper } from "../lib/response";
import { mangeLogin } from "../redux/actions/appStatus";
// import logo from "../assets/logo.jpg";

const { Header, Content } = Layout;

export const AppController = () => {
	const [collapsed, setcollapsed] = useState(false);
	const [breadCrumbs, setBreadCrumbs] = useState([])
	const [visible, setVisible] = useState(false);
	const [newPassword, setNewPassword] = useState('');

	const dispatch = useDispatch()

	const activeDashBoard = useSelector(state => state.dashboard.activeDashBoard)

	useEffect(() => {
		if (activeDashBoard !== "") {
			let res = [];
			if (activeDashBoard.includes('Page')) {
				res = [activeDashBoard.slice(0, -4)];
			} else {
				res = ["Product", activeDashBoard.slice(0, -5).replace(/([A-Z])/g, ' $1').trim()];
			}
			setBreadCrumbs(res)
		}
	}, [activeDashBoard])

	const initProductPanel = () => {
		dispatch(setParentAction())
		dispatch(setProducAction())
		dispatch(setMasterAction())
		dispatch(setSubMasteAction())
		dispatch(setUserAction())
		dispatch(setOrderAction())
		dispatch(setQuoteAction())
		dispatch(setFavouriteAction())
	}

	useEffect(() => initProductPanel(), [])

	const handleCancel = () => {
		setVisible(false);
		setNewPassword('')
	}

	const handleSave = () => {
		let res = changePassAdmin({ password: newPassword, username: 'admin' })
		responseHelper(res, handleCancel)
	}

	return (
		<Layout>
			<Header className="header">
				<div className="logo" >
					Furniture Boutiq
				</div>
				<Menu theme="dark" mode="horizontal" >
					<Menu.SubMenu key="1" icon={<SettingFilled />} title="Settings">
						<Menu.Item key="2" onClick={() => setVisible(true)} ><UserOutlined /> Change Password</Menu.Item>
						<Menu.Item key="3" onClick={()=>dispatch(mangeLogin(false))} ><LogoutOutlined /> LogOut</Menu.Item>
					</Menu.SubMenu>
				</Menu>
			</Header>
			<Layout>
				<SideMenu collapsed={collapsed} setcollapsed={setcollapsed} />
				<Layout className="site-layout" style={{ padding: '0 24px 24px' }}>
					<Breadcrumb style={{ marginLeft: '16px', marginTop:'16px' }}>
						{breadCrumbs.map((data, idx) => <Breadcrumb.Item key={idx}>{data}</Breadcrumb.Item>)}
					</Breadcrumb>
					<Content
						className="site-layout-background"
						style={{
							margin: "24px 16px",
							padding: 24,
							height: "100%",
							minHeight: 280
						}}
					>
						<Modal
							visible={visible}
							title="Change Password"
							onCancel={handleCancel}
							footer={null}
						>
							<label>New Password</label>
							<Input onChange={(e)=>setNewPassword(e.target.value)}  value={newPassword} />
							<br /> <br />
							<Button type="primary" onClick={handleSave} >Change</Button>
						</Modal>
						<MenuContent />
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
};
