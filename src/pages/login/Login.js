import { Form, Input, Button, Image, message } from "antd";
import { useDispatch } from "react-redux";
import { login } from "../../elements/api/other";
import { mangeLogin } from "../../redux/actions/appStatus";
import logo from "../../logo.png";
import "./Login.css";

const layout = {
	labelCol: {
		span: 8
	},
	wrapperCol: {
		span: 16
	}
};
const tailLayout = {
	wrapperCol: {
		offset: 8,
		span: 16
	}
};

export const Login = () => {

	const dispatch = useDispatch();
	
	const onFinish = async ({ username, password }) => {
		let res = await login({ username, password })
		if (res.status === "1") {
			dispatch(mangeLogin(true));
		} else {
			message.error("username and password is not correct");
		}
	};

	const onFinishFailed = errorInfo => {
		console.log("Failed:", errorInfo);
	};

	return (
		<div className="wrapper">
			<Image preview={false} width={200} src={logo} />

			<Form
				{...layout}
				name="login"
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
			>
				<Form.Item
					label="Username"
					name="username"
					rules={[
						{
							required: true,
							message: "Please input your username!"
						}
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Password"
					name="password"
					rules={[
						{
							required: true,
							message: "Please input your password!"
						}
					]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item {...tailLayout}>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};
