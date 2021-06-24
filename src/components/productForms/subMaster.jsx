import React, { useState } from 'react';
import { Table, Input, Form, Modal, Button, Select, Space, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { getParent, setParent, setSubMaster } from '../../elements/api/product';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import _isEmpty from 'lodash/isEmpty';
import { useDispatch, useSelector } from 'react-redux';
import { setSubMasteAction } from '../../redux/actions/product';


export const SubMasterPanel = () => {
	const [form] = Form.useForm();
	const [data, setData] = useState([]);
	const [name, setName] = useState('');
	const [visible, setVisible] = useState(false)
	const [isEdit, setIsEdit] = useState(false)
	const [selectedID, setSelectedID] = useState(null)

	const dispatch = useDispatch()

	const productReducer = useSelector(state => state.productReducer)

	const getMasterName = (parentID) => {
		if(productReducer.master.length){
			return productReducer.master.filter(({id}) => id === parentID )[0]['name'];
		}
	}

	useEffect(() => { 
		if(productReducer.subMaster.length){
			let res = productReducer.subMaster;
			res = res.map(data => { return {data, masterName: getMasterName(data.parentID)}})
				setData(res)
		}
	}, [productReducer.subMaster])

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			width: '15%',
			editable: false,
		},
		{
			title: 'Name',
			dataIndex: 'name',
			width: '25%',
			editable: true,
		},
        {
			title: 'Master Name',
			dataIndex: 'masterName',
			width: '25%',
			editable: true,
		},
		{
			title:'Action',
			render:(data)=><Space>
                <Button  type="primary" onClick={()=>setSelectedID(data.id)}>Edit</Button>
				<Popconfirm  title="Are you sure you want to delete this?" onConfirm={ () => handleDelete(data.id)} >
                	<Button type="primary" danger >Delete</Button>
				</Popconfirm>
            </Space>
		}
	];

	const handleDelete = async (id) => {
		let res = await setSubMaster({id, action:"DELETE"});
		if(res.status !== "0"){
			dispatch(setSubMasteAction());
			toast.success(res.msg);
		}else 
			toast.error(res.msg); 
	}

	useEffect(()=>{
		if(selectedID !== null){
			setVisible(true)
			setIsEdit(true)
			let formValue = data.filter(({id}) => id === selectedID )[0]
			console.log(formValue)
			form.setFieldsValue({...formValue})
		}
	},[selectedID])


	const handleOk = async () => {
		if (isEdit) {

		} else {
			if (name === '') {
				toast.error("It cannot be empty");
				return;
			}
			let res = await setParent({ name, action: "INSERT" })
			console.log(res)
		}
	}

	const onCancel = () => {
		setName('');
		setVisible(false)
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
                <Form.Item label="Master Name" name="parentID">
						<Select placeholder="Please Select ....">
							{productReducer.master.map(data  => <Select.Option value={data.id}  key={data.id} >{data.name}</Select.Option>)} 
                        </Select>
					</Form.Item>
                    <Form.Item label="Sub-Master Name" name="name">
						<Input />
					</Form.Item>
					<Button type="primary"  htmlType="submit" >{isEdit ? "Edit" : "Save"}</Button>
				</Form>
			</Modal>
			<Button onClick={() => setVisible(true)} icon={<PlusOutlined />} type="primary" >Add</Button><br />
			<br />
			<Form form={form} component={false}>
				<Table
					dataSource={data}
					columns={columns}
					rowClassName="editable-row"
				/>
			</Form>
		</div>
	);
};

