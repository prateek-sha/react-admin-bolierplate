import React, { useState } from 'react';
import { Table, Input, Form, Modal, Button, Select, Space, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { setSubMaster } from '../../elements/api/product';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSubMasteAction } from '../../redux/actions/allData';
import { responseHelper } from '../../lib/response';
import { unique } from '../../lib/array';
import { SearchableTable } from '../../lib/serach';


export const SubMasterPanel = () => {
	const [form] = Form.useForm();
	const [data, setData] = useState([]);
	const [visible, setVisible] = useState(false)
	const [isEdit, setIsEdit] = useState(false)
	const [selectedID, setSelectedID] = useState(null)

	const dispatch = useDispatch()
	const refresh = () => dispatch(setSubMasteAction());

	const allDataReducer = useSelector(state => state.allDataReducer)

	const getMainName = (parentID) => {
		if (allDataReducer.parent.length) {
			return allDataReducer.parent.filter(({ id }) => id === parentID)[0]['name'] || "Deleted";
		}
	}

	const getMasterName = (parentID) => {
		if (allDataReducer.master.length) {
			let data = allDataReducer.master.filter(({ id }) => id === parentID)[0];
			if (data)
				return { masterName: data['name'], parentName: getMainName(data['parentID']) }
			return { masterName: "Deleted", parentName: "Deleted" }
		}
	}

	useEffect(() => {
		if (allDataReducer.subMaster) {
			let res = allDataReducer.subMaster;
			res = res.map(data => { return { ...data, ...getMasterName(data.parentID) } })
			setData(res)
		}
	}, [allDataReducer.subMaster])

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			width: '15%',
			sorter: (a, b) => a.id - b.id,
			key: 'id'
		},
		{
			title: 'Name',
			dataIndex: 'name',
			width: '25%',
			key: 'name'
		},
		{
			title: 'Master Name',
			dataIndex: 'masterName',
			width: '25%',
			key: 'master',
			filters: data && unique(data, "masterName").map(data => { return { text: data, value: data } }),
			onFilter: (value, record) => record.masterName.indexOf(value) === 0,
		},
		{
			title: 'Main Category',
			dataIndex: 'parentName',
			width: '25%',
			key: 'master',
			filters: data && unique(data, "parentName").map(data => { return { text: data, value: data } }),
			onFilter: (value, record) => record.parentName.indexOf(value) === 0,
		},
		{
			title: 'Action',
			key: 'action',
			render: (data) => <Space>
				<Button type="primary" onClick={() => setSelectedID(data.id)}>Edit</Button>
				<Popconfirm title="Are you sure you want to delete this?" onConfirm={() => handleDelete(data.id)} >
					<Button type="primary" danger >Delete</Button>
				</Popconfirm>
			</Space>
		}
	];

	const handleDelete = async (id) => {
		let res = await setSubMaster({ id, action: "DELETE" });
		responseHelper(res, refresh)
	}

	useEffect(() => {
		if (selectedID !== null) {
			setVisible(true)
			setIsEdit(true)
			let formValue = data.filter(({ id }) => id === selectedID)[0]
			form.setFieldsValue({ ...formValue })
		}
	}, [selectedID])


	const handleOk = async ({ name, parentID, description }) => {
		if (isEdit) {
			let res = await setSubMaster({ name, parentID, description, id: selectedID, action: "UPDATE" })
			responseHelper(res, refresh)

		} else {
			let res = await setSubMaster({ name, parentID, description, action: "INSERT" })
			responseHelper(res, refresh)
		}
		onCancel()
	}

	const onCancel = () => {
		setIsEdit(false)
		setVisible(false)
		setSelectedID(null);
		form.resetFields()
	}

	return (
		<div>
			<Modal
				visible={visible}
				title={isEdit ? "Edit Sub Master" : "Add New Sub Master"}
				footer={null}
				onCancel={onCancel}
			>
				<Form form={form} layout="vertical" onFinish={handleOk}>
					<Form.Item label="Master Name" name="parentID" rules={[{ required: true, message: "This is required" }]} >
						<Select placeholder="Please Select ....">
							{allDataReducer.master.map(data => <Select.Option value={data.id} key={data.id} >
								{`${data.name} -- ${getMainName(data.parentID)}`}
							</Select.Option>)}
						</Select>
					</Form.Item>
					<Form.Item label="Sub-Master Name" name="name" rules={[{ required: true, message: "This is required" }]}>
						<Input />
					</Form.Item>
					<Form.Item label="Description" name="description" rules={[{ required: true, message: "This is required" }]}>
						<Input.TextArea />
					</Form.Item>
					<Button type="primary" htmlType="submit" >{isEdit ? "Edit" : "Save"}</Button>
				</Form>
			</Modal>
			<Button onClick={() => setVisible(true)} icon={<PlusOutlined />} type="primary" >Add</Button><br />
			<br />
			<SearchableTable
				id="subMaster"
				dataSource={data}
				columns={columns}
				rowClassName="editable-row"
			/>
		</div>
	);
};

