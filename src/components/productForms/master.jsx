import React, { useState } from 'react';
import { Table, Input, Form, Modal, Button, Select, Space, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { setMaster } from '../../elements/api/product';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMasterAction } from '../../redux/actions/allData';
import { responseHelper } from '../../lib/response';
import { unique } from '../../lib/array';
import { SearchableTable } from '../../lib/serach';


export const MasterPanel = () => {
	const [form] = Form.useForm();
	const [data, setData] = useState([]);
	const [visible, setVisible] = useState(false)
	const [isEdit, setIsEdit] = useState(false)
	const [selectedID, setSelectedID] = useState(null)

	const dispatch = useDispatch()
	const refresh = () => dispatch(setMasterAction())

	const allDataReducer = useSelector(state => state.allDataReducer)

	const getParentName = (parentID) => {
		if (allDataReducer.parent.length) {
			return allDataReducer.parent.filter(({ id }) => id === parentID)[0]['name'];
		}
	}

	useEffect(() => {
		if (allDataReducer.master) {
			let res = allDataReducer.master;
			res = res.map(data => { return { ...data, parentName: getParentName(data.parentID) } })
			setData(res)
		}
	}, [allDataReducer.master])

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			sorter: (a, b) => a.id - b.id,
			key: 'id',
			width: '15%',
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			width: '25%',
		},
		{
			title: 'Category Name',
			dataIndex: 'parentName',
			key: 'parent',
			width: '25%',
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
		let res = await setMaster({ id, action: "DELETE" });
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


	const handleOk = async ({ name, parentID, sectionOrder }) => {
		if (isEdit) {
			let res = await setMaster({ name, parentID, sectionOrder, id: selectedID, action: "UPDATE" })
			responseHelper(res, refresh)
		} else {
			let res = await setMaster({ name, parentID, sectionOrder, action: "INSERT" })
			responseHelper(res, refresh)
		}
		onCancel()
	}

	const onCancel = () => {
		setVisible(false)
		setSelectedID(null)
		form.resetFields();
		setIsEdit(false);
	}




	return (
		<div>
			<Modal
				visible={visible}
				title={isEdit ? "Edit Master" : "Add New Master"}
				footer={null}
				onCancel={onCancel}
			>
				<Form form={form} layout="vertical" onFinish={handleOk}>
					<Form.Item rules={[{ required: true, message: "This is required" }]} label="Category Name" name="parentID">
						<Select placeholder="Please Select ....">
							{allDataReducer.parent.map(data => <Select.Option value={data.id} key={data.id} >{data.name}</Select.Option>)}
						</Select>
					</Form.Item>
					<Form.Item rules={[{ required: true, message: "This is required" }]} label="Section Order" name="sectionOrder">
						<Select placeholder="Please Select ....">
							<Select.Option value="1" >1</Select.Option>
							<Select.Option value="2" >2</Select.Option>
							<Select.Option value="3" >3</Select.Option>
							<Select.Option value="4" >4</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item rules={[{ required: true, message: "This is required" }]} label="Master Name" name="name">
						<Input />
					</Form.Item>
					<Button type="primary" htmlType="submit" >{isEdit ? "Edit" : "Save"}</Button>
				</Form>
			</Modal>
			<Button onClick={() => setVisible(true)} icon={<PlusOutlined />} type="primary" >Add</Button><br />
			<br />
			<SearchableTable
				id="master"
				dataSource={data}
				columns={columns}
				rowClassName="editable-row"
			/>

		</div>
	);
};

